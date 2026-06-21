const cards = [
  { title: "Runtime Health", status: "READY", detail: "Runtime operational baseline validated." },
  { title: "Governance", status: "READY", detail: "Governance and policy layers preserved." },
  { title: "Authority", status: "READY", detail: "Executive authority chain mapped." },
  { title: "Memory", status: "READY", detail: "Runtime memory foundation available." },
  { title: "Telemetry", status: "READY", detail: "Telemetry and trace layers available." },
  { title: "Capabilities", status: "READY", detail: "Capability registry v127.0 published." },
  { title: "Storage", status: "STABLE", detail: "Cloud Shell recovered from critical usage." },
  { title: "Platform Readiness", status: "GREEN", detail: "Build and regression validated." },
];

export default function RuntimeDashboardPage() {
  return (
    <main style={{ padding: 32, fontFamily: "system-ui, sans-serif" }}>
      <section style={{ marginBottom: 32 }}>
        <h1>IASevero Runtime Dashboard</h1>
        <p>Read-only operational overview of the IASevero platform.</p>
      </section>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 16,
        }}
      >
        {cards.map((card) => (
          <article
            key={card.title}
            style={{
              border: "1px solid #ddd",
              borderRadius: 12,
              padding: 20,
              background: "#fff",
            }}
          >
            <h2 style={{ marginTop: 0 }}>{card.title}</h2>
            <strong>{card.status}</strong>
            <p>{card.detail}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
