# Storage contract: DAG state vs Obsidian

## Canonical DAG state

DAG state is machine-readable and lives under `.pi-gnosis/state/<run-id>/`. It is what Pi-GNOSIS uses to resume and route learning.

Store here:

- `run_manifest.json`: run id, topic, graph, package version, timestamps, config snapshot.
- `source_ledger.json`: source ids, urls, dates, source type, reliability notes, claims supported.
- `claim_ledger.json`: atomic claims, support, conflicts, uncertainty, source ids.
- `kt_dag.json`: concepts, prerequisites, relation types, evidence records, review risks.
- `learner_state.json`: observed evidence, probe outcomes, confidence, misconception markers.
- `review_schedule.json`: next review dates and reasons.
- `output_manifest.json`: files intentionally written by graph agents.

## Obsidian notes

Obsidian is optional but first-class for the learner. It is the human-facing memory surface.

Store here:

- concept notes written for reading and review;
- source-ledger summaries with links;
- reflection logs;
- open-ended probes and answer rubrics;
- review plans;
- the learner's own explanations and corrections.

Pi can read Obsidian to infer what the learner has already explained, but it must treat notes as learner evidence rather than authoritative source truth.

## Rule

DAG state answers: what does the system know, why, with what evidence, and what should run next?

Obsidian answers: what can the person read, edit, connect, and study?
