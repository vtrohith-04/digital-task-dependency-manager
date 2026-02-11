import { useState } from "react";

function TaskForm({ onAdd, tasks }) {
  const [title, setTitle] = useState("");
  const [dependency, setDependency] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) return;

    onAdd(title, dependency || null);
    setTitle("");
    setDependency("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        gap: "12px",
        alignItems: "center",
        marginBottom: "24px",
        flexWrap: "wrap"
      }}
    >
      <input
        type="text"
        placeholder="Enter task name"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{
          padding: "10px",
          minWidth: "220px",
          borderRadius: "6px",
          border: "1px solid #ccc"
        }}
      />

      <select
        value={dependency}
        onChange={(e) => setDependency(e.target.value)}
        style={{
          padding: "10px",
          borderRadius: "6px",
          border: "1px solid #ccc"
        }}
      >
        <option value="">No Dependency</option>
        {tasks.map((task) => (
          <option key={task._id} value={task._id}>
            {task.title}
          </option>
        ))}
      </select>

      <button
        type="submit"
        style={{
          padding: "10px 16px",
          borderRadius: "6px",
          border: "none",
          backgroundColor: "#2c3e50",
          color: "#fff",
          cursor: "pointer"
        }}
      >
        Add Task
      </button>
    </form>
  );
}

export default TaskForm;
