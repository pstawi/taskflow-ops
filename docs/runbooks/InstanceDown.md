# InstanceDown

Scrape Prometheus en échec (`up == 0`) > 1 min.

1. Targets UI → laquelle est rouge ?
2. VM allumée ? `multipass list`
3. Port ouvert depuis le poste ? `curl http://IP:9100/metrics` ou `:80/metrics`

Relancer le service / corriger l’IP dans `prometheus.yml` si Multipass a réattribué l’adresse.
