import { graphPath, loadConfig } from './config.js';

export const GRAPH_PROGRAMS = Object.freeze([
  'research',
  'tutoring-session',
  'note-export',
  'manim-lecture',
  'interactive-artifact',
  'cleanup',
  'smoke',
]);

const REQUEST_RESOURCE_BY_GRAPH = Object.freeze({
  research: 'research_request',
  'tutoring-session': 'session_request',
  'note-export': 'export_request',
  'manim-lecture': 'lecture_request',
  'interactive-artifact': 'artifact_request',
  cleanup: 'cleanup_request',
  smoke: 'smoke_request',
});

export function requestResourceFor(name) {
  const resource = REQUEST_RESOURCE_BY_GRAPH[name];
  if (!resource) throw new Error(`Unknown graph name: ${name}`);
  return resource;
}

export function gnosisGraphInputs(name, input, { config = loadConfig() } = {}) {
  return {
    [requestResourceFor(name)]: input ?? {},
    gnosis_config: config,
  };
}

export function gnosisGraphRunArgs(name, input, options = {}) {
  return {
    filename: graphPath(name),
    inputs: gnosisGraphInputs(name, input, options),
  };
}

export async function runGnosisGraph(name, input, circuitryRunGraph, options = {}) {
  if (typeof circuitryRunGraph !== 'function') {
    throw new TypeError('runGnosisGraph requires a circuitry_run_graph-compatible function');
  }
  return circuitryRunGraph(gnosisGraphRunArgs(name, input, options));
}
