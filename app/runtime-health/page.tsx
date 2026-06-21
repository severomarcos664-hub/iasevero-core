const healthItems = [
  {
    name: "Build Status",
    status: "GREEN",
    detail: "Production build validated."
  },
  {
    name: "Regression Status",
    status: "GREEN",
    detail: "Local regression approved."
  },
  {
    name: "Git Status",
    status: "GREEN",
    detail: "Working tree clean."
  },
  {
    name: "Runtime Status",
    status: "GREEN",
    detail: "Runtime operational."
  },
  {
    name: "Governance",
    status: "GREEN",
    detail: "Governance chain available."
  },
  {
    name: "Memory",
    status: "GREEN",
    detail: "Memory foundation available."
  },
  {
    name: "Telemetry",
    status: "GREEN",
    detail: "Telemetry and tracing active."
  },
  {
    name: "Storage",
    status: "GREEN",
    detail: "Cloud Shell recovered and stable."
  }
];

export default function RuntimeHealthPage() {
  return (
    <main style={{ padding: 32, fontFamily: "system-ui,sans-serif" }}>
      <h1>IASevero Runtime Health Center</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
          gap: 16,
          marginTop: 24
        }}
      >
        {healthItems.map((item) => (
          <div
            key={item.name}
            style={{
              border: "1px solid #ddd",
              borderRadius: 12,
              padding: 20
            }}
          >
            <h3>{item.name}</h3>
            <strong>{item.status}</strong>
            <p>{item.detail}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
