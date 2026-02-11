function Dashboard({ tasks }) {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const blocked = tasks.filter(
    t => t.dependency && !t.dependency.completed
  ).length;

  return (
    <section style={{ marginBottom: "32px" }}>
      <div style={{ display: "flex", gap: "16px" }}>
        <StatCard label="Total Tasks" value={total} />
        <StatCard label="Completed" value={completed} />
        <StatCard label="Blocked" value={blocked} />
      </div>
    </section>
  );
}

function StatCard({ label, value }) {
  return (
    <div
      style={{
        padding: "16px",
        border: "1px solid #ddd",
        borderRadius: "8px",
        minWidth: "140px"
      }}
    >
      <h2 style={{ margin: "0 0 6px 0" }}>{value}</h2>
      <span style={{ color: "#555" }}>{label}</span>
    </div>
  );
}

export default Dashboard;
