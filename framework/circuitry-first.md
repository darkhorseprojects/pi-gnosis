# Circuitry-first architecture

Pi-GNOSIS treats Circuitry as the executable programming language for intelligent work.

Do not compress the workflow into one giant Pi prompt. Use top-level Pi skill instructions only to decide when and how to launch the frozen graph programs. The graphs do the delegation.

## Design rules

1. A graph is the multi-agent workflow. Do not add a single generic "simulation" node.
2. Each agent must have isolated responsibility, explicit inputs, whitelisted tools, whitelisted skills, and an `expect` schema.
3. Research, note export, video generation, tutoring turns, and cleanup are separate graph programs because they have different side-effect and tool policies.
4. Use `runtime.provider: pi` and `model: inherit` so pi-circuitry inherits the active Pi conversation model.
5. Prefer source-ledger and claim-ledger artifacts over prose summaries.
6. Read/write agents must operate under manifest-first constraints and safe roots.

## Why this is better than text instructions

Text instructions make one top-level agent remember every concern at once. Circuitry lets Pi run delegated programs with explicit context boundaries: one agent plans queries, another curates sources, another extracts claims, another builds a KT DAG, another writes notes, another creates a Manim project, and a final agent audits results.
