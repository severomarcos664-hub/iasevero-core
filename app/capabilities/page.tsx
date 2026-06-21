const capabilityGroups = [
  {
    group: "Core Runtime",
    capabilities: [
      "Runtime Core",
      "Runtime Context",
      "Runtime State",
      "Runtime Cognitive Core",
      "Runtime Unified Intelligence Bus",
    ],
  },
  {
    group: "Governance & Authority",
    capabilities: [
      "Executive Authority Gateway",
      "Executive Governor",
      "Policy Engine",
      "Decision Gate",
      "Runtime Enforcement Authority",
    ],
  },
  {
    group: "Execution",
    capabilities: [
      "Execution Pipeline",
      "Execution Router",
      "Execution Graph",
      "Workflow Coordinator",
      "Queue Manager",
      "Scheduler",
    ],
  },
  {
    group: "Memory",
    capabilities: [
      "Runtime Memory",
      "Operational Memory",
      "Brain Matrix",
      "Persistence Memory",
      "Memory Consolidation",
    ],
  },
  {
    group: "Observability",
    capabilities: [
      "Runtime Telemetry",
      "Causal Trace",
      "Correlation Layer",
      "Event Bus",
      "Event Processor",
    ],
  },
  {
    group: "Recovery & Resilience",
    capabilities: [
      "Recovery Engine",
      "Self Healing",
      "Autonomous Stabilizer",
      "Incident Runtime",
      "Replay Engine",
    ],
  },
];

export default function CapabilitiesPage() {
  return (
    <main style={{ padding: 32, fontFamily: "system-ui, sans-serif" }}>
      <section style={{ marginBottom: 32 }}>
        <h1>IASevero Capability Registry</h1>
        <p>
          Read-only enterprise view of the runtime capabilities currently mapped
          inside the IASevero platform.
        </p>
      </section>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 16,
        }}
      >
        {capabilityGroups.map((group) => (
          <article
            key={group.group}
            style={{
              border: "1px solid #ddd",
              borderRadius: 12,
              padding: 20,
              background: "#fff",
            }}
          >
            <h2 style={{ marginTop: 0 }}>{group.group}</h2>
            <ul>
              {group.capabilities.map((capability) => (
                <li key={capability}>{capability}</li>
              ))}
            </ul>
          </article>
        ))}
      </section>
    </main>
  );
}
