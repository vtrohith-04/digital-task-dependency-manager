import { useEffect, useState } from "react";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import DonutChart from "./components/DonutChart";
import AuthPage from "./pages/AuthPage";
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
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );

  /* ---------- Always get fresh token ---------- */
  function getToken() {
    return localStorage.getItem("token");
  }

  /* ---------- Fetch tasks ---------- */
  useEffect(() => {
    if (isAuthenticated) {
      fetchTasks();
    }
  }, [isAuthenticated]);

  async function fetchTasks() {
    try {
      const res = await fetch("http://localhost:5000/api/tasks", {
        headers: {
          Authorization: `Bearer ${getToken()}`
        }
      });

      if (!res.ok) {
        handleLogout();
        return;
      }

      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  }

  /* ---------- Add task ---------- */
  async function addTask(title, dependency) {
    try {
      const res = await fetch("http://localhost:5000/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`
        },
        body: JSON.stringify({ title, dependency })
      });

      if (res.ok) {
        fetchTasks();
      }
    } catch (err) {
      console.error("Error adding task:", err);
    }
  }

  /* ---------- Toggle completion ---------- */
  async function toggleTask(task) {
    try {
      const res = await fetch(
        `http://localhost:5000/api/tasks/${task._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`
          },
          body: JSON.stringify({ completed: !task.completed })
        }
      );

      if (res.ok) {
        fetchTasks();
      }
    } catch (err) {
      console.error("Error toggling task:", err);
    }
  }

  /* ---------- Edit task ---------- */
  async function editTask(taskId, updatedData) {
    try {
      const res = await fetch(
        `http://localhost:5000/api/tasks/${taskId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`
          },
          body: JSON.stringify(updatedData)
        }
      );

      if (res.ok) {
        fetchTasks();
      }
    } catch (err) {
      console.error("Error editing task:", err);
    }
  }

  /* ---------- Delete task ---------- */
  async function deleteTask(taskId) {
    try {
      const res = await fetch(
        `http://localhost:5000/api/tasks/${taskId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${getToken()}`
          }
        }
      );

      if (res.ok) {
        fetchTasks();
      }
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setTasks([]);
  }

  /* ---------- If not logged in ---------- */
  if (!isAuthenticated) {
    return <AuthPage onAuthSuccess={() => setIsAuthenticated(true)} />;
  }

  /* ---------- Analytics ---------- */
  const completedCount = tasks.filter(t => t.completed).length;

  const blockedCount = tasks.filter(
    t => t.dependency && !t.dependency.completed
  ).length;

  const pendingCount = tasks.filter(
    t => !t.completed && (!t.dependency || t.dependency.completed)
  ).length;

  const nextTask = tasks.find(
    t => !t.completed && (!t.dependency || t.dependency.completed)
  );

  const unlockedTasks = tasks.filter(
    t => t.dependency && nextTask && t.dependency._id === nextTask._id
  );

  /* ---------- UI ---------- */
  return (
    <div className="app-wrapper">
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h1 className="title">Digital Task Dependency Manager</h1>
        <button onClick={handleLogout}>Logout</button>
      </div>

      <p className="subtitle">
        Plan tasks intelligently with dependency-aware workflows
      </p>

      <div className="dashboard">
        <div className="task-column">
          <TaskForm onAdd={addTask} tasks={tasks} />

          <TaskList
            tasks={tasks}
            onToggle={toggleTask}
            onDelete={deleteTask}
            onEdit={editTask}
          />
        </div>

        <div className="insights-column">
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
