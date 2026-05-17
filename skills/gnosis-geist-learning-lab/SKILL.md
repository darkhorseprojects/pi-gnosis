---
name: gnosis-geist-learning-lab
description: Pi-GNOSIS bundled skill for designing Geist-style interactive learning labs/widgets on zero-native surfaces. Use with pi-gnosis when creating temporary explorable explanations, prediction/feedback widgets, parameter explorers, code-learning labs, or active-recall pages.
author: Vercel Labs
source: https://github.com/vercel-labs/skill-geist-learning-labs
model: inherit
---

# GNOSIS Geist Learning Lab

Upstream: Vercel Labs `skill-geist-learning-labs`.

## Scope inside Pi-GNOSIS

Use this skill only for the `lab` / `widget` / `cooler page` modality:

```text
text / ASCII / markdown -> Pi conversation
video / lecture         -> Manim
page                    -> zero-native
lab / widget            -> this skill + zero-native
notes                   -> Obsidian note-export
```

The generated artifact is temporary by default. The durable learning record is the learner's own notes or a note-export graph run.

## Non-negotiable learning loop

Every lab/widget must include:

1. Orient: one clear learning objective.
2. Attempt: learner predicts, explains, edits, or manipulates before the explanation.
3. Feedback: immediate, specific feedback anchored to the attempt.
4. Explain: short explanation after the attempt.
5. Checkpoint: open-ended recall/transfer prompt.
6. Reflect: prompt the learner to write what changed in their mental model.

No passive-only pages.

## Preferred components/patterns

Use compact equivalents of these Vercel Geist Learning Lab patterns:

- `ParameterDock`: sliders/toggles with visible output changes.
- `LiveOutputPanel`: immediate consequence display.
- `InteractiveDiagram`: visual state/flow/model representation.
- `QuickCheck`: active recall prompt with feedback.
- `HintLadder`: progressive hints, not answer dumps.
- `WorkedExample`: stepwise reveal after learner attempt.
- `BeforeAfterSplit`: contrast two near cases.
- `TimelineExplorer`: scrub algorithm/process state over time.
- `ConceptMap`: show relationships when topology matters.

## Visual/design constraints

- Dark-first, minimal, precise UI.
- Use color as learning signal:
  - green: correct/completed
  - red: incorrect/error
  - amber: hint/caution
  - blue: current/info/definition
  - gray: neutral/chrome
- One concept + one action visible at a time.
- Progressive disclosure for depth: why, edge cases, formal definition, performance notes.
- Controls must visibly affect output within roughly 100ms or show an explicit loading state.
- URL/search-param state is preferred for explorable parameters.

## Pi-GNOSIS integration rules

- Pair this skill with `pi-gnosis`; do not use it as an independent curriculum generator.
- Run `graphs/interactive-artifact.circuitry.yaml` for actual artifact generation.
- Generated labs should target zero-native as the native page shell.
- Native policy must remain strict: no broad navigation, no native bridge unless explicitly required, no hidden filesystem access.
- Write only under the configured interactive artifact temp root.

## Prompting shape for artifact agents

When designing a lab, produce this shape:

```json
{
  "objective": "one sentence",
  "misconception": "the trap the lab surfaces",
  "attempt": "what learner does before explanation",
  "interactive_control": "slider/toggle/input/scrubber/editor",
  "visible_effect": "what changes immediately",
  "feedback_rule": "how feedback is derived",
  "checkpoint": "open-ended recall or transfer prompt",
  "reflection": "what the learner should write down"
}
```
