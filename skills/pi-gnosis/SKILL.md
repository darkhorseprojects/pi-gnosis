---
name: pi-gnosis
description: >-
  Primary pi-gnosis learning/research system for source-grounded tutoring, notes,
  videos, temporary pages, and interactive widgets/labs. Use when the user wants
  to learn about something longer-term than a small fact: studying a topic,
  building understanding over multiple turns, making durable notes, researching
  sources, or creating learning artifacts like videos, pages, and interactive labs.
  Obsidian notes are the persistent memory surface.
---

# pi-gnosis

Pi is the dispatcher. Circuitry graph files are saved graph programs. Runtime inputs are the graph args. Circuitry runs the program. Pi reads the result and reports it to the learner.

## Core rule

Run graph programs; do not rewrite them for each learner request. Request-specific information belongs in `circuitry_run_graph.inputs`, not in edited YAML, ad hoc canvas patches, or generic minions.

## Graph selection

- Fresh research or source grounding: `research`
- One tutoring turn, diagnosis, feedback, or next step: `tutoring-session`
- Durable Obsidian notes or vault update: `note-export`
- Video, lecture, animation, or visual explanation: `manim-lecture`
- Temporary page, zero-native surface, widget, or interactive lab: `interactive-artifact`
- Temporary artifact cleanup: `cleanup`
- Dependency/runtime smoke check: `smoke`

## Runtime execution

1st, classify the learner request into one graph name from **Graph selection**. If the learner already named the topic and modality, continue immediately.

2nd, build the smallest runtime input object needed by that graph. Include only learner intent: topic, recent context, desired modality/output, constraints, and explicit write/render/export intent.

3rd, run the graph program with filename + runtime inputs. Use the pi-gnosis graph runner when available; otherwise call `circuitry_run_graph` directly with the graph filename and `inputs`.

Example Manim request:

```json
{
  "filename": "graphs/manim-lecture.circuitry.yaml",
  "inputs": {
    "lecture_request": {
      "topic": "linear algebra",
      "scope": "full intro",
      "render": "draft-if-environment-ready",
      "apply_writes": true
    }
  }
}
```

4th, read the graph result with `circuitry_read_graph` for the same filename.

5th, inspect node statuses, outputs, and errors before replying.

6th, report the graph output in learner terms: answer, artifact status, note status, render/export status, next command when applicable, and exact blockers.

## Config

Configuration is code-level input, not coordinator archaeology. pi-gnosis code loads and merges package config plus `~/.pi/pi-gnosis.json`. When graph nodes need config, the runner passes it as the declared `gnosis_config` runtime input.

The coordinator does not search for roots, resolve artifact paths, or choose storage locations. Graph programs consume `gnosis_config` and decide their own artifact/note paths.

## Conversation behavior

The learner can quit, resume, jump topics, or change modality at any point. Do not force a fixed curriculum. Maintain enough context for continuation, then let Pi talk normally.

Ask at most one useful preference question before starting, unless the user already specified enough. Good question: "Do you want inline text/ASCII/markdown, Obsidian notes, a Manim video, a zero-native page, or an interactive lab/widget?"

## Modality map

- Text, ASCII diagrams, and markdown stay in the Pi conversation.
- Video and lecture artifacts use `manim-lecture`.
- Pages, widgets, and explorable labs use `interactive-artifact`.
- Durable learner notes use `note-export`.
- Source-grounded study uses `research`.
- A small profile note may live beside the vault root.

## Probes

Never use multiple-choice diagnostic questions. Use recall, explain, transfer, contrast, debug, teach-back, worked example, predict-observe-explain, or source-check probes.

## Writes and cleanup

Writes happen only when the runtime input explicitly asks for them or the selected graph contract requires them. After a graph creates temporary artifacts, offer `cleanup`.

Cleanup is also a graph program. Run it with runtime input; do not manually delete temporary outputs from the coordinator.

## Manim/video

For video requests:

1st, select `manim-lecture`.

2nd, pass `lecture_request` with topic, scope, render mode, and write intent.

3rd, run the graph program.

4th, read the graph result.

5th, report project/artifact status, render status, next render command when applicable, and exact dependency blockers.
