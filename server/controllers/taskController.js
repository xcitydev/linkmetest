const Task = require("../models/task");

const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ owner: req.user._id });
    res.send(tasks);
  } catch (err) {
    res.status(500).send({ error: "Failed to fetch tasks" });
  }
};

const createTask = async (req, res) => {
  const task = new Task({ ...req.body, owner: req.user._id });
  try {
    await task.save();
    res.status(201).send(task);
  } catch (err) {
    res.status(400).send({ error: "Failed to create task" });
  }
};

const updateTask = async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["description", "completed", "name", "priority"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates" });
  }

  try {
    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!task) {
      return res.status(404).send({ error: "Task not found" });
    }

    updates.forEach((update) => (task[update] = req.body[update]));
    await task.save();
    res.send(task);
  } catch (err) {
    res.status(400).send({ error: "Failed to update task" });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!task) {
      return res.status(404).send({ error: "Task not found" });
    }
    res.send(task);
  } catch (err) {
    res.status(500).send({ error: "Failed to delete task" });
  }
};

module.exports = { getTasks, createTask, updateTask, deleteTask };
