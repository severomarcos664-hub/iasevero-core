import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const repositoryRoot = process.cwd();
const routePath = resolve(repositoryRoot, 'app/api/chat/route.ts');
const routeSource = readFileSync(routePath, 'utf8');

const adapterModuleImported =
  routeSource.includes('runtime-tool-execution-adapter');

const adapterRequestCreated =
  routeSource.includes('createRuntimeToolExecutionAdapterRequest');

const adapterEvaluated =
  routeSource.includes('evaluateRuntimeToolExecutionAdapter');

const handoffStillPresent =
  routeSource.includes('createRuntimeToolExecutionHandoff');

assert.equal(
  handoffStillPresent,
  true,
  'Canonical execution handoff must remain integrated in /api/chat.',
);

assert.equal(
  adapterModuleImported,
  true,
  'Execution Adapter must be imported into the canonical /api/chat production path.',
);

assert.equal(
  adapterRequestCreated,
  true,
  'Canonical /api/chat path must create a governed execution adapter request.',
);

assert.equal(
  adapterEvaluated,
  true,
  'Canonical /api/chat path must evaluate the governed execution adapter.',
);

console.log(
  JSON.stringify(
    {
      architecture:
        'governed-tool-execution-adapter-production-path-integration',
      handoffStillPresent,
      adapterModuleImported,
      adapterRequestCreated,
      adapterEvaluated,
      executionApplied: false,
      mutationApplied: false,
    },
    null,
    2,
  ),
);

console.log(
  'Runtime governed tool execution adapter production path integration proof passed.',
);
