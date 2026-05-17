import { chmodSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const ARTIFACT_KINDS = new Set(['page', 'lab']);

function slugify(value) {
  return String(value || 'learning-artifact')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'learning-artifact';
}

function titleCase(value) {
  return String(value || '')
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase() + part.slice(1))
    .join(' ');
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function artifactCopy(topic, kind) {
  const title = titleCase(topic || 'learning artifact');
  if (kind === 'page') {
    return {
      title: `${title} — Learning Page`,
      objective: `Build a compact mental model for ${topic}.`,
      action: `Write a one-sentence prediction about ${topic}, then compare it with the revealed explanation.`,
      checkpoint: `Explain ${topic} back in your own words without using the page text.`,
    };
  }
  return {
    title: `${title} — Interactive Lab`,
    objective: `Explore how one parameter changes your intuition for ${topic}.`,
    action: `Move the slider, predict the output first, then reveal feedback.`,
    checkpoint: `Name the parameter range where your intuition changed and why.`,
  };
}

function htmlFor({ topic, kind }) {
  const copy = artifactCopy(topic, kind);
  const safeTopic = escapeHtml(topic);
  const safeTitle = escapeHtml(copy.title);
  const safeObjective = escapeHtml(copy.objective);
  const safeAction = escapeHtml(copy.action);
  const safeCheckpoint = escapeHtml(copy.checkpoint);
  const isLab = kind === 'lab';
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${safeTitle}</title>
  <style>
    :root { color-scheme: dark; --bg:#050505; --panel:#111; --panel2:#171717; --text:#ededed; --muted:#8f8f8f; --line:#2a2a2a; --blue:#0070f3; --green:#46a758; --amber:#ffb224; --red:#e5484d; }
    * { box-sizing: border-box; }
    body { margin: 0; min-height: 100vh; background: radial-gradient(circle at 20% 0%, #111827 0, transparent 34rem), var(--bg); color: var(--text); font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
    main { width: min(1120px, calc(100vw - 40px)); margin: 0 auto; padding: 48px 0; }
    .eyebrow { color: var(--blue); font-size: 12px; font-weight: 700; letter-spacing: .18em; text-transform: uppercase; }
    h1 { max-width: 780px; margin: 12px 0 10px; font-size: clamp(32px, 6vw, 68px); line-height: .94; letter-spacing: -.06em; }
    .lede { max-width: 680px; color: var(--muted); font-size: 18px; line-height: 1.6; }
    .grid { display: grid; grid-template-columns: minmax(0, 1fr) minmax(320px, 440px); gap: 18px; margin-top: 34px; align-items: start; }
    .card { border: 1px solid var(--line); background: color-mix(in oklab, var(--panel) 92%, transparent); border-radius: 20px; padding: 22px; box-shadow: 0 20px 80px rgba(0,0,0,.25); }
    .card h2 { margin: 0 0 12px; font-size: 16px; letter-spacing: -.02em; }
    .step { display: grid; gap: 12px; }
    .label { color: var(--muted); font-size: 12px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; }
    textarea { width: 100%; min-height: 110px; resize: vertical; border: 1px solid var(--line); border-radius: 14px; background: #090909; color: var(--text); padding: 14px; font: inherit; line-height: 1.45; outline: none; }
    textarea:focus, input:focus { border-color: var(--blue); box-shadow: 0 0 0 3px rgba(0,112,243,.18); }
    button { border: 0; border-radius: 999px; padding: 10px 14px; background: var(--text); color: #050505; font-weight: 700; cursor: pointer; }
    button.secondary { background: var(--panel2); color: var(--text); border: 1px solid var(--line); }
    .feedback { display: none; border-left: 3px solid var(--green); background: rgba(70,167,88,.09); border-radius: 14px; padding: 14px; color: #dff7e4; line-height: 1.5; }
    .feedback.visible { display: block; }
    .meter { height: 12px; border-radius: 999px; background: #222; overflow: hidden; }
    .meter > div { height: 100%; width: 50%; background: linear-gradient(90deg, var(--blue), var(--green), var(--amber)); transition: width 120ms ease; }
    input[type="range"] { width: 100%; accent-color: var(--blue); }
    .output { min-height: 160px; display: grid; place-items: center; border: 1px solid var(--line); border-radius: 18px; background: radial-gradient(circle, rgba(0,112,243,.20), transparent var(--radius, 40%)), #080808; transition: background 120ms ease; }
    .orb { width: var(--orb, 88px); height: var(--orb, 88px); border-radius: 999px; background: linear-gradient(135deg, var(--blue), var(--green)); box-shadow: 0 0 var(--glow, 40px) rgba(0,112,243,.45); transition: width 120ms ease, height 120ms ease, box-shadow 120ms ease; }
    .callout { border: 1px solid rgba(255,178,36,.35); background: rgba(255,178,36,.08); border-radius: 16px; padding: 14px; color: #ffe4ad; }
    .checkpoint { border-left: 3px solid var(--blue); padding-left: 14px; color: var(--muted); line-height: 1.55; }
    .progress { display: flex; gap: 8px; margin-top: 18px; }
    .dot { width: 9px; height: 9px; border-radius: 50%; background: #333; }
    .dot.done { background: var(--green); }
    @media (max-width: 860px) { .grid { grid-template-columns: 1fr; } main { width: min(100vw - 28px, 720px); padding: 28px 0; } }
  </style>
</head>
<body>
  <main>
    <div class="eyebrow">pi-gnosis ${kind === 'lab' ? 'Geist-style lab' : 'zero-native page'}</div>
    <h1>${safeTitle}</h1>
    <p class="lede">${safeObjective} This surface is temporary: use it to think, then keep your own notes.</p>

    <section class="grid">
      <div class="card step">
        <div>
          <div class="label">1 · attempt first</div>
          <h2>${safeAction}</h2>
        </div>
        <textarea id="attempt" placeholder="Type your prediction or explanation here..."></textarea>
        <div>
          <button id="reveal">Reveal feedback</button>
          <button class="secondary" id="reset">Reset</button>
        </div>
        <div class="feedback" id="feedback">
          Good: you made the model explicit before reading. Now compare your words with the explanation: ${safeTopic} becomes easier when you track what changes, what stays invariant, and where the common misconception breaks.
        </div>
        <div class="checkpoint"><strong>Checkpoint:</strong> ${safeCheckpoint}</div>
        <div class="progress" aria-label="progress"><span class="dot" id="d1"></span><span class="dot" id="d2"></span><span class="dot" id="d3"></span></div>
      </div>

      <aside class="card step">
        <div>
          <div class="label">2 · ${isLab ? 'interactive representation' : 'compact representation'}</div>
          <h2>${isLab ? 'Move the parameter and watch the representation change.' : 'Use the reveal loop before reading the summary.'}</h2>
        </div>
        ${isLab ? `<input id="slider" type="range" min="0" max="100" value="50" />
        <div class="meter"><div id="meter"></div></div>
        <div class="output" id="output"><div class="orb" id="orb"></div></div>
        <div class="callout" id="reading">Parameter = 50. Mid-range values usually hide the boundary cases; push toward the edges to expose the misconception.</div>` : `<div class="callout">Prediction before explanation prevents the page from becoming passive reading. The useful durable artifact is the note you write after this temporary page changes your model.</div>`}
      </aside>
    </section>
  </main>
  <script>
    const attempt = document.querySelector('#attempt');
    const reveal = document.querySelector('#reveal');
    const reset = document.querySelector('#reset');
    const feedback = document.querySelector('#feedback');
    const dots = [document.querySelector('#d1'), document.querySelector('#d2'), document.querySelector('#d3')];
    function updateProgress() {
      dots[0].classList.toggle('done', attempt.value.trim().length > 0);
      dots[1].classList.toggle('done', feedback.classList.contains('visible'));
      dots[2].classList.toggle('done', attempt.value.trim().length > 80 && feedback.classList.contains('visible'));
    }
    attempt.addEventListener('input', updateProgress);
    reveal.addEventListener('click', () => { feedback.classList.add('visible'); updateProgress(); });
    reset.addEventListener('click', () => { attempt.value = ''; feedback.classList.remove('visible'); updateProgress(); });
    const slider = document.querySelector('#slider');
    if (slider) {
      const meter = document.querySelector('#meter');
      const output = document.querySelector('#output');
      const orb = document.querySelector('#orb');
      const reading = document.querySelector('#reading');
      function sync() {
        const value = Number(slider.value);
        meter.style.width = value + '%';
        orb.style.setProperty('--orb', (48 + value * 1.2) + 'px');
        orb.style.setProperty('--glow', (18 + value) + 'px');
        output.style.setProperty('--radius', (20 + value * .7) + '%');
        reading.textContent = 'Parameter = ' + value + '. ' + (value < 25 ? 'Low values expose missing signal.' : value > 75 ? 'High values amplify the effect and reveal instability.' : 'Mid-range values feel intuitive, so test both edges.');
        history.replaceState(null, '', '?parameter=' + value);
      }
      const params = new URLSearchParams(location.search);
      if (params.has('parameter')) slider.value = params.get('parameter');
      slider.addEventListener('input', sync);
      sync();
    }
    updateProgress();
  </script>
</body>
</html>
`;
}

function appZon({ topic, slug, kind }) {
  const display = artifactCopy(topic, kind).title.replace(/"/g, '');
  return `.{
    .id = "dev.pi_gnosis.${slug.replaceAll('-', '_')}",
    .name = "${slug}",
    .display_name = "${display}",
    .version = "0.1.0",
    .platforms = .{ "macos", "linux" },
    .permissions = .{},
    .capabilities = .{ "webview" },
    .frontend = .{
        .dist = "frontend/dist",
        .entry = "index.html",
        .spa_fallback = true,
    },
    .security = .{
        .navigation = .{
            .allowed_origins = .{ "zero://app", "zero://inline" },
            .external_links = .{ .action = "deny" },
        },
    },
    .web_engine = "system",
    .windows = .{
        .{ .label = "main", .title = "${display}", .width = 980, .height = 720, .restore_state = false },
    },
}
`;
}

function packageJson({ slug }) {
  return JSON.stringify({
    name: `${slug}-frontend`,
    private: true,
    version: '0.1.0',
    type: 'module',
    scripts: {
      build: 'vite build',
      dev: 'vite --host 127.0.0.1',
      preview: 'vite preview --host 127.0.0.1',
    },
    dependencies: {
      '@vitejs/plugin-react': '^5.0.0',
      vite: '^7.0.0',
      react: '^19.0.0',
      'react-dom': '^19.0.0',
      'zero-native': '^0.2.0',
    },
    devDependencies: {},
  }, null, 2) + '\n';
}

export function buildInteractiveArtifact({ topic = 'Obsidian notes and active recall', kind = 'lab', outputRoot = '/tmp/pi-gnosis/interactive-artifacts', write = false } = {}) {
  if (!ARTIFACT_KINDS.has(kind)) throw new Error(`Unknown interactive artifact kind: ${kind}`);
  const slug = `${kind}-${slugify(topic)}`;
  const artifactRoot = resolve(outputRoot, slug);
  const copy = artifactCopy(topic, kind);
  const learningSpec = {
    topic,
    kind,
    modality: kind === 'lab' ? 'geist-style-widget' : 'zero-native-page',
    engine: 'zero-native',
    designSystem: kind === 'lab' ? 'geist-learning-patterns' : 'pi-gnosis-page',
    objective: copy.objective,
    loop: ['orient', 'attempt', 'feedback', 'explain', 'checkpoint', 'reflect'],
    durableMemory: 'Learner notes/reflections should be exported separately; this artifact is temporary by default.',
  };
  const pageSpec = {
    title: copy.title,
    route: '/',
    representations: kind === 'lab' ? ['text', 'interactive', 'visual'] : ['text', 'reflection'],
    requiredInteraction: copy.action,
    checkpoint: copy.checkpoint,
    urlState: kind === 'lab' ? ['parameter'] : [],
  };
  const manifest = {
    schema: 'pi-gnosis.interactive-artifact.v1',
    slug,
    topic,
    kind,
    engine: 'zero-native',
    temporary: true,
    artifactRoot,
    files: ['artifact_manifest.json', 'learning_spec.json', 'page_spec.json', 'app.zon', 'frontend/package.json', 'frontend/index.html', 'run.sh', 'README.md'],
    commands: {
      openNative: './run.sh',
      buildFrontend: 'npm install --prefix frontend && npm --prefix frontend run build',
      prepareNativeShell: 'zero-native init native-shell --frontend react',
    },
  };
  const readme = `# ${copy.title}

Temporary pi-gnosis ${kind === 'lab' ? 'Geist-style interactive lab' : 'zero-native page'} for **${topic}**.

## Modality

- text / ASCII / markdown: stay in the Pi conversation
- video: Manim
- page: zero-native
- widget/lab: Geist learning patterns + zero-native

## Run

Open as a native zero-native surface:

\`\`\`bash
./run.sh
\`\`\`

The launcher creates a local zero-native shell under \`native-shell/\`, copies this artifact's \`app.zon\` and frontend into it, builds the frontend, then runs \`zig build run\`. The generated native policy uses system WebView, no native permissions, denied external links, and only local app origins.

This artifact is temporary. Promote learner-written notes through the pi-gnosis note-export path if they should last.
`;
  const run = `#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
command -v zig >/dev/null || { echo "zig is required to run zero-native" >&2; exit 1; }
npm install --prefix frontend
ZERO_NATIVE="$(pwd)/frontend/node_modules/.bin/zero-native"
[ -x "$ZERO_NATIVE" ] || { echo "zero-native dependency did not install a CLI at $ZERO_NATIVE" >&2; exit 1; }
if [ ! -d native-shell ]; then
  "$ZERO_NATIVE" init native-shell --frontend react
fi
cp app.zon native-shell/app.zon
mkdir -p native-shell/frontend
cp frontend/package.json native-shell/frontend/package.json
cp frontend/index.html native-shell/frontend/index.html
npm install --prefix native-shell/frontend
npm --prefix native-shell/frontend run build
(cd native-shell && zig build run)
`;
  const files = {
    'artifact_manifest.json': JSON.stringify(manifest, null, 2) + '\n',
    'learning_spec.json': JSON.stringify(learningSpec, null, 2) + '\n',
    'page_spec.json': JSON.stringify(pageSpec, null, 2) + '\n',
    'app.zon': appZon({ topic, slug, kind }),
    'frontend/package.json': packageJson({ slug }),
    'frontend/index.html': htmlFor({ topic, kind }),
    'run.sh': run,
    'README.md': readme,
  };
  if (write) {
    mkdirSync(artifactRoot, { recursive: true });
    mkdirSync(resolve(artifactRoot, 'frontend'), { recursive: true });
    for (const [name, content] of Object.entries(files)) writeFileSync(resolve(artifactRoot, name), content, 'utf8');
    chmodSync(resolve(artifactRoot, 'run.sh'), 0o755);
  }
  return { artifactRoot, manifest, learningSpec, pageSpec, files };
}
