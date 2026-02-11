import { useEffect, useState } from "react";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import DonutChart from "./components/DonutChart";
import "./index.css";

/* ---------- Small helper for stats ---------- */
function StatRow({ label, count }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        fontSize: "14px",
        marginBottom: "8px"
      }}
    >
      <span>{label}</span>
      <strong>{count}</strong>
    </div>
  );
}

function App() {
  const [tasks, setTasks] = useState([]);

  /* ---------- Fetch tasks ---------- */
  useEffect(() => {
    fetchTasks();
  }, []);

  async function fetchTasks() {
    const res = await fetch("http://localhost:5000/tasks");
    const data = await res.json();
    setTasks(data);
  }

  /* ---------- Add task ---------- */
  async function addTask(title, dependency) {
    await fetch("http://localhost:5000/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, dependency })
    });
    fetchTasks();
  }

  /* ---------- Toggle completion ---------- */
  async function toggleTask(task) {
    await fetch(`http://localhost:5000/tasks/${task._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !task.completed })
    });
    fetchTasks();
  }

  /* ---------- Edit task (THIS FIXES SAVE ISSUE) ---------- */
  async function editTask(taskId, updatedData) {
    await fetch(`http://localhost:5000/tasks/${taskId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData)
    });
    fetchTasks();
  }

  /* ---------- Delete task ---------- */
  async function deleteTask(taskId) {
    await fetch(`http://localhost:5000/tasks/${taskId}`, {
      method: "DELETE"
    });
    fetchTasks();
  }

  /* ---------- Analytics ---------- */
  const completedCount = tasks.filter(t => t.completed).length;

  const blockedCount = tasks.filter(
    t => t.dependency && !t.dependency.completed
  ).length;

  const pendingCount = tasks.filter(
    t => !t.completed && (!t.dependency || t.dependency.completed)
  ).length;

  /* ---------- Smart Next Task ---------- */
  const nextTask = tasks.find(
    t => !t.completed && (!t.dependency || t.dependency.completed)
  );

  const unlockedTasks = tasks.filter(
    t => t.dependency && nextTask && t.dependency._id === nextTask._id
  );

  /* ---------- UI ---------- */
  return (
    <div className="app-wrapper">
      <h1 className="title">Digital Task Dependency Manager</h1>
      <p className="subtitle">
        Plan tasks intelligently with dependency-aware workflows
      </p>

      <div className="dashboard">
        {/* LEFT PANEL */}
        <div className="task-column">
          <TaskForm onAdd={addTask} tasks={tasks} />

          <TaskList
            tasks={tasks}
            onToggle={toggleTask}
            onDelete={deleteTask}
            onEdit={editTask}
          />
        </div>

        {/* RIGHT PANEL */}
        <div className="insights-column">
          {/* Analytics */}
          <div className="insights-card">
            <h3>Task Analytics</h3>

            <div
              style={{
                display: "flex",
                gap: "20px",
                alignItems: "center",
                marginTop: "12px"
              }}
            >
              <DonutChart
                completed={completedCount}
                pending={pendingCount}
                blocked={blockedCount}
              />

              <div>
                <StatRow label="Completed" count={completedCount} />
                <StatRow label="Pending" count={pendingCount} />
                <StatRow label="Blocked" count={blockedCount} />
              </div>
            </div>
          </div>

          {/* Next Task */}
          <div className="insights-card">
            <h3>Next task</h3>

            {nextTask ? (
              <div
                style={{
                  marginTop: "10px",
                  padding: "12px",
                  borderRadius: "10px",
                  border: "1px solid #e5e7eb"
                }}
              >
                <div style={{ fontSize: "13px", color: "#6b7280" }}>
                  Recommended
                </div>

                <div
                  style={{
                    fontSize: "16px",
                    fontWeight: 600,
                    marginTop: "4px"
                  }}
                >
                  {nextTask.title}
                </div>

                <div
                  style={{
                    marginTop: "6px",
                    fontSize: "13px",
                    color: "#047857"
                  }}
                >
                  Unlocks {unlockedTasks.length} task
                  {unlockedTasks.length !== 1 && "s"}
                </div>

                {unlockedTasks.length > 0 && (
                  <details style={{ marginTop: "8px" }}>
                    <summary
                      style={{
                        fontSize: "13px",
                        color: "#2563eb",
                        cursor: "pointer"
                      }}
                    >
                      View upcoming tasks
                    </summary>

                    <ul
                      style={{
                        marginTop: "6px",
                        paddingLeft: "16px",
                        fontSize: "13px"
                      }}
                    >
                      {unlockedTasks.map(t => (
                        <li key={t._id}>{t.title}</li>
                      ))}
                    </ul>
                  </details>
                )}
              </div>
            ) : (
              <p style={{ fontSize: "14px", color: "#6b7280" }}>
                No available task right now
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
