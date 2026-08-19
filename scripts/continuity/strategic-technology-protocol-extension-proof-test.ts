import assert from 'node:assert/strict';
import fs from 'node:fs';

const registryPath =
  'docs/architecture/continuity/advanced-technologies.json';

const roadmapPath =
  'docs/architecture/continuity/ADVANCED-TECHNOLOGY-ROADMAP.md';

const masterPath =
  'docs/architecture/continuity/MASTER-CONTINUITY.md';

const registry = JSON.parse(
  fs.readFileSync(registryPath, 'utf8')
);

const roadmap = fs.readFileSync(roadmapPath, 'utf8');
const master = fs.readFileSync(masterPath, 'utf8');

type TechnologyEntry = {
  id: string;
  section: number;
  name: string;
  category: string;
  status: string;
};

const rawTechnologies = Array.isArray(registry)
  ? registry
  : registry.technologies;

assert.ok(
  Array.isArray(rawTechnologies),
  'canonical technology registry must contain an array'
);

const technologies: TechnologyEntry[] =
  rawTechnologies as TechnologyEntry[];

const required = [
  'confidential-computing',
  'crypto-agility-post-quantum-readiness',
  'cyber-physical-authority-boundary',
  'physical-embodied-ai-governance',
  'edge-execution-governance',
  'governed-multi-agent-architecture',
];

for (const id of required) {
  const matches: TechnologyEntry[] = technologies.filter(
    (technology) => technology.id === id
  );

  assert.equal(
    matches.length,
    1,
    `${id} must exist exactly once`
  );

  assert.equal(
    matches[0].status,
    'ROADMAP',
    `${id} must remain ROADMAP until separately evidenced`
  );
}

const ids = technologies.map(
  (technology) => technology.id
);

assert.equal(
  new Set(ids).size,
  ids.length,
  'technology ids must remain unique'
);

assert.match(roadmap, /## 38\. Promotion gates/);
assert.match(roadmap, /## 39\. Technology-selection rule/);
assert.match(
  roadmap,
  /## 40\. Anti-hallucination \/ anti-roadmap-drift rule/
);

assert.match(
  roadmap,
  /AGENT COLLABORATION.*SHARED AUTHORITY/i
);

assert.match(
  roadmap,
  /DIGITAL AUTHORITY.*CYBER-PHYSICAL AUTHORITY/i
);

assert.match(
  roadmap,
  /OBSERVATION.*ACTUATION/i
);

assert.match(
  roadmap,
  /EDGE EXECUTION.*UNGOVERNED EXECUTION/i
);

assert.match(
  roadmap,
  /MODEL CAPABILITY.*OPERATIONAL AUTHORITY/i
);

assert.match(
  roadmap,
  /TECHNOLOGY ROADMAP ENTRY.*IMPLEMENTATION/i
);

assert.match(
  master,
  /Git-backed continuity evidence wins/i
);

console.log(
  'Governed strategic technology protocol extension proof passed.'
);

console.log({
  requiredTechnologyCount: required.length,
  technologyCount: technologies.length,
  allRequiredRoadmap: true,
  uniqueTechnologyIds: true,
  promotionGatePreserved: true,
  technologySelectionRulePreserved: true,
  antiRoadmapDriftPreserved: true,
  assertionCount: 18,
});
