#!/usr/bin/env node
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { buildInteractiveArtifact, buildManimProject, buildReviewSchedule, getGraphProgram, listGraphPrograms, loadConfig, planCleanup, storagePlan, validateCircuitryFile } from '../src/index.js';

function arg(name, fallback = undefined) {
  const prefix = `--${name}=`;
  const found = process.argv.find((a) => a.startsWith(prefix));
  if (found) return found.slice(prefix.length);
  const idx = process.argv.indexOf(`--${name}`);
  if (idx >= 0) return process.argv[idx + 1];
  return fallback;
}

function usage() {
  console.log(`pi-gnosis commands:\n  graphs\n  graph <name>\n  validate <file...>\n  storage-plan --topic <topic>\n  schedule <concept-scores.json> [--today YYYY-MM-DD]\n  manim-sample --topic <topic> --out <dir>\n  artifact-sample --topic <topic> [--kind page|lab] --out <dir>\n  cleanup-plan <path...> [--apply] [--allow-media]`);
}

const cmd = process.argv[2];
try {
  if (!cmd || cmd === 'help' || cmd === '--help') {
    usage();
  } else if (cmd === 'graphs') {
    console.log(JSON.stringify(listGraphPrograms(), null, 2));
  } else if (cmd === 'graph') {
    const name = process.argv[3] || 'research';
    console.log(getGraphProgram(name));
  } else if (cmd === 'validate') {
    const files = process.argv.slice(3);
    if (files.length === 0) throw new Error('validate requires at least one file');
    const results = files.map((f) => validateCircuitryFile(f));
    const issues = results.flatMap((r) => r.issues);
    if (issues.length) throw new Error(issues.join('\n'));
    console.log(JSON.stringify({ ok: true, files }, null, 2));
  } else if (cmd === 'storage-plan') {
    console.log(JSON.stringify(storagePlan({ topic: arg('topic', 'topic') }), null, 2));
  } else if (cmd === 'schedule') {
    const file = process.argv[3];
    if (!file) throw new Error('schedule requires a JSON file');
    const concepts = JSON.parse(await import('node:fs').then((fs) => fs.readFileSync(file, 'utf8')));
    console.log(JSON.stringify(buildReviewSchedule(concepts, { today: arg('today') }), null, 2));
  } else if (cmd === 'manim-sample') {
    const topic = arg('topic', 'knowledge tracing DAGs');
    const out = arg('out', '/tmp/pi-gnosis-manim-sample');
    const project = buildManimProject({ topic, outputRoot: out, write: true });
    console.log(JSON.stringify({ ok: true, projectRoot: project.projectRoot, files: Object.keys(project.files) }, null, 2));
  } else if (cmd === 'artifact-sample') {
    const topic = arg('topic', 'knowledge tracing DAGs');
    const kind = arg('kind', 'lab');
    const out = arg('out', '.pi-gnosis/tmp/interactive-artifacts');
    const artifact = buildInteractiveArtifact({ topic, kind, outputRoot: out, write: true });
    console.log(JSON.stringify({ ok: true, artifactRoot: artifact.artifactRoot, kind, engine: artifact.manifest.engine, files: Object.keys(artifact.files) }, null, 2));
  } else if (cmd === 'cleanup-plan') {
    const paths = process.argv.slice(3).filter((x) => !x.startsWith('--'));
    console.log(JSON.stringify(planCleanup(paths, { applyCleanup: process.argv.includes('--apply'), allowGeneratedMediaCleanup: process.argv.includes('--allow-media') }), null, 2));
  } else if (cmd === 'config') {
    console.log(JSON.stringify(loadConfig(), null, 2));
  } else {
    throw new Error(`Unknown command: ${cmd}`);
  }
} catch (err) {
  console.error(err.message);
  process.exitCode = 1;
}
