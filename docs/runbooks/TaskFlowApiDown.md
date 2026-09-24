# TaskFlowApiDown

Blackbox échoue sur `/health` (critical).

```bash
curl -i http://<ip>/health
multipass exec taskflow-web1 -- sudo systemctl status taskflow-api
multipass exec taskflow-web1 -- sudo journalctl -u taskflow-api -n 40
```

Remède rapide : `systemctl restart taskflow-api`. Si un Deploy vient de passer, envisager un rollback.
