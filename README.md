# pi-gnosis

[![CI](https://github.com/darkhorseprojects/pi-gnosis/actions/workflows/ci.yml/badge.svg)](https://github.com/darkhorseprojects/pi-gnosis/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

Source-grounded research and non-linear tutoring for [Pi](https://github.com/earendil-works/pi-coding-agent). pi-gnosis turns learning requests into executable Circuitry graph programs instead of lengthy prose responses.

```text
normal Pi conversation
  -> Pi decides pi-gnosis is useful
  -> Pi runs one or more graphs through pi-circuitry
  -> graph agents use pi-web-access for research
  -> results become DAG state, Obsidian notes, or Manim lecture projects
```

## Features

- **Non-linear tutoring**: Adaptive learning that responds to demonstrated understanding
- **Source-grounded research**: Every claim traces back to fetched sources
- **Open-ended probes**: Recall, explain, transfer, contrast, debug - no multiple-choice
- **Obsidian integration**: Export notes to a compatible learning vault
- **Manim lectures**: Generate video lectures with local Manim CE
- **Knowledge tracing**: DAG state tracks understanding depth over time

## Graph Programs

| Graph | Purpose |
| --- | --- |
| `graphs/research.circuitry.yaml` | Delegated research pipeline: scope, query planning, source discovery, fetching, claim extraction, critique, KT DAG seed |
| `graphs/tutoring-session.circuitry.yaml` | Non-linear tutoring turn planner with open-ended probes and state updates |
| `graphs/note-export.circuitry.yaml` | Obsidian-compatible note export from canonical DAG state |
| `graphs/manim-lecture.circuitry.yaml` | Video/lecture project generation using bundled manim-video skill |
| `graphs/cleanup.circuitry.yaml` | Safe cleanup pass for temporary artifacts created by graph runs |
| `graphs/minimal-smoke.circuitry.yaml` | Tiny graph for Circuitry shape validation |

## Installation

```bash
npm install
npm test
```

The package pins `@darkhorseprojects/pi-circuitry` exactly and validates generated Circuitry YAML against the bundled v0.2 structural checker. Runtime execution requires a Pi environment with network access.

## Dependencies

Required:
- `@darkhorseprojects/pi-circuitry` v0.2.6
- `pi-web-access` ^0.10.7

Optional:
- `pi-exa-search` for Exa-first source discovery

## License

MIT - see [LICENSE](LICENSE) file for details.