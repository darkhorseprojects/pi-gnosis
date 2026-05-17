# pi-gnosis Circuitry graph programs

These files are saved Circuitry graph programs. Pi dispatches learner requests to the right graph, passes runtime inputs, runs the graph, reads the result, and reports it.

Do not edit graph YAML for each learner request. Runtime inputs are the graph args.

Execution shape:

```txt
graph file/current canvas/text + runtime inputs -> run result
```

Every graph declares text resources for runtime inputs. The pi-gnosis runner maps graph names to request resources and may pass resolved config through `gnosis_config` when declared.

```json
{
  "filename": "graphs/manim-lecture.circuitry.yaml",
  "inputs": {
    "lecture_request": {
      "topic": "linear algebra",
      "scope": "full intro",
      "render": "draft-if-environment-ready",
      "apply_writes": true
    },
    "gnosis_config": {
      "paths": {}
    }
  }
}
```

Every graph uses:

```yaml
runtime:
  provider: pi
  model: inherit
```

Every agent node also uses `model: inherit`.

## Graphs

- Conversation tutoring: `tutoring-session.circuitry.yaml`
- Source-grounded research: `research.circuitry.yaml`
- Durable Obsidian notes: `note-export.circuitry.yaml`
- Manim lecture/video artifacts: `manim-lecture.circuitry.yaml`
- Temporary pages/widgets/labs: `interactive-artifact.circuitry.yaml`
- Temporary artifact cleanup: `cleanup.circuitry.yaml`
- Runtime smoke check: `minimal-smoke.circuitry.yaml`
