---
name: pi-gnosis
description: >-
  Primary pi-gnosis learning/research system for source-grounded tutoring, notes,
  videos, temporary pages, and interactive widgets/labs. Use for learning requests,
  multi-turn tutoring, research, Obsidian notes, Manim videos, and temporary labs/pages.
---

# pi-gnosis

## Contract

Use saved Circuitry graph programs. Put learner-specific data in `circuitry_run_graph.inputs`.

Every pi-gnosis graph run includes:

```json
{
  "filename": "<resolved-pi-gnosis-package>/graphs/<graph>.circuitry.yaml",
  "inputs": {
    "<request_resource>": {},
    "gnosis_config": "<loaded pi-gnosis config>"
  }
}
```

`gnosis_config` is unconditional. It is the source for artifact roots, note roots, runtime policy, and cleanup boundaries.

For saved graph files, call `circuitry_run_graph` with `filename` and `inputs`. Do not set `source`.

After each run, call `circuitry_read_graph` with the same filename and inspect `lastRun` outputs/errors before replying.

## Graph catalog

| Request | Graph file | Request resource |
| --- | --- | --- |
| broad topic, tutoring continuation, probe answer | `graphs/tutoring-session.circuitry.yaml` | `session_request` |
| fresh research or source grounding | `graphs/research.circuitry.yaml` | `research_request` |
| Obsidian note export/update | `graphs/note-export.circuitry.yaml` | `export_request` |
| video, lecture, animation, visual explanation | `graphs/manim-lecture.circuitry.yaml` | `lecture_request` |
| page, widget, temporary lab, interactive surface | `graphs/interactive-artifact.circuitry.yaml` | `artifact_request` |
| temporary artifact cleanup | `graphs/cleanup.circuitry.yaml` | `cleanup_request` |
| dependency/runtime smoke check | `graphs/minimal-smoke.circuitry.yaml` | `smoke_request` |

Graph filenames are package-relative under this skill package's `graphs/` directory. Use the resolved absolute path for tool calls.

## Turn routing

1. Classify the learner request.
2. Select the graph from the catalog.
3. Build the request resource with learner request, stage, recent context, preferences, desired output, write/render/open intent, and notes intent.
4. Add `gnosis_config`.
5. Run graph.
6. Read graph.
7. Report the graph result: intake/probe/lesson, downstream graph route, artifact status, note status, render/export status, and blockers.

If the graph runtime or a required tool fails, report that graph error and keep the same stage contract in the conversation.

## Broad-topic intake

For requests like "teach me X" without scope, background, modality, or memory preference, run `tutoring-session` at `stage: "intake"`.

```json
{
  "filename": "<resolved-pi-gnosis-package>/graphs/tutoring-session.circuitry.yaml",
  "inputs": {
    "session_request": {
      "learner_request": "teach me linear algebra",
      "stage": "intake",
      "known_preferences": {},
      "recent_context": "",
      "desired_modality": "unknown",
      "notes_intent": "ask",
      "artifact_intent": "ask"
    },
    "gnosis_config": "<loaded pi-gnosis config>"
  }
}
```

Learner-facing intake prompt:

```text
Before I start: what kind of linear algebra path do you want?
- scope: quick intuition / full intro / problem-solving / ML-graphics focus
- background: none / rusty algebra / calculus-ready / already know basics
- surface: chat+ASCII / Obsidian notes / interactive lab / Manim video / mixed
- memory: should I keep durable notes and track misconceptions/progress in Obsidian?
```

After the learner answers, pass the answer back as `stage: "intake_response"`. Include the original request, interpreted scope/background/modality/notes intent, and recent context.

## Probe loop

Tutoring turns end with an open probe unless the selected graph is only producing an artifact/export.

Allowed probe families: recall, explain, transfer, contrast, debug, teach-back, worked example, predict-observe-explain, source-check.

After a learner answers a probe, run `tutoring-session` with:

```json
{
  "session_request": {
    "stage": "probe_response",
    "previous_probe": "...",
    "probe_response": "...",
    "recent_context": "..."
  },
  "gnosis_config": "<loaded pi-gnosis config>"
}
```

## Artifact requests

Artifact graph inputs include concrete topic, learner goal, artifact kind, write/open/render intent, notes intent, and recent context. Empty artifact inputs are invalid.

Interactive artifact example:

```json
{
  "filename": "<resolved-pi-gnosis-package>/graphs/interactive-artifact.circuitry.yaml",
  "inputs": {
    "artifact_request": {
      "learner_request": "teach me linear algebra",
      "topic": "linear algebra",
      "scope": "quick intuition",
      "background": "calculus-ready",
      "artifact_kind": "interactive lab",
      "learner_goal": "Build geometric intuition for matrices as transformations",
      "desired_interaction": "manipulate a 2x2 matrix and see vectors/grid change",
      "notes_intent": "no",
      "apply_writes": true,
      "open_requested": true,
      "recent_context": "User wants a quick calculus-ready interactive lab and no durable notes."
    },
    "gnosis_config": "<loaded pi-gnosis config>"
  }
}
```

Manim example:

```json
{
  "filename": "<resolved-pi-gnosis-package>/graphs/manim-lecture.circuitry.yaml",
  "inputs": {
    "lecture_request": {
      "learner_request": "teach me linear algebra",
      "topic": "linear algebra",
      "scope": "quick intuition",
      "background": "calculus-ready",
      "artifact_kind": "Manim video",
      "learner_goal": "See matrices as transformations of the plane",
      "prior_evidence": "Learner said matrices apply transformations.",
      "apply_writes": true,
      "render_requested": true,
      "open_requested": true,
      "notes_intent": "no"
    },
    "gnosis_config": "<loaded pi-gnosis config>"
  }
}
```

## Notes and memory

Use `note-export` when the learner asks for notes, opts into memory, or authorizes a note update. If writes are not authorized, report the planned note input and ask before writing.

Obsidian notes are durable memory. Temporary videos/pages/labs are teaching artifacts unless exported through `note-export`.
