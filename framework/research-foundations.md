# Research foundations used by Pi-GNOSIS

This file is a design grounding memo, not a frozen bibliography.

## Automated research pipelines

Automated research/survey systems work better when they decompose the job. Agentic AutoSurvey uses specialized agents for paper search, topic mining/clustering, survey writing, and quality evaluation, reporting higher synthesis quality than a single baseline survey generator. Design implication: Pi-GNOSIS uses separate Circuitry agents for scope, source discovery, extraction, synthesis, critique, and learner artifact routing.

Citation integrity remains a hard failure mode. Generated reviews can look polished while missing disagreement, hallucinating references, or failing to connect claims to sources. Design implication: every non-obvious claim should map to source ids, and quality gates should reject unsupported synthesis.

## Agentic RAG

Agentic RAG and multi-agent RAG research motivate decomposing retrieval-heavy tasks into planning, source discovery, extraction, and synthesis agents. Multi-agent RAG work such as MA-RAG uses planner/extractor/QA-style roles to handle ambiguous, multi-hop information seeking. Design implication: the research graph is a Circuitry program with role-specific agents and whitelisted web tools, not a single web-search prompt.

## Intelligent tutoring and note-backed memory

Intelligent tutoring systems traditionally maintain a learner model and use interactions to update the estimate of what the learner understands. Knowledge tracing estimates learner knowledge from interactions, but modern reviews warn that high predictive accuracy and interpretability do not always coexist. Design implication: Pi-GNOSIS keeps the durable record in Obsidian notes instead of an opaque mastery store.

LLM tutoring papers warn that being good at solving problems is not the same as being good at tutoring. Design implication: Pi-GNOSIS separates subject research, note writing, probing, feedback, and next-turn planning.

## Open-ended probing

Open-ended questions reveal reasoning better than recognition-only formats. LLM-based short-answer grading work suggests open-ended formative assessment is increasingly practical, although not perfect. Design implication: Pi-GNOSIS forbids multiple-choice diagnostic probes and instead uses recall, explain, transfer, contrast, debug, teach-back, and source-check prompts.

## Retrieval practice and spacing

Retrieval practice and spaced review are more durable than passive rereading for many learning tasks. More effortful retrieval often produces better long-term memory than easy recognition. Design implication: Pi-GNOSIS produces review schedules and open-ended retrieval prompts for concepts with high decay or misconception risk.

## Memetics, cautiously

Memetics is used only as a constrained lens for concept variants, transmission pathways, attractive wrong explanations, and misconception risk. It is not treated as a literal idea-virus science and never replaces source evidence.

## Sources to refresh during research runs

- Circuitry spec: https://github.com/darkhorseprojects/circuitry/blob/main/docs/SPEC.md
- Circuitry README: https://github.com/darkhorseprojects/circuitry
- pi-web-access: https://github.com/nicobailon/pi-web-access
- pi-exa-search: https://github.com/najibninaba/pi-exa-search
- Hermes Manim Video docs: https://hermes-agent.nousresearch.com/docs/user-guide/skills/bundled/creative/creative-manim-video
- Agentic AutoSurvey: https://arxiv.org/abs/2509.18661
- MathTutorBench: https://arxiv.org/abs/2502.18940
- Beyond Final Answers: https://arxiv.org/abs/2503.16460
- Systematic Review of KT and LLMs in Education: https://arxiv.org/abs/2412.09248
- Can LLMs Grade Short-Answer Reading Comprehension Questions: https://arxiv.org/abs/2310.18373
- MA-RAG: https://arxiv.org/abs/2505.20096
- RAG-Reasoning Survey: https://arxiv.org/abs/2507.09477
