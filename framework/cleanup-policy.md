# Cleanup policy

Cleanup is a graph program, not an ad hoc shell habit.

The cleanup graph may identify:

- temporary graph-run files under `/tmp/pi-gnosis/`;
- failed draft Manim renders under `manim/**/media/`;
- scratch files declared in `output_manifest.json` as temporary;
- stale intermediate prompts or extracted snippets that were superseded by ledgers.

It must preserve:

- final notes;
- final videos;
- source ledgers;
- claim ledgers;
- user-authored files;
- scripts and configs.

Default behavior is plan-only. Destructive cleanup requires either `apply_cleanup: true` in the cleanup request or explicit user confirmation, and even then deletion is restricted to safe temporary roots.
