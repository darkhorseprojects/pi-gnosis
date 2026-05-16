import { readFileSync } from 'node:fs';
import { graphPath } from './config.js';

export function getGraphProgram(name) {
  return readFileSync(graphPath(name), 'utf8');
}

export function listGraphPrograms() {
  return ['research', 'tutoring-session', 'note-export', 'manim-lecture', 'cleanup', 'smoke'];
}
