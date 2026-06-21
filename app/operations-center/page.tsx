const sections = [
  {
    title: "Runtime Dashboard",
    status: "ACTIVE",
    href: "/runtime-dashboard",
    detail: "Read-only runtime overview."
  },
  {
    title: "Capability Registry",
    status: "ACTIVE",
    href: "/capabilities",
    detail: "Enterprise capability map."
  },
  {
    title: "Runtime Health Center",
    status: "ACTIVE",
    href: "/runtime-health",
    detail: "Operational health visibility."
  }
];

const platformStatus = [
  ["Runtime", "GREEN"],
  ["Governance", "GREEN"],
  ["Authority", "GREEN"],
  ["Memory", "GREEN"],
  ["Telemetry", "GREEN"],
  ["Storage", "STABLE"],
  ["Build", "PASSING"],
  ["Regression", "PASSING"]
];

export default function OperationsCenterPage() {
  return (
    <main style={{ padding: 32, fontFamily: "system-ui,sans-serif" }}>
      <h1>IASevero Operations Center</h1>
      <p>Enterprise read-only control center for IASevero platform operations.</p>

      <section style={{ marginTop: 32 }}>
        <h2>Platform Status</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 12 }}>
          {platformStatus.map(([name, status]) => (
            <div key={name} style={{ border: "1px solid #ddd", borderRadius: 12, padding: 16 }}>
              <strong>{name}</strong>
              <p>{status}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginTop: 32 }}>
        <h2>Operational Modules</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 16 }}>
          {sections.map((section) => (
            <article key={section.title} style={{ border: "1px solid #ddd", borderRadius: 12, padding: 20 }}>
              <h3>{section.title}</h3>
              <strong>{section.status}</strong>
              <p>{section.detail}</p>
              <a href={section.href}>Open</a>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
