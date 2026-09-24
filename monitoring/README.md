# Monitoring local TaskFlow

Stack Compose sur le poste (pas sur les VMs).

## Ports

| Service | Port |
|---|---|
| Prometheus | 9090 |
| Grafana | 3001 (admin/admin) |
| Alertmanager | 9093 |
| MailHog UI | 8025 |
| cAdvisor | 8081 |
| blackbox | 9115 |
| node-exporter | 9100 |

```bash
cd monitoring
cp alertmanager/alertmanager.example.yml alertmanager/alertmanager.yml   # une fois
docker compose up -d
```

Après modif de règles / scrape :

```bash
docker compose exec prometheus promtool check rules /etc/prometheus/rules/taskflow.yml
curl -X POST http://localhost:9090/-/reload
```

## IPs lab

Mettre à jour `prometheus/prometheus.yml` si Multipass change d’IP (`multipass list`).

## Alerting

- Règles : `prometheus/rules/taskflow.yml` (Watchdog + 6 alertes métier/infra)
- Routage : mail → MailHog ; `critical` aussi vers Discord (`CHANGE_ME`)
- Silence exemple :

```bash
docker compose exec alertmanager amtool silence add \
  alertname=TaskFlowApiDown env=staging \
  --alertmanager.url=http://localhost:9093 \
  --duration=1h --comment="maintenance" --author=pstawi
```

## Scénario E2E

1. `multipass exec taskflow-web1 -- sudo systemctl stop taskflow-api`
2. Attendre ~2 min → `TaskFlowApiDown` firing → mail dans MailHog
3. `multipass exec taskflow-web1 -- sudo systemctl start taskflow-api`
