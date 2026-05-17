import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import {
  assertAllowedProbe,
  buildInteractiveArtifact,
  buildManimProject,
  buildReviewSchedule,
  getGraphProgram,
  gnosisGraphRunArgs,
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
  assert.match(text, /gnosis_config:/);
  assert.doesNotMatch(text, /Generic Simulation Node|Simulation Orchestrator/);
}

const manimArgs = gnosisGraphRunArgs('manim-lecture', { topic: 'Linear algebra', apply_writes: true }, { config });
assert.match(manimArgs.filename, /manim-lecture\.circuitry\.yaml$/);
assert.deepEqual(manimArgs.inputs.lecture_request, { topic: 'Linear algebra', apply_writes: true });
assert.equal(manimArgs.inputs.gnosis_config.runtime.provider, 'pi');
assert.throws(() => gnosisGraphRunArgs('unknown', {}), /Unknown graph name/);

for (const file of [
  'graphs/research.circuitry.yaml',
  'graphs/tutoring-session.circuitry.yaml',
  'graphs/note-export.circuitry.yaml',
  'graphs/manim-lecture.circuitry.yaml',
  'graphs/interactive-artifact.circuitry.yaml',
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

const plan = storagePlan({ topic: 'Obsidian notes' });
assert.match(plan.obsidian.root, /obsidian-notes/);
assert.match(plan.obsidian.profile, /notes\/profile\.md$/);
assert.match(plan.manim.root, /obsidian-notes/);
assert.match(plan.interactive.root, /obsidian-notes/);

const cleanup = planCleanup([
  '/tmp/pi-gnosis/run-a/scratch.md',
  'notes/topic/00-map.md',
  'notes/profile.md',
  'manim/topic/media/videos/script/480p15/OpeningMap.mp4',
], { applyCleanup: true, allowGeneratedMediaCleanup: false });
assert.equal(cleanup[0].allowed_now, true);
assert.equal(cleanup[1].allowed_now, false);
assert.equal(cleanup[2].allowed_now, false);
assert.equal(cleanup[3].allowed_now, false);

const tmp = mkdtempSync(resolve(tmpdir(), 'pi-gnosis-manim-'));
const project = buildManimProject({ topic: 'Obsidian notes', outputRoot: tmp, write: true });
for (const file of ['plan.md', 'scene_spec.json', 'script.py', 'render.sh', 'README.md']) {
  assert.equal(existsSync(resolve(project.projectRoot, file)), true);
}
execFileSync('python3', ['-m', 'py_compile', resolve(project.projectRoot, 'script.py')], { stdio: 'pipe' });

const artifactTmp = mkdtempSync(resolve(tmpdir(), 'pi-gnosis-artifact-'));
const artifact = buildInteractiveArtifact({ topic: 'Softmax Temperature', kind: 'lab', outputRoot: artifactTmp, write: true });
for (const file of ['artifact_manifest.json', 'learning_spec.json', 'page_spec.json', 'app.zon', 'frontend/package.json', 'frontend/index.html', 'run.sh', 'README.md']) {
  assert.equal(existsSync(resolve(artifact.artifactRoot, file)), true);
}
const manifest = JSON.parse(readFileSync(resolve(artifact.artifactRoot, 'artifact_manifest.json'), 'utf8'));
assert.equal(manifest.engine, 'zero-native');
assert.equal(manifest.temporary, true);
assert.match(readFileSync(resolve(artifact.artifactRoot, 'frontend/index.html'), 'utf8'), /Reveal feedback/);

const pageArtifact = buildInteractiveArtifact({ topic: 'Claim Ledgers', kind: 'page' });
assert.equal(pageArtifact.manifest.engine, 'zero-native');
assert.equal(pageArtifact.learningSpec.designSystem, 'pi-gnosis-page');

const graphsOutput = execFileSync('node', ['bin/pi-gnosis.js', 'graphs'], { encoding: 'utf8' });
assert.match(graphsOutput, /research/);

console.log('All pi-gnosis tests passed.');
