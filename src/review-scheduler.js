const BASE_INTERVAL_BY_DECAY_RISK = new Map([
  [5, 2],
  [4, 3],
  [3, 5],
  [2, 10],
  [1, 20],
  [0, 30],
]);

function toDateOnly(dateLike) {
  const d = dateLike ? new Date(dateLike) : new Date();
  if (Number.isNaN(d.getTime())) throw new Error(`Invalid date: ${dateLike}`);
  return d;
}

function addDays(date, days) {
  const d = new Date(date.getTime());
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

function clampRisk(n) {
  const v = Number(n ?? 0);
  if (!Number.isFinite(v)) return 0;
  return Math.max(0, Math.min(5, Math.round(v)));
}

export function intervalDaysForConcept(concept) {
  const decay = clampRisk(concept.decay_risk);
  const misconception = clampRisk(concept.misconception_risk);
  const base = BASE_INTERVAL_BY_DECAY_RISK.get(decay) ?? 14;
  let factor = 1;
  if (misconception >= 4) factor = 0.5;
  else if (misconception === 3) factor = 0.75;
  return Math.max(1, Math.round(base * factor));
}

export function buildReviewSchedule(concepts, options = {}) {
  if (!Array.isArray(concepts)) throw new TypeError('concepts must be an array');
  const today = toDateOnly(options.today || new Date().toISOString().slice(0, 10));
  return concepts.map((concept) => {
    const first = intervalDaysForConcept(concept);
    return {
      concept: concept.concept || concept.label || concept.id,
      first_review_date: addDays(today, first),
      interval_days: [first, first * 2, first * 4].map((n) => Math.max(1, Math.round(n))),
      reasons: {
        decay_risk: clampRisk(concept.decay_risk),
        misconception_risk: clampRisk(concept.misconception_risk),
      },
      promotion_requires: ['define from memory', 'new example', 'transfer', 'contrast', 'misconception repair', 'source check'],
    };
  });
}
