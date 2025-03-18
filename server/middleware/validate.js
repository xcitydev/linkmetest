const validator = require("validator");

const validateSignup = (req, res, next) => {
  console.log("here");
  const { email, password } = req.body;
  if (!validator.isEmail(email)) {
    return res.status(400).send({ error: "Invalid email" });
  }
  if (password.length < 6) {
    return res
      .status(400)
      .send({ error: "Password must be at least 6 characters" });
  }
  next();
};

const validateTask = (req, res, next) => {
  const { name, description, priority, tags, completed } = req.body;
  if (!name || name.trim().length === 0) {
    return res.status(400).send({ error: "Name is required" });
  }
  if (!description || description.trim().length === 0) {
    return res.status(400).send({ error: "Description is required" });
  }
  if (!priority || priority.trim().length === 0) {
    return res.status(400).send({ error: "Priority is required" });
  }
  if (completed !== undefined && typeof completed !== "boolean") {
    return res.status(400).send({ error: "Completed must be a boolean value" });
  }
  if (!Array.isArray(tags)) {
    return res.status(400).send({ error: "Tags must be an array" });
  }
  if (tags.length === 0) {
    return res.status(400).send({ error: "Tags are required" });
  }
  for (const tag of tags) {
    if (typeof tag !== "string" || tag.trim().length === 0) {
      return res
        .status(400)
        .send({ error: "Each tag must be a non-empty string" });
    }
  }
  next();
};

module.exports = { validateSignup, validateTask };
