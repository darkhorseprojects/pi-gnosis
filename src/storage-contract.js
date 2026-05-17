export const OBSIDIAN_NOTE_FILES = [
  '00-map.md',
  'profile.md',
  'source-ledger.md',
  'concepts/<concept>.md',
  'misconceptions.md',
  'probes.md',
  'review-plan.md',
  'reflection-log.md',
  'sessions/<session>.md',
  'manifest.md',
];

export const TEMP_ARTIFACT_FILES = {
  manim: ['plan.md', 'scene_spec.json', 'script.py', 'render.sh', 'README.md'],
  interactive: ['artifact_manifest.json', 'learning_spec.json', 'page_spec.json', 'app.zon', 'frontend/package.json', 'frontend/index.html', 'run.sh', 'README.md'],
};

function slugify(value) {
  return String(value || 'topic').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'topic';
}

export function storagePlan({ topic = 'topic', obsidianRoot = 'notes', manimRoot = 'manim', tempRoot = '.pi-gnosis/tmp' } = {}) {
  const slug = slugify(topic);
  return {
    obsidian: {
      root: `${obsidianRoot}/${slug}`,
      profile: `${obsidianRoot}/profile.md`,
      role: 'durable learner notes and user profile',
      files: OBSIDIAN_NOTE_FILES.map((name) => `${obsidianRoot}/${slug}/${name}`),
    },
    temp: {
      root: `${tempRoot}/${slug}`,
      role: 'ephemeral working files and cleanup-eligible scratch space',
      files: [],
    },
    manim: {
      root: `${manimRoot}/${slug}`,
      role: 'video lecture project output',
      files: TEMP_ARTIFACT_FILES.manim.map((name) => `${manimRoot}/${slug}/${name}`),
    },
    interactive: {
      root: `${tempRoot}/interactive-artifacts/${slug}`,
      role: 'temporary zero-native page or lab artifact',
      files: TEMP_ARTIFACT_FILES.interactive.map((name) => `${tempRoot}/interactive-artifacts/${slug}/${name}`),
    },
  };
}
