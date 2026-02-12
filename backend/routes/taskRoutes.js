const express = require("express");
const Task = require("../models/Task");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

/*
  🔁 Helper: Circular Dependency Detection
*/
async function hasCircularDependency(taskId, dependencyId, userId) {
  let current = dependencyId;

  while (current) {
    if (taskId && current.toString() === taskId.toString()) {
      return true;
    }

    const task = await Task.findOne({
      _id: current,
      user: userId
    });

    if (!task || !task.dependency) break;

    current = task.dependency;
  }

  return false;
}

/*
  GET all tasks
*/
router.get("/", authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find({
      user: req.user.id
    }).populate("dependency");

    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

/*
  CREATE task
*/
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, dependency } = req.body;

    if (!title || title.trim() === "") {
      return res.status(400).json({
        error: "Task title is required"
      });
    }

    if (dependency) {
      const circular = await hasCircularDependency(
        null,
        dependency,
        req.user.id
      );

      if (circular) {
        return res.status(400).json({
          error: "Circular dependency detected"
        });
      }
    }

    const task = new Task({
      title,
      dependency: dependency || null,
      user: req.user.id
    });

    await task.save();

    const savedTask = await Task.findById(task._id).populate("dependency");

    res.status(201).json(savedTask);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

/*
  UPDATE task
*/
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const taskId = req.params.id;
    const { title, dependency, completed } = req.body;

    const existingTask = await Task.findOne({
      _id: taskId,
      user: req.user.id
    });

    if (!existingTask) {
      return res.status(404).json({
        error: "Task not found"
      });
    }

    if (dependency && dependency === taskId) {
      return res.status(400).json({
        error: "Task cannot depend on itself"
      });
    }

    if (dependency) {
      const circular = await hasCircularDependency(
        taskId,
        dependency,
        req.user.id
      );

      if (circular) {
        return res.status(400).json({
          error: "Circular dependency detected"
        });
      }
    }

    if (title !== undefined) existingTask.title = title;
    if (dependency !== undefined) existingTask.dependency = dependency;
    if (completed !== undefined) existingTask.completed = completed;

    await existingTask.save();

    const updatedTask = await Task.findById(taskId).populate("dependency");

    res.json(updatedTask);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

/*
  DELETE task
*/
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const taskId = req.params.id;

    const task = await Task.findOne({
      _id: taskId,
      user: req.user.id
    });

    if (!task) {
      return res.status(404).json({
        error: "Task not found"
      });
    }

    const dependentTask = await Task.findOne({
      dependency: taskId,
      user: req.user.id
    });

    if (dependentTask) {
      return res.status(400).json({
        error: "Cannot delete task. Other tasks depend on it."
      });
    }

    await Task.findByIdAndDelete(taskId);

    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
