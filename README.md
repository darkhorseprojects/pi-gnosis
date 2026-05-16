# Pi-GNOSIS

Pi-GNOSIS is a Circuitry-first Pi package for source-grounded research and non-linear tutoring. It depends on `@darkhorseprojects/pi-circuitry` v0.2.6, so the core workflows are not long prose checklists. They are executable Circuitry graph programs.

The package is designed for this shape:

```text
normal Pi conversation
  -> Pi decides Pi-GNOSIS is useful
  -> Pi reads skills/pi-gnosis/SKILL.md
  -> Pi runs one or more graphs through pi-circuitry
  -> graph agents use pi-web-access / optional pi-exa-search for research
  -> results become DAG state, Obsidian notes, or Manim lecture projects
```

## What Circuitry means here

Circuitry is the agentic programming layer. Each graph is already the multi-agent conversation/work simulation: roles, context boundaries, inputs, tool permissions, expected schemas, and output contracts. There is no special "simulator node". The program is the graph.

The packaged graph programs are:

| Graph | Purpose |
| --- | --- |
| `graphs/research.circuitry.yaml` | Delegated research pipeline: scope, query planning, source discovery, fetching, claim extraction, critique, KT DAG seed. |
| `graphs/tutoring-session.circuitry.yaml` | Non-linear tutoring turn planner with open-ended probes and state updates. |
| `graphs/note-export.circuitry.yaml` | Optional Obsidian-compatible note export from canonical DAG state. |
| `graphs/manim-lecture.circuitry.yaml` | Video/lecture project generation using the bundled `manim-video` skill. |
| `graphs/cleanup.circuitry.yaml` | Safe cleanup pass for temporary artifacts created by graph runs. |
| `graphs/minimal-smoke.circuitry.yaml` | Tiny graph used to smoke-test Circuitry shape. |

All graphs use:

```yaml
runtime:
  provider: pi
  model: inherit
```

and each agent node also declares `model: inherit`, so the graph inherits the active Pi conversation model unless the user explicitly overrides the package config.

## Dependencies

Required:

```json
{
  "@darkhorseprojects/pi-circuitry": "github:darkhorseprojects/pi-circuitry#v0.2.6",
  "pi-web-access": "^0.10.7"
}
```

Optional but useful:

```json
{
  "pi-exa-search": "github:najibninaba/pi-exa-search#main"
}
```

`pi-web-access` provides `web_search` and `fetch_content`. `pi-exa-search` provides `exa_search` for Exa-first source discovery.

## DAG state vs Obsidian

DAG state is canonical runtime state. Obsidian is learner-facing memory.

DAG state stores typed program artifacts:

```text
.pi-gnosis/state/<run-id>/
  run_manifest.json
  source_ledger.json
  claim_ledger.json
  kt_dag.json
  learner_state.json
  probe_results.json
  review_schedule.json
  output_manifest.json
```

Obsidian stores notes the person can actually learn from:

```text
notes/<topic>/
  00-map.md
  source-ledger.md
  concepts/*.md
  probes.md
  review-plan.md
  reflection-log.md
```

Pi may read Obsidian notes to infer evidence of prior understanding, but Obsidian notes are not the source of truth for provenance or scheduling. The KT DAG is.

## Manim output

The bundled `skills/manim-video/SKILL.md` is an original local Manim CE skill inspired by the public Nous/Hermes Manim Video documentation. The graph `graphs/manim-lecture.circuitry.yaml` references `skills: [pi-gnosis, manim-video]`, so the Manim-generation agent can load that skill directly.

Rendering requires local Manim CE, LaTeX, and ffmpeg. The package can generate and validate a project structure even when rendering is unavailable.

## Tests

Run from the package root:

```bash
npm test
```

The tests validate package-authored helpers, graph shape, Circuitry v0.2 constraints, model inheritance, no legacy edges, no bogus simulation node, safe cleanup planning, and Manim project syntax.

## Honesty about upstream runtime tests

This repository was built in an offline shell, so `npm install` from GitHub could not run here. The package pins `@darkhorseprojects/pi-circuitry` exactly as requested and validates every generated Circuitry YAML against the bundled v0.2 structural checker. Official runtime execution should be performed in a Pi environment with network access and the installed dependencies.
