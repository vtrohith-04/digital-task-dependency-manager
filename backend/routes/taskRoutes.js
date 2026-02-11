const express = require("express");
const Task = require("../models/Task");

const router = express.Router();

/*
  🔁 Helper: Circular Dependency Detection
*/
async function hasCircularDependency(taskId, dependencyId) {
  let current = dependencyId;

  while (current) {
    // If dependency points back to the same task → circular
    if (taskId && current.toString() === taskId.toString()) {
      return true;
    }

    const task = await Task.findById(current);
    if (!task || !task.dependency) break;

    current = task.dependency;
  }

  return false;
}

/*
  GET all tasks
*/
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find().populate("dependency");
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/*
  CREATE a new task
*/
router.post("/", async (req, res) => {
  try {
    const { title, dependency } = req.body;

    if (!title || title.trim() === "") {
      return res.status(400).json({
        error: "Task title is required"
      });
    }

    // Circular check (mainly for safety)
    if (dependency) {
      const circular = await hasCircularDependency(null, dependency);
      if (circular) {
        return res.status(400).json({
          error: "Circular dependency detected"
        });
      }
    }

    const task = new Task({
      title,
      dependency: dependency || null
    });

    await task.save();
    const savedTask = await Task.findById(task._id).populate("dependency");

    res.status(201).json(savedTask);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/*
  UPDATE task (edit title, dependency, completion)
*/
router.put("/:id", async (req, res) => {
  try {
    const taskId = req.params.id;
    const { title, dependency, completed } = req.body;

    // Prevent self-dependency
    if (dependency && dependency === taskId) {
      return res.status(400).json({
        error: "Task cannot depend on itself"
      });
    }

    // Circular dependency check
    if (dependency) {
      const circular = await hasCircularDependency(taskId, dependency);
      if (circular) {
        return res.status(400).json({
          error: "Circular dependency detected"
        });
      }
    }

    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { title, dependency, completed },
      { new: true }
    ).populate("dependency");

    res.json(updatedTask);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/*
  DELETE task safely
*/
router.delete("/:id", async (req, res) => {
  try {
    const taskId = req.params.id;

    // Check if other tasks depend on this task
    const dependentTask = await Task.findOne({ dependency: taskId });

    if (dependentTask) {
      return res.status(400).json({
        error: "Cannot delete task. Other tasks depend on it."
      });
    }

    await Task.findByIdAndDelete(taskId);
    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
