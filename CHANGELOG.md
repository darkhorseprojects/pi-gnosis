# Changelog

## 0.2.0

- Rebuilt package around Circuitry as the executable agentic programming layer.
- Removed the incorrect generic simulation-node framing. Circuitry graphs themselves are the multi-agent workflow programs.
- Added frozen graph programs for research, tutoring, note export, Manim lecture generation, cleanup, and smoke testing.
- Added required dependency on `pi-web-access` and optional dependency on `pi-exa-search` for graph agents that need web tools.
- Centralized runtime/model configuration in `config/gnosis.config.json`; all graph runtimes and agent nodes use `model: inherit`.
- Added bundled `manim-video` skill with credit to Nous/Hermes documentation.
- Added explicit DAG-state vs Obsidian storage contract.
- Added safe cleanup graph and cleanup policy.
- Added tests that validate graph shape, safe cleanup planning, probe policy, review scheduling, and Manim project generation.
