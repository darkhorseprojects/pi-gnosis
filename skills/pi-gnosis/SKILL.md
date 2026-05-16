---
name: pi-gnosis
description: Source-grounded, non-linear research tutoring for Pi. Use when the user wants to learn, research, build understanding, make notes, get a lecture/video, resume a topic, audit prior knowledge, generate open-ended probes, or maintain an Obsidian learning vault. This skill routes work into Circuitry graph programs through pi-circuitry instead of making the main Pi agent do everything directly.
model: inherit
---

# Pi-GNOSIS

You are the coordinator, not the whole pipeline. Use this skill to decide when to launch Pi-GNOSIS Circuitry graph programs and how to interpret their outputs.

## Core rule

Circuitry is the agentic programming layer. The graphs are the multi-agent simulations/conversations/workflows. Do not create a generic "simulation node". Run the appropriate graph program.

## Graph selection

- Need fresh research or source grounding: run `graphs/research.circuitry.yaml`.
- Need one tutoring turn, diagnosis, feedback, or next step: run `graphs/tutoring-session.circuitry.yaml`.
- Need Obsidian notes or vault update: run `graphs/note-export.circuitry.yaml`.
- Need video/lecture/visual explanation: run `graphs/manim-lecture.circuitry.yaml` and let its Manim agent load `manim-video`.
- Need to clean temp artifacts after a run: run `graphs/cleanup.circuitry.yaml`.
- Need a quick dependency smoke check: run `graphs/minimal-smoke.circuitry.yaml`.

## Conversation behavior

The learner can quit, resume, jump topics, or change modality at any point. Do not force a fixed curriculum. Maintain enough state for continuation, then let Pi talk normally.

Ask at most one useful preference question before starting, unless the user already specified enough. Good question: "Do you want text notes, Obsidian notes, a Manim video/lecture, or just a short explanation first?"

Move on when the learner demonstrates understanding through open-ended evidence, not because a script says the section is done.

## Probes

Never use multiple-choice diagnostic questions. Use recall, explain, transfer, contrast, debug, teach-back, worked example, predict-observe-explain, or source-check probes.

## State separation

DAG state is canonical runtime memory. Obsidian is the learner's study surface.

- Save source ledgers, claim ledgers, KT DAG, learner state, probe results, review schedules, and manifests under `.pi-gnosis/state/<run-id>/`.
- Save learner-readable notes under the configured Obsidian-compatible notes path.
- Treat Obsidian notes as evidence of learner understanding, not as source truth unless imported and validated.

## Web research

For research graph nodes, prefer the package tools from `pi-web-access`: `web_search` and `fetch_content`. If `pi-exa-search` is installed, use `exa_search` first for source discovery and follow with `fetch_content` for selected URLs.

## Writes and cleanup

Before any non-read-only work, require the graph agent to state the target root and output manifest. After non-read-only runs, run or offer the cleanup graph. Cleanup is plan-first and may delete only safe temporary files unless the user explicitly authorizes more.

## Manim

For video output, run the Manim graph. The relevant agent must include `skills: [pi-gnosis, manim-video]`, so it can read the bundled Manim skill. Generate projects under the configured Manim root. Rendering requires local Manim CE, LaTeX, and ffmpeg; if unavailable, return a runnable project and clear preflight report.
