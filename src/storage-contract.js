export const DAG_STATE_FILES = [
  'run_manifest.json',
  'source_ledger.json',
  'claim_ledger.json',
  'kt_dag.json',
  'learner_state.json',
  'probe_results.json',
  'review_schedule.json',
  'output_manifest.json',
];

export const OBSIDIAN_FILES = [
  '00-map.md',
  'source-ledger.md',
  'concepts/<concept>.md',
  'misconceptions.md',
  'probes.md',
  'review-plan.md',
  'reflection-log.md',
  'manifest.md',
];

export function storagePlan({ topic = 'topic', dagStateRoot = '.pi-gnosis/state', obsidianRoot = 'notes', manimRoot = 'manim' } = {}) {
  const slug = String(topic).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'topic';
  return {
    canonical: {
      root: `${dagStateRoot}/${slug}`,
      role: 'machine-readable runtime state for Pi-GNOSIS and pi-circuitry',
      files: DAG_STATE_FILES.map((name) => `${dagStateRoot}/${slug}/${name}`),
    },
    obsidian: {
      root: `${obsidianRoot}/${slug}`,
      role: 'learner-facing notes and study memory',
      files: OBSIDIAN_FILES.map((name) => `${obsidianRoot}/${slug}/${name}`),
    },
    manim: {
      root: `${manimRoot}/${slug}`,
      role: 'video lecture project output',
      files: ['plan.md', 'scene_spec.json', 'script.py', 'render.sh', 'README.md'].map((name) => `${manimRoot}/${slug}/${name}`),
    },
  };
}
