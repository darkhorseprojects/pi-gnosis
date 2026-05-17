# Pi-GNOSIS Circuitry graphs

These graphs are frozen programs for pi-circuitry. Do not treat them as examples only. Pi should run them when the skill routes work here.

Every graph uses:

```yaml
runtime:
  provider: pi
  model: inherit
```

Every agent node also uses `model: inherit`.

The graph itself is the multi-actor workflow. Do not add a single generic simulation node.

## Modality routing

- Text, ASCII, and markdown remain in the Pi conversation.
- Video/lecture work routes to `manim-lecture.circuitry.yaml`.
- Temporary pages and Geist-style widgets/labs route to `interactive-artifact.circuitry.yaml` and are cleanup-safe by default.
- Durable learner notes route to `note-export.circuitry.yaml`.
