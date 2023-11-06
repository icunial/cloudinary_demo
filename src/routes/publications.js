const { Router } = require("express");
const router = Router();

const Publication = require("../models/Publications");

const validations = require("../utils/validations/publications");

const { createPublication } = require("../controllers/publications");

const { uploadImage, deleteImage } = require("../utils/cloudinary");
const fs = require("fs-extra");
const fileUpload = require("express-fileupload");

const { validateId } = require("../utils/validations/index");

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

// Delete image of a publication
router.put("/image/remove/:id", async (req, res, next) => {
  const { id } = req.params;

  if (!validateId(id)) {
    return res.status(400).json({
      statusCode: 400,
      msg: `ID invalid format!`,
    });
  }

  try {
    const publicationFound = await Publication.findByPk(id);

    if (!publicationFound) {
      return res.status(404).json({
        statusCode: 404,
        msg: `Publication with ID: ${id} not found!`,
      });
    }

    if (!publicationFound.image_id) {
      return res.status(400).json({
        statusCode: 400,
        msg: "This publication does not have an image to delete!",
      });
    }

    const result = await deleteImage(publicationFound.image_id);

    if (result) {
      const publicationUpdated = await Publication.update(
        {
          image: null,
          image_id: null,
        },
        {
          where: {
            id,
          },
        }
      );

      res.status(200).json({
        statusCode: 200,
        msg: "Image deleted successfully!",
      });
    }
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
