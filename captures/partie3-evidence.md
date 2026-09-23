# Preuves Partie 3 — Monitoring Prometheus + Grafana

Date: 2026-09-23
Repo: https://github.com/pstawi/taskflow-ops

## Runs

- CI (metrics tests) : run `35867920020` — success
- Monitoring agents (node_exporter) : https://github.com/pstawi/taskflow-ops/actions/runs/35867919562 — success
- Deploy (API instrumentée) : https://github.com/pstawi/taskflow-ops/actions/runs/35867919650 — success

## Stack locale

```
docker compose -f monitoring/docker-compose.yml up -d
```

- Prometheus : http://localhost:9090
- Grafana : http://localhost:3001 (admin/admin)
- Dashboards provisionnés : `taskflow-red`, `node-exporter-basic`

## Targets Prometheus (6 UP)

| Job | Env | Health |
|---|---|---|
| prometheus | — | up |
| node-local | lab | up |
| taskflow-api | staging | up |
| taskflow-api | prod | up |
| node-vms | staging | up |
| node-vms | prod | up |

## Fichiers clés

- `api/src/metrics.js` + `api/tests/metrics.test.js`
- `ansible/roles/node_exporter/` + `ansible/playbooks/monitoring.yml`
- `.github/workflows/monitoring.yml`
- `monitoring/prometheus/prometheus.yml`
- `monitoring/grafana/provisioning/dashboards/json/taskflow-red.json`
