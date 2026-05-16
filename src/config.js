import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT = resolve(__dirname, '..');
const CONFIG_PATH = resolve(PACKAGE_ROOT, 'config/gnosis.config.json');

export function loadConfig(path = CONFIG_PATH) {
  const raw = readFileSync(path, 'utf8');
  const config = JSON.parse(raw);
  if (config?.runtime?.provider !== 'pi') {
    throw new Error('Pi-GNOSIS config must use runtime.provider = pi');
  }
  if (config?.runtime?.model !== 'inherit') {
    throw new Error('Pi-GNOSIS config must default runtime.model = inherit');
  }
  return config;
}

export function packageRoot() {
  return PACKAGE_ROOT;
}

export function graphPath(name) {
  const names = {
    research: 'graphs/research.circuitry.yaml',
    tutoring: 'graphs/tutoring-session.circuitry.yaml',
    'tutoring-session': 'graphs/tutoring-session.circuitry.yaml',
    notes: 'graphs/note-export.circuitry.yaml',
    'note-export': 'graphs/note-export.circuitry.yaml',
    manim: 'graphs/manim-lecture.circuitry.yaml',
    'manim-lecture': 'graphs/manim-lecture.circuitry.yaml',
    cleanup: 'graphs/cleanup.circuitry.yaml',
    smoke: 'graphs/minimal-smoke.circuitry.yaml',
  };
  const rel = names[name];
  if (!rel) throw new Error(`Unknown graph name: ${name}`);
  return resolve(PACKAGE_ROOT, rel);
}
