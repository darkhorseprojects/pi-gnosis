import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import {
  assertAllowedProbe,
  buildManimProject,
  buildReviewSchedule,
  getGraphProgram,
  isForbiddenProbe,
  listGraphPrograms,
  loadConfig,
  planCleanup,
  storagePlan,
  validateCircuitryFile,
} from '../src/index.js';

const config = loadConfig();
assert.equal(config.runtime.provider, 'pi');
assert.equal(config.runtime.model, 'inherit');

for (const name of listGraphPrograms()) {
  const text = getGraphProgram(name);
  assert.match(text, /runtime:\n\s+provider: pi\n\s+model: inherit/);
  assert.doesNotMatch(text, /Generic Simulation Node|Simulation Orchestrator/);
}

for (const file of [
  'graphs/research.circuitry.yaml',
  'graphs/tutoring-session.circuitry.yaml',
  'graphs/note-export.circuitry.yaml',
  'graphs/manim-lecture.circuitry.yaml',
  'graphs/cleanup.circuitry.yaml',
  'graphs/minimal-smoke.circuitry.yaml',
]) {
  const result = validateCircuitryFile(resolve(file));
  assert.equal(result.ok, true, result.issues.join('\n'));
}

assert.equal(isForbiddenProbe('Which of the following is correct? A) x B) y'), true);
assert.throws(() => assertAllowedProbe('multiple choice: choose the correct answer'), /forbidden/i);
assert.equal(assertAllowedProbe('Explain the difference in your own words.'), true);

const schedule = buildReviewSchedule([
  { concept: 'A', decay_risk: 5, misconception_risk: 5 },
  { concept: 'B', decay_risk: 2, misconception_risk: 1 },
], { today: '2026-05-16' });
assert.equal(schedule[0].first_review_date, '2026-05-17');
assert.equal(schedule[1].first_review_date, '2026-05-26');

const plan = storagePlan({ topic: 'DAG vs Obsidian' });
assert.match(plan.canonical.root, /dag-vs-obsidian/);
assert.match(plan.obsidian.root, /dag-vs-obsidian/);

const cleanup = planCleanup([
  '.pi-gnosis/tmp/run-a/scratch.md',
  '.pi-gnosis/state/run-a/source_ledger.json',
  'notes/topic/00-map.md',
  'manim/topic/media/videos/script/480p15/OpeningMap.mp4',
], { applyCleanup: true, allowGeneratedMediaCleanup: false });
assert.equal(cleanup[0].allowed_now, true);
assert.equal(cleanup[1].allowed_now, false);
assert.equal(cleanup[2].allowed_now, false);
assert.equal(cleanup[3].allowed_now, false);

const tmp = mkdtempSync(resolve(tmpdir(), 'pi-gnosis-manim-'));
const project = buildManimProject({ topic: 'KT DAGs', outputRoot: tmp, write: true });
for (const file of ['plan.md', 'scene_spec.json', 'script.py', 'render.sh', 'README.md']) {
  assert.equal(existsSync(resolve(project.projectRoot, file)), true);
}
execFileSync('python3', ['-m', 'py_compile', resolve(project.projectRoot, 'script.py')], { stdio: 'pipe' });

const graphsOutput = execFileSync('node', ['bin/pi-gnosis.js', 'graphs'], { encoding: 'utf8' });
assert.match(graphsOutput, /research/);

console.log('All Pi-GNOSIS tests passed.');
