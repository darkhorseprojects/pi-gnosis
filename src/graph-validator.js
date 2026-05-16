import { readFileSync } from 'node:fs';

const LEGACY_TOP_LEVEL = ['agents:', 'edges:'];
const BANNED_IDENTITIES = ['Generic Simulation Node', 'Simulation Orchestrator'];

export function validateCircuitryText(text, filename = '<graph>') {
  const issues = [];
  if (!text.includes('circuitry: "0.2"') && !text.includes("circuitry: '0.2'") && !text.includes('circuitry: 0.2')) {
    issues.push(`${filename}: missing circuitry: "0.2"`);
  }
  if (!/runtime:\s*\n\s*provider:\s*pi\s*\n\s*model:\s*inherit/m.test(text)) {
    issues.push(`${filename}: runtime must be provider pi and model inherit`);
  }
  if (!/resources:\s*\n/.test(text)) {
    issues.push(`${filename}: missing resources map`);
  }
  for (const key of LEGACY_TOP_LEVEL) {
    const re = new RegExp(`^${key}`, 'm');
    if (re.test(text)) issues.push(`${filename}: must not use legacy top-level ${key}`);
  }
  for (const phrase of BANNED_IDENTITIES) {
    if (text.includes(phrase)) issues.push(`${filename}: contains banned fake simulation node identity`);
  }
  const agentCount = (text.match(/type:\s*agent/g) || []).length;
  const inheritCount = (text.match(/model:\s*inherit/g) || []).length;
  if (agentCount > 0 && inheritCount < agentCount + 1) {
    issues.push(`${filename}: every agent plus runtime must use model: inherit`);
  }
  return { ok: issues.length === 0, issues };
}

export function validateCircuitryFile(path) {
  return validateCircuitryText(readFileSync(path, 'utf8'), path);
}

export function assertValidCircuitryText(text, filename = '<graph>') {
  const result = validateCircuitryText(text, filename);
  if (!result.ok) throw new Error(result.issues.join('\n'));
  return true;
}
