import { readFileSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { homedir } from 'node:os';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT = resolve(__dirname, '..');
const CONFIG_PATH = resolve(PACKAGE_ROOT, 'config/gnosis.config.json');
const USER_CONFIG_PATH = resolve(homedir(), '.pi/pi-gnosis.json');

function deepMerge(target, source) {
  if (!source) return target;
  const result = { ...target };
  for (const key of Object.keys(source)) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      result[key] = deepMerge(result[key] || {}, source[key]);
    } else {
      result[key] = source[key];
    }
  }
  return result;
}

export function loadConfig(path = CONFIG_PATH, loadUser = true) {
  const raw = readFileSync(path, 'utf8');
  let config = JSON.parse(raw);

  if (loadUser && existsSync(USER_CONFIG_PATH)) {
    try {
      const userRaw = readFileSync(USER_CONFIG_PATH, 'utf8');
      const userConfig = JSON.parse(userRaw);
      config = deepMerge(config, userConfig);
    } catch {
      // Ignore user config errors, fall back to package config
    }
  }

  if (config?.runtime?.provider !== 'pi') {
    throw new Error('Pi-GNOSIS config must use runtime.provider = pi');
  }
  if (config?.runtime?.model !== 'inherit') {
    throw new Error('Pi-GNOSIS config must default runtime.model = inherit');
  }
  return config;
}

export function loadUserConfig() {
  if (existsSync(USER_CONFIG_PATH)) {
    try {
      const raw = readFileSync(USER_CONFIG_PATH, 'utf8');
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }
  return null;
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
    artifact: 'graphs/interactive-artifact.circuitry.yaml',
    'interactive-artifact': 'graphs/interactive-artifact.circuitry.yaml',
    page: 'graphs/interactive-artifact.circuitry.yaml',
    lab: 'graphs/interactive-artifact.circuitry.yaml',
    cleanup: 'graphs/cleanup.circuitry.yaml',
    smoke: 'graphs/minimal-smoke.circuitry.yaml',
  };
  const rel = names[name];
  if (!rel) throw new Error(`Unknown graph name: ${name}`);
  return resolve(PACKAGE_ROOT, rel);
}
