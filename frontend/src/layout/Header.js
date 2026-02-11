function Header() {
  return (
    <header
      style={{
        padding: "24px 0",
        borderBottom: "1px solid #e0e0e0",
        marginBottom: "24px"
      }}
    >
      <h1 style={{ margin: 0 }}>
        Digital Task Dependency Manager
      </h1>
      <p style={{ marginTop: "8px", color: "#666" }}>
        Plan tasks intelligently with dependency-aware workflows
      </p>
    </header>
  );
}

export default Header;
