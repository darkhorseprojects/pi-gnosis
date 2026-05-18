# pi-gnosis

[![npm version](https://img.shields.io/npm/v/@darkhorseprojects/pi-gnosis)](https://www.npmjs.com/package/@darkhorseprojects/pi-gnosis)
[![CI](https://github.com/darkhorseprojects/pi-gnosis/actions/workflows/ci.yml/badge.svg)](https://github.com/darkhorseprojects/pi-gnosis/actions/workflows/ci.yml)
[![License: Apache-2.0](https://img.shields.io/badge/License-Apache--2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

pi-gnosis routes learning requests into saved Circuitry graph programs. Each graph receives two runtime inputs:

- a graph-specific request resource
- `gnosis_config`, loaded from package config and user config

The graph returns a tutoring, research, note, video, page, lab, or cleanup result for Pi to report.

## Runtime contract

```json
{
  "filename": "<package>/graphs/manim-lecture.circuitry.yaml",
  "inputs": {
    "lecture_request": {
      "topic": "linear algebra",
      "scope": "quick intuition",
      "apply_writes": true,
      "render_requested": true
    },
    "gnosis_config": {
      "runtime": { "provider": "pi", "model": "inherit" },
      "paths": {}
    }
  }
}
```

`gnosis_config` is part of every pi-gnosis graph run. It supplies artifact roots, note roots, runtime policy, and cleanup boundaries. Artifact-capable graphs reject or report a blocked state when the configured root needed for a write is unavailable.

Runtime inputs are overlays for one execution. Graph YAML is not edited for learner-specific requests.

## Graph programs

| Graph | Request resource | Output |
| --- | --- | --- |
| `graphs/tutoring-session.circuitry.yaml` | `session_request` | intake, probe, teaching move, or downstream graph route |
| `graphs/research.circuitry.yaml` | `research_request` | source-grounded synthesis and optional note-export input |
| `graphs/note-export.circuitry.yaml` | `export_request` | planned or written Obsidian note update |
| `graphs/manim-lecture.circuitry.yaml` | `lecture_request` | Manim project, render/preflight status, artifact manifest |
| `graphs/interactive-artifact.circuitry.yaml` | `artifact_request` | zero-native page/lab/widget artifact manifest |
| `graphs/cleanup.circuitry.yaml` | `cleanup_request` | cleanup plan and bounded deletion result |
| `graphs/minimal-smoke.circuitry.yaml` | `smoke_request` | dependency/runtime smoke result |

## Configuration

Default config lives at `config/gnosis.config.json`. User config at `~/.pi/pi-gnosis.json` is deep-merged by the package loader.

Default paths:

| Path key | Default |
| --- | --- |
| `temporaryRoot` | `/tmp/pi-gnosis` |
| `obsidianRoot` | `notes` |
| `profileNote` | `notes/profile.md` |
| `manimRoot` | `/tmp/pi-gnosis/manim` |
| `interactiveArtifactRoot` | `/tmp/pi-gnosis/interactive-artifacts` |

Graph stations that write files consume configured roots; they do not choose storage roots from prose.

## Learning surfaces

| Surface | Engine | Persistence |
| --- | --- | --- |
| Text / ASCII / markdown | Pi conversation | conversation only |
| Video / lecture | Manim CE project | configured Manim root |
| Temporary page | zero-native | configured interactive artifact root |
| Lab / widget | Geist-style learning pattern + zero-native | configured interactive artifact root |
| Durable notes | Obsidian-compatible markdown | configured notes root |

## Development

```bash
npm install
npm test
```

The test suite checks graph shape, runtime config policy, probe policy, artifact builders, and package contents.

## Dependencies

Required:

- `@darkhorseprojects/pi-circuitry` 0.2.30
- `pi-web-access` ^0.10.7
- `zero-native` ^0.2.0

Optional:

- `pi-exa-search` for Exa-first source discovery

## Credits

- Native temporary pages use [Vercel Labs zero-native](https://github.com/vercel-labs/zero-native).
- Geist-style lab patterns are adapted from [Vercel Labs skill-geist-learning-labs](https://github.com/vercel-labs/skill-geist-learning-labs).

## License

Apache-2.0. See `LICENSE`.
