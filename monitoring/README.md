# Monitoring TaskFlow

## Démarrage

```bash
cd monitoring
docker compose up -d
```

| Service | URL |
|---|---|
| Prometheus | http://localhost:9090 |
| Grafana | http://localhost:3001 (admin / admin) |
| node-exporter local | http://localhost:9100/metrics |

Recharger la config Prometheus sans redémarrer :

```bash
curl -X POST http://localhost:9090/-/reload
```

## Targets attendues (6)

- `prometheus` — self
- `node-local` — poste étudiant
- `taskflow-api` — staging (`192.168.1.25`) + prod (`192.168.1.26`)
- `node-vms` — node_exporter sur les 2 VMs `:9100`

## Requêtes PromQL (RED / USE)

```promql
# Rate requêtes/s par environnement
sum by (env) (rate(http_requests_total[1m]))

# Taux d'erreur 5xx
sum by (env) (rate(http_requests_total{status_code=~"5.."}[5m]))
  / sum by (env) (rate(http_requests_total[5m]))

# Latence p95
histogram_quantile(0.95, sum by (le, env) (rate(http_request_duration_seconds_bucket[5m])))

# CPU VMs (USE)
100 - (avg by (env) (rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100)

# Mémoire disponible
node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes

# Disque
node_filesystem_avail_bytes{mountpoint="/"} / node_filesystem_size_bytes{mountpoint="/"}
```

## Dashboards Grafana (provisionnés)

- **TaskFlow RED** (`taskflow-red`) — req/s, erreurs, p95, variable `env`
- **Node Exporter Basic** — CPU / mémoire / disque des VMs
