const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  dependency: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Task",
    default: null
  }
});

module.exports = mongoose.model("Task", taskSchema);
