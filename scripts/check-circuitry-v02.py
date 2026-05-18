#!/usr/bin/env python3
"""Structural checker for Pi-GNOSIS Circuitry v0.2 graph programs.

This is not a replacement for the official pi-circuitry/circuitry validator. It is a
local smoke verifier used in offline packaging to catch schema drift, forbidden
non-v0.2 graph shapes, missing model inheritance, unsafe wiring, and the prior architecture mistake
of treating Circuitry itself as a single generic orchestration node.
"""
from __future__ import annotations

import sys
from pathlib import Path
from typing import Any

import yaml

FORBIDDEN_TOP_LEVEL = {"nodes", "edges", "agents", "inputs"}
EXECUTABLE_TYPES = {"agent", "tool"}
BANNED_IDENTITIES = {"Generic Simulation Node", "Simulation Orchestrator"}
WEB_TOOLS = {"web_search", "fetch_content", "exa_search"}


def fail(path: Path, message: str) -> str:
    return f"{path}: {message}"


def as_list(value: Any) -> list[Any]:
    return value if isinstance(value, list) else []


def validate_graph(path: Path) -> list[str]:
    issues: list[str] = []
    try:
        data = yaml.safe_load(path.read_text(encoding="utf-8"))
    except Exception as exc:  # pragma: no cover - defensive
        return [fail(path, f"cannot parse yaml: {exc}")]

    if not isinstance(data, dict):
        return [fail(path, "graph must be a mapping")]

    if str(data.get("circuitry")) != "0.2":
        issues.append(fail(path, "must declare circuitry: \"0.2\""))

    runtime = data.get("runtime") or {}
    if not isinstance(runtime, dict):
        issues.append(fail(path, "runtime must be a mapping"))
    else:
        if runtime.get("provider") != "pi":
            issues.append(fail(path, "runtime.provider must be pi"))
        if runtime.get("model") != "inherit":
            issues.append(fail(path, "runtime.model must be inherit"))

    for key in FORBIDDEN_TOP_LEVEL:
        if key in data:
            issues.append(fail(path, f"authored v0.2 graph files must not use top-level {key}"))

    resources = data.get("resources")
    if not isinstance(resources, dict) or not resources:
        issues.append(fail(path, "resources must be a non-empty map"))
        return issues

    ids = set(resources)
    agent_count = 0
    web_tool_seen = False

    for rid, entry in resources.items():
        if not isinstance(entry, dict):
            issues.append(fail(path, f"resource {rid} must be a map"))
            continue
        rtype = entry.get("type")
        if rtype not in {"text", "agent", "tool"}:
            issues.append(fail(path, f"resource {rid} has invalid type {rtype!r}"))
        inputs = as_list(entry.get("inputs"))
        if rid in inputs:
            issues.append(fail(path, f"resource {rid} has a self-loop"))
        for target in inputs:
            if target not in ids:
                issues.append(fail(path, f"resource {rid} references unknown input {target!r}"))
        if rtype in EXECUTABLE_TYPES and not inputs:
            issues.append(fail(path, f"executable resource {rid} must have inputs"))
        if rtype == "agent":
            agent_count += 1
            identity = entry.get("identity")
            if not identity:
                issues.append(fail(path, f"agent {rid} must have identity"))
            if identity in BANNED_IDENTITIES:
                issues.append(fail(path, f"agent {rid} uses banned identity {identity}"))
            if entry.get("model") != "inherit":
                issues.append(fail(path, f"agent {rid} must use model: inherit"))
            if not entry.get("instructions"):
                issues.append(fail(path, f"agent {rid} must have instructions"))
            if not isinstance(entry.get("expect"), dict):
                issues.append(fail(path, f"agent {rid} must declare expect schema"))
            if WEB_TOOLS.intersection(set(as_list(entry.get("tools")))):
                web_tool_seen = True

    # Cycle check through DFS.
    graph = {rid: as_list(entry.get("inputs")) if isinstance(entry, dict) else [] for rid, entry in resources.items()}
    visiting: set[str] = set()
    visited: set[str] = set()

    def dfs(node: str, stack: list[str]) -> None:
        if node in visiting:
            issues.append(fail(path, "cycle detected: " + " -> ".join(stack + [node])))
            return
        if node in visited:
            return
        visiting.add(node)
        for dep in graph.get(node, []):
            if dep in graph:
                dfs(dep, stack + [node])
        visiting.remove(node)
        visited.add(node)

    for rid in resources:
        dfs(rid, [])

    if "research" in path.name and not web_tool_seen:
        issues.append(fail(path, "research graph must include at least one agent with pi-web-access/pi-exa-search tools"))

    if agent_count == 0:
        issues.append(fail(path, "graph must include at least one agent"))

    return issues


def main(argv: list[str]) -> int:
    if len(argv) < 2:
        print("usage: check-circuitry-v02.py <graph...>", file=sys.stderr)
        return 2
    paths: list[Path] = []
    for arg in argv[1:]:
        matched = list(Path().glob(arg)) if any(ch in arg for ch in "*?[") else [Path(arg)]
        paths.extend(matched)
    issues: list[str] = []
    for path in paths:
        issues.extend(validate_graph(path))
    if issues:
        print("Circuitry graph validation failed:", file=sys.stderr)
        for issue in issues:
            print("- " + issue, file=sys.stderr)
        return 1
    print(f"Validated {len(paths)} Circuitry v0.2 graph(s).")
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
