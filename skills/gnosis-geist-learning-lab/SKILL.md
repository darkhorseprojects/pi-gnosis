---
name: gnosis-geist-learning-lab
description: >-
  pi-gnosis bundled skill for designing Geist-style interactive learning labs/widgets
  on zero-native surfaces. Use with pi-gnosis for temporary explorable explanations,
  prediction/feedback widgets, parameter explorers, code-learning labs, and active-recall pages.
model: inherit
---

# Geist-style learning lab contract

## Scope

Use this skill inside the `interactive-artifact` graph for the `lab`, `widget`, and richer temporary page modalities.

Surface routing:

```text
text / ASCII / markdown -> Pi conversation
video / lecture         -> Manim
page                    -> zero-native
lab / widget            -> this skill + zero-native
notes                   -> note-export
```

Generated labs are temporary artifacts. Durable learning records are written through `note-export` when authorized.

## Learning loop

A lab/widget has these learner-visible parts:

1. Orient: one learning objective.
2. Attempt: prediction, explanation, edit, manipulation, or input before explanation.
3. Feedback: immediate response anchored to the attempt.
4. Explain: short explanation after feedback.
5. Checkpoint: open recall or transfer prompt.
6. Reflect: prompt for the learner's changed mental model.

Passive pages are ordinary pages, not labs.

## Patterns

- `ParameterDock`: sliders/toggles with visible output changes
- `LiveOutputPanel`: immediate consequence display
- `InteractiveDiagram`: visual state/flow/model representation
- `QuickCheck`: active recall prompt with feedback
- `HintLadder`: progressive hints
- `WorkedExample`: stepwise reveal after learner attempt
- `BeforeAfterSplit`: contrast two near cases
- `TimelineExplorer`: scrub algorithm/process state over time
- `ConceptMap`: relationship map when topology matters

## UI contract

- dark-first, minimal, precise UI
- one concept and one primary action visible at a time
- progressive disclosure for why, edge cases, formal definitions, and performance notes
- controls visibly affect output within roughly 100ms or show loading state
- URL/search-param state for explorable parameters when practical

Color semantics:

| Color | Meaning |
| --- | --- |
| green | correct/completed |
| red | incorrect/error |
| amber | hint/caution |
| blue | current/info/definition |
| gray | neutral/chrome |

## Artifact input shape

```json
{
  "objective": "one sentence",
  "misconception": "trap the lab surfaces",
  "attempt": "what learner does before explanation",
  "interactive_control": "slider/toggle/input/scrubber/editor",
  "visible_effect": "what changes immediately",
  "feedback_rule": "how feedback is derived",
  "checkpoint": "open recall or transfer prompt",
  "reflection": "what the learner should write down"
}
```

The artifact root comes from `gnosis_config.paths.interactiveArtifactRoot` plus a deterministic slug.
