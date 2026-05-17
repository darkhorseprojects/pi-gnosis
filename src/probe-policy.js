const FORBIDDEN_RECOGNITION_PATTERNS = [
  /multiple\s*choice/i,
  /select\s+one/i,
  /choose\s+the\s+correct/i,
  /which\s+of\s+the\s+following/i,
  /\bA\)\s+.*\bB\)/s,
];

export function isForbiddenProbe(prompt) {
  return FORBIDDEN_RECOGNITION_PATTERNS.some((re) => re.test(String(prompt || '')));
}

export function assertAllowedProbe(prompt) {
  if (isForbiddenProbe(prompt)) {
    throw new Error('Recognition-only diagnostic probe is forbidden by pi-gnosis policy');
  }
  return true;
}

export function recommendedProbeTypes() {
  return ['recall', 'explain', 'transfer', 'contrast', 'debug', 'teach_back', 'worked_example', 'predict_observe_explain', 'source_check'];
}
