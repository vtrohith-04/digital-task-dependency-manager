import { useState } from "react";

function TaskList({ tasks, onToggle, onDelete, onEdit }) {
  return (
    <div style={{ marginTop: "24px" }}>
      {tasks.length === 0 && (
        <p style={{ color: "#6b7280" }}>No tasks created yet.</p>
      )}

      {tasks.map(task => (
        <TaskCard
          key={task._id}
          task={task}
          tasks={tasks}
          onToggle={onToggle}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}

function TaskCard({ task, tasks, onToggle, onDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [showChain, setShowChain] = useState(false);

  const [title, setTitle] = useState(task.title);
  const [dependency, setDependency] = useState(
    task.dependency ? task.dependency._id : ""
  );

  const isBlocked = task.dependency && !task.dependency.completed;

  const status = task.completed
    ? "Completed"
    : isBlocked
    ? "Blocked"
    : "Pending";

  const statusStyles = {
    Completed: { background: "#ECFDF5", color: "#065F46" },
    Pending: { background: "#FFFBEB", color: "#92400E" },
    Blocked: { background: "#FEF2F2", color: "#991B1B" }
  };

  function getDependencyChain(task, tasks) {
    const chain = [];
    let current = task.dependency;

    while (current) {
      const found = tasks.find(t => t._id === current._id);
      if (!found) break;
      chain.unshift(found);
      current = found.dependency;
    }

    chain.push(task);
    return chain;
  }

  async function handleSave() {
    const finalDependency = dependency === "" ? null : dependency;

    await onEdit(task._id, {
      title: title.trim(),
      dependency: finalDependency
    });

    setIsEditing(false);
  }

  return (
    <div
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: "12px",
        padding: "18px",
        marginBottom: "16px",
        background: "#ffffff",
        display: "flex",
        justifyContent: "space-between",
        gap: "16px"
      }}
    >
      {/* LEFT SIDE */}
      <div style={{ flex: 1 }}>
        {isEditing ? (
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            style={{
              padding: "8px",
              width: "100%",
              borderRadius: "6px",
              border: "1px solid #d1d5db"
            }}
          />
        ) : (
          <h3 style={{ margin: 0 }}>{task.title}</h3>
        )}

        {task.dependency && !isEditing && (
          <p style={{ marginTop: "6px", fontSize: "14px", color: "#6b7280" }}>
            {isBlocked ? "Blocked by:" : "Depends on:"}{" "}
            <strong>{task.dependency.title}</strong>
          </p>
        )}

        {task.dependency && !isEditing && (
          <button
            onClick={() => setShowChain(!showChain)}
            style={{
              marginTop: "6px",
              background: "none",
              border: "none",
              color: "#2563eb",
              fontSize: "13px",
              cursor: "pointer",
              padding: 0
            }}
          >
            {showChain ? "Hide dependency chain" : "View dependency chain"}
          </button>
        )}

        {showChain && (
          <div
            style={{
              marginTop: "12px",
              padding: "12px",
              borderRadius: "10px",
              background: "#F9FAFB",
              border: "1px solid #e5e7eb"
            }}
          >
            {getDependencyChain(task, tasks).map(step => {
              const stepStatus = step.completed
                ? "Completed"
                : step.dependency && !step.dependency.completed
                ? "Blocked"
                : "Pending";

              return (
                <div
                  key={step._id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "6px 0",
                    fontSize: "14px"
                  }}
                >
                  <span>{step.title}</span>
                  <span
                    style={{
                      ...statusStyles[stepStatus],
                      padding: "4px 10px",
                      borderRadius: "999px",
                      fontSize: "11px",
                      fontWeight: 600
                    }}
                  >
                    {stepStatus}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        <div style={{ marginTop: "12px" }}>
          <label style={{ fontSize: "14px" }}>
            <input
              type="checkbox"
              checked={task.completed}
              disabled={isBlocked}
              onChange={() => onToggle(task)}
            />{" "}
            Mark as completed
          </label>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div
        style={{
          width: "140px",
          display: "flex",
          flexDirection: "column",
          gap: "10px"
        }}
      >
        <div
          style={{
            ...statusStyles[status],
            textAlign: "center",
            padding: "8px",
            borderRadius: "999px",
            fontSize: "12px",
            fontWeight: 600
          }}
        >
          {status}
        </div>

        <button
          onClick={() => setIsEditing(!isEditing)}
          style={{
            padding: "8px",
            borderRadius: "8px",
            background: "#EEF2FF",
            border: "1px solid #c7d2fe",
            color: "#3730A3",
            cursor: "pointer"
          }}
        >
          {isEditing ? "Cancel" : "Edit"}
        </button>

        {isEditing && (
          <>
            <select
              value={dependency}
              onChange={e => setDependency(e.target.value)}
              style={{
                padding: "8px",
                borderRadius: "6px",
                border: "1px solid #d1d5db"
              }}
            >
              <option value="">No Dependency</option>
              {tasks
                .filter(t => t._id !== task._id)
                .map(t => (
                  <option key={t._id} value={t._id}>
                    {t.title}
                  </option>
                ))}
            </select>

            <button
              onClick={handleSave}
              style={{
                padding: "8px",
                borderRadius: "8px",
                background: "#DCFCE7",
                border: "none",
                color: "#166534",
                cursor: "pointer"
              }}
            >
              Save
            </button>
          </>
        )}

        <button
          onClick={() => onDelete(task._id)}
          style={{
            padding: "8px",
            borderRadius: "8px",
            background: "#FEE2E2",
            border: "none",
            color: "#991B1B",
            cursor: "pointer"
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default TaskList;
