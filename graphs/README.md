# pi-gnosis graph programs

These files are saved Circuitry v0.2 graph programs. Pi selects a graph, passes runtime inputs, runs it with `circuitry_run_graph`, reads the result with `circuitry_read_graph`, and reports the graph output.

## Run contract

Every pi-gnosis run has this shape:

```json
{
  "filename": "<package>/graphs/<graph>.circuitry.yaml",
  "inputs": {
    "<request_resource>": {},
    "gnosis_config": {}
  }
}
```

`gnosis_config` is always present. It is loaded by pi-gnosis code from package config plus user config. Graphs use it for note roots, artifact roots, runtime policy, and cleanup boundaries.

Runtime inputs are execution overlays for declared `type: text` resources. They do not rewrite graph files.

## Graph catalog

| File | Request resource | Primary responsibility |
| --- | --- | --- |
| `tutoring-session.circuitry.yaml` | `session_request` | classify a learning turn, ask intake/probe, teach one move, or route downstream |
| `research.circuitry.yaml` | `research_request` | plan queries, fetch sources, extract claims, synthesize, prepare note input |
| `note-export.circuitry.yaml` | `export_request` | plan and apply authorized Obsidian note writes |
| `manim-lecture.circuitry.yaml` | `lecture_request` | plan a visual lecture, create a Manim project, preflight/render/report artifact state |
| `interactive-artifact.circuitry.yaml` | `artifact_request` | create a temporary zero-native page/lab/widget with an active learning loop |
| `cleanup.circuitry.yaml` | `cleanup_request` | inventory configured temporary roots and apply authorized cleanup |
| `minimal-smoke.circuitry.yaml` | `smoke_request` | check dependency and runtime execution plumbing |

## Authored format

All graph files use:

```yaml
circuitry: "0.2"
runtime:
  provider: pi
  model: inherit
resources:
  request:
    type: text
    value: "{}"
```

Top-level `nodes:`, `edges:`, `agents:`, and `inputs:` are not authored graph sections. Execution nodes and edges are derived from `resources` during normalization.

## Station design

Use LLM agent stations for work that benefits from isolated judgment or synthesis. Use deterministic tool/code stations for path resolution, safe-root checks, file manifests, preflight checks, rendering, cleanup inventory, and schema validation.
