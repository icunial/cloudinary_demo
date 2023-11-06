const { Router } = require("express");
const router = Router();

const Publication = require("../models/Publications");

const validations = require("../utils/validations/publications");

const { createPublication } = require("../controllers/publications");

const { uploadImage } = require("../utils/cloudinary");
const fs = require("fs-extra");
const fileUpload = require("express-fileupload");

// Create new publication
router.post(
  "/",
  fileUpload({
    useTempFiles: true,
    tempFileDir: "../uploads",
  }),
  async (req, res, next) => {
    const { title, description } = req.body;

    // Validations

    if (validations.validateTitle(title)) {
      return res.status(400).json({
        statusCode: 400,
        msg: validations.validateTitle(title),
      });
    }

    if (validations.validateDescription(description)) {
      return res.status(400).json({
        statusCode: 400,
        msg: validations.validateDescription(description),
      });
    }

    try {
      if (req.files?.image) {
        const result = await uploadImage(req.files.image.tempFilePath);

        const publicationCreated = await createPublication(
          title,
          description,
          result.secure_url,
          result.public_id
        );

        return res.status(201).json({
          statusCode: 201,
          data: publicationCreated,
        });
      } else {
        const publicationCreated = await createPublication(title, description);

        res.status(201).json({
          statusCode: 201,
          data: publicationCreated,
        });
      }
    } catch (error) {
      return next(error);
    }
  }
);

module.exports = router;
