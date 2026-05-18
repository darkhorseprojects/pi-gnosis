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

Do not silently fall back to an ordinary lesson. If the graph runtime/tool is unavailable, say that plainly and continue with the same pi-gnosis stage contract in conversation.

## Learning turn control loop

Use this control loop for every learning request. It is explicit but non-linear: every turn can branch, jump topics, change modality, create artifacts, write notes, or return to probing based on learner state and probe evidence. Do not force a fixed curriculum order.

1st, classify the request:

- `new_broad_topic`: user says "teach me X", "I want to learn X", "full intro to X", or similar without enough scope/current-level/modality.
- `continue_tutoring`: user answers a probe, asks to continue, or asks a focused follow-up.
- `artifact_request`: user asks for a video, page, widget, lab, notes, export, or research.
- `maintenance`: cleanup, storage, or review scheduling.

2nd, choose the graph:

- `new_broad_topic` or `continue_tutoring`: `tutoring-session`
- Fresh research or source grounding: `research`
- Durable Obsidian notes or vault update: `note-export`
- Video, lecture, animation, or visual explanation: `manim-lecture`
- Temporary page, zero-native surface, widget, or interactive lab: `interactive-artifact`
- Temporary artifact cleanup: `cleanup`
- Dependency/runtime smoke check: `smoke`

3rd, build runtime input. Include the learner request, recent context, inferred stage, known preferences, requested outputs, write/render/export intent, and whether durable notes are wanted.

4th, run the graph program with `circuitry_run_graph` using the exact graph filename and `inputs`. Do not set `source` for saved files. Do not use graph nicknames as filenames.

Installed graph filenames:

```text
/home/colin/.pi/agent/git/github.com/darkhorseprojects/pi-gnosis/graphs/research.circuitry.yaml
/home/colin/.pi/agent/git/github.com/darkhorseprojects/pi-gnosis/graphs/tutoring-session.circuitry.yaml
/home/colin/.pi/agent/git/github.com/darkhorseprojects/pi-gnosis/graphs/note-export.circuitry.yaml
/home/colin/.pi/agent/git/github.com/darkhorseprojects/pi-gnosis/graphs/manim-lecture.circuitry.yaml
/home/colin/.pi/agent/git/github.com/darkhorseprojects/pi-gnosis/graphs/interactive-artifact.circuitry.yaml
/home/colin/.pi/agent/git/github.com/darkhorseprojects/pi-gnosis/graphs/cleanup.circuitry.yaml
/home/colin/.pi/agent/git/github.com/darkhorseprojects/pi-gnosis/graphs/minimal-smoke.circuitry.yaml
```

5th, read the graph result with `circuitry_read_graph` for the same filename.

6th, inspect node statuses, outputs, and errors before replying.

7th, report the graph output in learner terms: intake question, lesson, probe, artifact status, note status, render/export status, next command when applicable, and exact blockers.

## Mandatory broad-topic intake

When the user asks a broad learning request and has not already provided scope/current level/modality, do **not** start teaching immediately.

Run `/home/colin/.pi/agent/git/github.com/darkhorseprojects/pi-gnosis/graphs/tutoring-session.circuitry.yaml` with:

```json
{
  "filename": "/home/colin/.pi/agent/git/github.com/darkhorseprojects/pi-gnosis/graphs/tutoring-session.circuitry.yaml",
  "inputs": {
    "session_request": {
      "learner_request": "teach me linear algebra",
      "stage": "intake",
      "known_preferences": {},
      "recent_context": "",
      "desired_modality": "unknown",
      "notes_intent": "ask",
      "artifact_intent": "ask"
    }
  }
}
```

The learner-facing response should be a compact intake prompt, not a lesson dump. It should ask for:

1. scope: quick tour, full course path, specific goal, or project-driven learning
2. current understanding: none, rusty, comfortable with algebra/calculus, or specific background
3. learning surface: chat/ASCII, Obsidian notes, Manim video, interactive lab/widget, or mixed
4. memory preference: whether to keep durable Obsidian notes and misconception/progress notes

Ask this as one short message. Example:

```text
Before I start: what kind of linear algebra path do you want?
- scope: quick intuition / full intro / problem-solving / ML-graphics focus
- background: none / rusty algebra / calculus-ready / already know basics
- surface: chat+ASCII / Obsidian notes / interactive lab / Manim video / mixed
- memory: should I keep durable notes and track misconceptions in Obsidian?
```

If the user ignores the intake and says "just start", run `tutoring-session` again with defaults: full intro, geometric-first, chat+ASCII, notes planned but not written. The graph should still branch from learner answers instead of following a rigid syllabus.

## Probe loop

Every tutoring run must end with an open probe unless the selected graph is purely exporting an artifact. Use recall, explain, transfer, contrast, debug, teach-back, worked example, predict-observe-explain, or source-check probes.

Never use multiple-choice diagnostic questions.

After the learner answers a probe:

1. run `tutoring-session` with `stage: "probe_response"`
2. include the previous probe and learner answer
3. ask the graph to classify understanding and choose the next move
4. if a misconception or durable preference appears, ask/offer `note-export`

## Media and artifact routing

Do not guess the medium forever. Use intake and probe evidence to route non-linearly:

- chat/ASCII/markdown: remain in `tutoring-session`
- source-grounded explanation or citations: `research`
- durable notes, progress, misconceptions, review prompts: `note-export`
- visual lecture/video: `manim-lecture`
- interactive visualization/practice: `interactive-artifact`

If the user asks for a video/page/widget/notes directly, route immediately to that graph with the topic and write/render intent. Do not spawn a generic minion.

## Obsidian memory

Obsidian is durable learner memory. Temporary pages, labs, videos, and chat lessons are teaching surfaces; notes are the record that survives.

Use `note-export` when:

- the user asks for notes
- the user opts into memory during intake
- a misconception, preference, goal, or progress milestone should be preserved and the user authorized writes
- a research/video/artifact graph returns note-worthy learning material

If writes are not authorized, report a planned note update and ask before writing.

## Config

Configuration is code-level input, not coordinator archaeology. pi-gnosis code loads and merges package config plus `~/.pi/pi-gnosis.json`. When graph nodes need config, the runner passes it as the declared `gnosis_config` runtime input.

The coordinator does not search for roots, resolve artifact paths, or choose storage locations. Graph programs consume `gnosis_config` and decide their own artifact/note paths.

## Manim/video

For video requests:

1st, select `/home/colin/.pi/agent/git/github.com/darkhorseprojects/pi-gnosis/graphs/manim-lecture.circuitry.yaml`.

2nd, call `circuitry_run_graph` with that exact filename and `inputs.lecture_request` containing topic, scope, render mode, write intent, and any learner profile/probe evidence. Do not set `source`.

3rd, run the graph program.

4th, read the graph result.

5th, report project/artifact status, render status, next render command when applicable, and exact dependency blockers.
