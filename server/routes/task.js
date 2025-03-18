// taskRoutes.js
const express = require("express");
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");
const auth = require("../middleware/auth");
const { validateTask } = require("../middleware/validate");

const router = express.Router();

router.get("/tasks", auth, getTasks);
router.post("/tasks", auth, validateTask, createTask);
router.put("/tasks/:id", auth, updateTask);
router.delete("/tasks/:id", auth, deleteTask);

module.exports = router;
