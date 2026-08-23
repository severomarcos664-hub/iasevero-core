import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'

type TechnologyEntry = {
  id: string
  name: string
  category: string
  section: number
  status: string
}

type TechnologyRegistry = {
  summary: {
    technologyCount: number
    statusCounts: Record<string, number>
  }
  claimGovernance: {
    roadmapImpliesImplementation: boolean
  }
  authority: {
    manualStatusOverrideAllowed: boolean
  }
  technologies: TechnologyEntry[]
}

const root = process.cwd()

const roadmapPath = path.join(
  root,
  'docs/architecture/continuity/ADVANCED-TECHNOLOGY-ROADMAP.md',
)

const registryPath = path.join(
  root,
  'docs/architecture/continuity/advanced-technologies.json',
)

const roadmap = fs.readFileSync(roadmapPath, 'utf8')

const registry = JSON.parse(
  fs.readFileSync(registryPath, 'utf8'),
) as TechnologyRegistry

const required = [
  {
    id: 'transformer-attention-architecture',
    section: 47,
    name: 'Transformer / Attention Architecture',
    category: 'MODEL DEVELOPMENT',
  },
  {
    id: 'tokenization-representation-engineering',
    section: 48,
    name: 'Tokenization / Representation Engineering',
    category: 'MODEL DEVELOPMENT',
  },
  {
    id: 'neural-scaling-architecture',
    section: 49,
    name: 'Neural Scaling Architecture',
    category: 'MODEL DEVELOPMENT',
  },
  {
    id: 'self-supervised-pretraining',
    section: 50,
    name: 'Self-Supervised Pretraining',
    category: 'LEARNING AND ADAPTATION',
  },
  {
    id: 'ml-compiler-runtime-optimization',
    section: 51,
    name: 'ML Compiler / Runtime Optimization',
    category: 'MODEL DEVELOPMENT',
  },
  {
    id: 'state-space-models',
    section: 52,
    name: 'State Space Models',
    category: 'MODEL DEVELOPMENT',
  },
  {
    id: 'continuous-time-neural-computation',
    section: 53,
    name: 'Continuous-Time Neural Computation',
    category: 'MODEL DEVELOPMENT',
  },
  {
    id: 'search-augmented-test-time-reasoning',
    section: 54,
    name: 'Search-Augmented Test-Time Reasoning',
    category: 'PLANNING AND REASONING',
  },
  {
    id: 'neuro-symbolic-verification',
    section: 55,
    name: 'Neuro-Symbolic Verification',
    category: 'VERIFICATION, RESILIENCE AND SECURITY',
  },
  {
    id: 'active-inference-planning',
    section: 56,
    name: 'Active Inference for Governed Planning',
    category: 'PLANNING AND REASONING',
  },
]

for (const expected of required) {
  const matches = registry.technologies.filter(
    (technology) => technology.id === expected.id,
  )

  assert.equal(
    matches.length,
    1,
    `${expected.id} must exist exactly once`,
  )

  const technology = matches[0]

  assert.equal(technology.section, expected.section)
  assert.equal(technology.name, expected.name)
  assert.equal(technology.category, expected.category)

  assert.equal(
    technology.status,
    'ROADMAP',
    `${expected.id} must remain ROADMAP until separately evidenced`,
  )
}

const ids = registry.technologies.map(
  (technology) => technology.id,
)

assert.equal(
  new Set(ids).size,
  ids.length,
  'technology ids must remain unique',
)

assert.equal(
  registry.summary.technologyCount,
  registry.technologies.length,
  'technologyCount must equal registry length',
)

assert.equal(
  registry.claimGovernance.roadmapImpliesImplementation,
  false,
  'roadmap must not imply implementation',
)

assert.equal(
  registry.authority.manualStatusOverrideAllowed,
  false,
  'manual status override must remain blocked',
)

assert.match(roadmap, /## 38\. Promotion gates/i)
assert.match(roadmap, /## 39\. Technology-selection rule/i)
assert.match(
  roadmap,
  /## 40\. Anti-hallucination \/ anti-roadmap-drift rule/i,
)

assert.match(
  roadmap,
  /TECHNOLOGY ROADMAP ENTRY.*IMPLEMENTATION/i,
)

assert.match(
  roadmap,
  /MODEL CAPABILITY.*OPERATIONAL AUTHORITY/i,
)

assert.match(
  roadmap,
  /STATE SPACE MODEL.*INFINITE CONTEXT/i,
)

assert.match(
  roadmap,
  /SEARCH.*VERIFICATION.*ZERO ERROR/i,
)

assert.match(
  roadmap,
  /ACTIVE INFERENCE.*SELF[- ]MODIFICATION/i,
)

assert.match(
  roadmap,
  /SELF[- ]IMPROVEMENT.*SELF[- ]PROMOTION/i,
)

assert.match(
  roadmap,
  /All sections 41-56 remain subject to sections 38-40/i,
)

console.log(
  'Governed strategic technology roadmap extension v287.36 proof passed.',
)

console.log({
  requiredTechnologyCount: required.length,
  technologyCount: registry.technologies.length,
  allRequiredRoadmap: true,
  uniqueTechnologyIds: true,
  roadmapImpliesImplementation: false,
  manualStatusOverrideBlocked: true,
})
