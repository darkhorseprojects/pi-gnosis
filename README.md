# pi-gnosis

[![npm version](https://img.shields.io/npm/v/@darkhorseprojects/pi-gnosis)](https://www.npmjs.com/package/@darkhorseprojects/pi-gnosis)
[![CI](https://github.com/darkhorseprojects/pi-gnosis/actions/workflows/ci.yml/badge.svg)](https://github.com/darkhorseprojects/pi-gnosis/actions/workflows/ci.yml)
[![License: Apache-2.0](https://img.shields.io/badge/License-Apache--2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

Source-grounded research and non-linear tutoring for [Pi](https://github.com/earendil-works/pi-coding-agent). @darkhorseprojects/pi-gnosis turns learning requests into executable Circuitry graph programs instead of lengthy prose responses.

## Features

- **Non-linear tutoring**: Adaptive learning that responds to demonstrated understanding
- **Source-grounded research**: Every claim traces back to fetched sources
- **Open-ended probes**: Recall, explain, transfer, contrast, debug - no multiple-choice
- **Obsidian integration**: Export notes to a compatible learning vault
- **Manim lectures**: Generate video lectures with local Manim CE
- **zero-native pages**: Generate temporary native learning pages that open as disposable study surfaces
- **Geist-style labs/widgets**: Generate explorable attempt→feedback learning labs using Geist learning patterns on zero-native surfaces
- **Conversation-native text**: Keep text, ASCII diagrams, and markdown in the Pi conversation when no artifact is needed
- **Obsidian-first memory**: Notes, reflections, and prompts are the durable learning surface

## Graph Programs

| Graph | Purpose |
| --- | --- |
| `graphs/research.circuitry.yaml` | Delegated research pipeline: scope, query planning, source discovery, fetching, claim extraction, critique, and Obsidian note planning |
| `graphs/tutoring-session.circuitry.yaml` | Non-linear tutoring turn planner with open-ended probes and state updates |
| `graphs/note-export.circuitry.yaml` | Obsidian note export and refresh from durable notes |
| `graphs/manim-lecture.circuitry.yaml` | Video/lecture project generation using bundled manim-video skill |
| `graphs/interactive-artifact.circuitry.yaml` | Temporary zero-native pages and Geist-style explorable labs/widgets |
| `graphs/cleanup.circuitry.yaml` | Safe cleanup pass for temporary artifacts created by graph runs |
| `graphs/minimal-smoke.circuitry.yaml` | Tiny graph for Circuitry shape validation |

## Installation

```bash
npm install
npm test
```

The package pins `@darkhorseprojects/pi-circuitry` exactly and validates generated Circuitry YAML against the bundled v0.2 structural checker. Runtime execution requires a Pi environment with network access.

## Learning modalities

| Modality | Engine | Persistence |
| --- | --- | --- |
| Text / ASCII / markdown | Pi conversation | Conversation only unless copied into notes |
| Video / lecture | Manim | Generated project/media under configured Manim root |
| Temporary page | zero-native | Disposable artifact under `.pi-gnosis/tmp/interactive-artifacts` |
| Cooler page / widget / explorable lab | Geist learning patterns + zero-native | Disposable artifact; user-facing notes are written into Obsidian |
| Durable notes | Obsidian | Source of truth for what the learner keeps |

Interactive artifacts are active-learning surfaces, not permanent memory. Every generated page or lab must include an attempt, feedback, explanation, checkpoint, and reflection prompt.

## Credits

- Native temporary pages use [Vercel Labs zero-native](https://github.com/vercel-labs/zero-native).
- Geist-style labs/widgets use the bundled `gnosis-geist-learning-lab` skill. Upstream: [Vercel Labs skill-geist-learning-labs](https://github.com/vercel-labs/skill-geist-learning-labs).

## Dependencies

Required:
- `@darkhorseprojects/pi-circuitry` ^0.2.21
- `pi-web-access` ^0.10.7
- `zero-native` ^0.2.0 for temporary native pages and interactive labs

Optional:
- `pi-exa-search` for Exa-first source discovery

## License

Apache 2.0 - see [LICENSE](LICENSE) file for details.