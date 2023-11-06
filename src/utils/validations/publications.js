// Validates title
const validateTitle = (title) => {
  if (!title) return "Title parameter is missing";
  if (typeof title !== "string") return "Title must be a string";
  return false;
};

// Validate description
const validateDescription = (description) => {
  if (!description) return "Description parameter is missing";
  if (typeof description !== "string") return "Description must be a string";
  return false;
};

module.exports = {
  validateTitle,
  validateDescription,
};
