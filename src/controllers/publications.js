const Publication = require("../models/Publications");

const createPublication = async (title, description, image, image_id) => {
  try {
    const publicationCreated = await Publication.create({
      title,
      description,
      image,
      image_id,
    });
  } catch (error) {
    throw new Error("Error trying to create a new publication");
  }
};

module.exports = {
  createPublication,
};
