# Preuve Partie 1 — Runner Idle + CI

Date: 2026-09-22T09:28:30.6995332+02:00
Repo: https://github.com/pstawi/taskflow-ops

## Runner (API GitHub)

```json
{"busy":false,"labels":["self-hosted","Linux","X64","lab","ansible"],"name":"lab-runner","status":"online"}
```

Attendu: status=online, busy=false (= Idle), labels incluent self-hosted et lab.

## Runs

- CI vert: https://github.com/pstawi/taskflow-ops/actions/runs/35699253632
  - Artefacts: coverage-front, coverage-api, dist-front
  - Jobs Front/API lint+test+build: success
- Hello runner vert: https://github.com/pstawi/taskflow-ops/actions/runs/35699670088
  - Hostname: 19063a680cda
  - ansible [core 2.18.19]

## Capture manuelle

Prendre une capture Settings → Actions → Runners et la sauver ici en `runner-idle.png`.
