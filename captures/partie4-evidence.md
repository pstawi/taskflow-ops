# Partie 4 — Alerting & monitoring complet

Repo: https://github.com/pstawi/taskflow-ops

## Validé le 2026-09-24

- Targets UP (IPs Multipass `192.168.0.37` / `.36`)
- Watchdog firing
- E2E : `systemctl stop taskflow-api` sur web1 → `TaskFlowApiDown` firing → mail MailHog `[FIRING:1] TaskFlowApiDown staging`
- Inhibition : `InstanceDown` suppressed pendant la critical
- Silence : `94c3b6bc-…` — `alertname=TaskFlowApiDown env=staging` 1h (`maintenance staging lab`)
- API relancée : `/health` → 200

## Code

- `monitoring/` : compose J4, rules, alertmanager.example.yml, blackbox, dashboard RED
- `.github/workflows/ci.yml` : job `lint-monitoring`
- `deploy.yml` : `annotate-grafana` (déjà en place)
- `docs/runbooks/` : 6 runbooks liés aux alertes
- `ansible/inventory/hosts.ini` : IPs lab à jour

## Silence (rejouable)

```bash
cd monitoring
docker compose exec alertmanager amtool silence add \
  alertname=TaskFlowApiDown env=staging \
  --alertmanager.url=http://localhost:9093 \
  --duration=1h --comment="maintenance staging lab" --author=pstawi
```
