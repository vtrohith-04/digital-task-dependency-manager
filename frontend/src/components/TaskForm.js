import { useState } from "react";

function TaskForm({ onAdd, tasks }) {
  const [title, setTitle] = useState("");
  const [dependency, setDependency] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    if (!title.trim()) return;

    const finalDependency = dependency === "" ? null : dependency;

    await onAdd(title.trim(), finalDependency);

    setTitle("");
    setDependency("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        gap: "14px",
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
          padding: "12px",
          minWidth: "280px",
          borderRadius: "8px",
          border: "1px solid #d1d5db",
          fontSize: "14px"
        }}
      />

      <select
        value={dependency}
        onChange={(e) => setDependency(e.target.value)}
        style={{
          padding: "12px",
          borderRadius: "8px",
          border: "1px solid #d1d5db",
          fontSize: "14px"
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
          padding: "12px 18px",
          borderRadius: "8px",
          border: "none",
          backgroundColor: "#2c3e50",
          color: "#fff",
          cursor: "pointer",
          fontWeight: 500
        }}
      >
        Add Task
      </button>
    </form>
  );
}

export default TaskForm;
