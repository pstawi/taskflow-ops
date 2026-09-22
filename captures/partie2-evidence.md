# Preuves Partie 2 — Déploiement Ansible

Date: 2026-09-22
Repo: https://github.com/pstawi/taskflow-ops (public pour activer Required reviewers)

## Environments GitHub

- `staging` : TARGET_IP=192.168.1.25, secrets SSH_PRIVATE_KEY + ANSIBLE_VAULT_PASSWORD
- `production` : TARGET_IP=192.168.1.26, **required_reviewers** = pstawi

## Runs Deploy

- Deploy complet approuvé (build → staging → prod) : https://github.com/pstawi/taskflow-ops/actions/runs/35735404815
- 2e Deploy (v4) : https://github.com/pstawi/taskflow-ops/actions/runs/35736347800
- Rollback prod → v3 : https://github.com/pstawi/taskflow-ops/actions/runs/35736885080

## Santé

- Staging : `http://192.168.1.25/health`
- Prod : `http://192.168.1.26/health`

## Vault

- `ansible/inventory/group_vars/prod.yml` commence par `$ANSIBLE_VAULT;1.1;AES256`

## Captures manuelles à ajouter

1. `env-production.png` — Settings → Environments → production (Required reviewers)
2. `deploy-prod-approved.png` — Actions → Deploy : job deploy-prod Approved puis vert
