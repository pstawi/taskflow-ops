# QCM — Formation M2 DevOps : Automatisation du système CI et monitoring

**Durée** : 45 minutes
**Questions** : 30
**Validation** : Note >= 10/20

---

## Section 1 — Automatisation du système CI, runners, sécurité

**1.** Quelle est la différence fondamentale entre un runner *GitHub-hosted*
(`ubuntu-latest`) et un runner *self-hosted* ?

B. Le runner self-hosted est une machine que vous installez et maintenez vous-même ; il peut accéder à votre réseau privé.

---

**2.** Dans le fil rouge, pourquoi le job `deploy-staging` doit-il tourner sur
un runner self-hosted plutôt que sur `ubuntu-latest` ?

C. Parce que les VMs Multipass du lab sont sur un réseau privé, injoignable depuis les datacenters GitHub.

---

**3.** Quel est le principal risque de sécurité d'un runner self-hosted
attaché à un dépôt **public** ?

A. N'importe qui peut ouvrir une pull request depuis un fork et faire exécuter du code arbitraire sur votre machine.

---

**4.** Dans la correspondance Jenkins ↔ GitHub Actions, quel est l'équivalent
du `Jenkinsfile` ?

D. Un fichier de workflow YAML dans `.github/workflows/`.

---

**5.** À quoi sert la clé `permissions:` au niveau d'un workflow ou d'un job ?

B. À restreindre (ou étendre) les droits du `GITHUB_TOKEN` fourni au job, selon le principe du moindre privilège.

---

**6.** Comment un job cible-t-il un runner self-hosted précis ?

C. Par ses **labels** dans `runs-on`, par exemple `runs-on: [self-hosted, lab]`.

---

## Section 2 — Build, test, workflows réutilisables

**7.** Pourquoi utiliser `npm ci` plutôt que `npm install` dans un pipeline CI ?

A. `npm ci` installe exactement les versions du lockfile et échoue si `package.json` et le lockfile sont incohérents : le build est reproductible.

---

**8.** Dans une **action composite**, quelle clé est obligatoire sur chaque
step `run:` ?

B. `shell`

---

**9.** Comment déclare-t-on et appelle-t-on un **workflow réutilisable** ?

D. Il se déclare avec `on: workflow_call` et s'appelle avec `jobs.<id>.uses: ./.github/workflows/<fichier>.yml`.

---

**10.** Que produit cette configuration ?

```yaml
concurrency:
  group: ci-${{ github.ref }}
  cancel-in-progress: true
```

C. Un nouveau push sur la même branche annule le run encore en cours de cette branche.

---

**11.** À quoi sert le rapport de tests au format **JUnit XML** dans un pipeline ?

A. C'est un format standard que le CI (GitHub Actions, Jenkins, GitLab…) sait lire pour publier les résultats de tests, indépendamment du framework.

---

**12.** Que fait la commande `mvn -B verify` dans un job de CI Java ?

B. Elle exécute le lifecycle Maven jusqu'à la phase `verify` (compilation, tests unitaires et d'intégration inclus), en mode non interactif (`-B`).

---

## Section 3 — Déploiement automatisé et gestion des configurations

**13.** Que signifie le principe « build once, deploy many » ?

C. Un seul artefact est produit par le CI, puis ce **même** artefact est promu de staging vers la production sans être reconstruit.

---

**14.** Un job déclare `environment: production` et l'environment
`production` a un *required reviewer*. Que se passe-t-il ?

A. Le job attend qu'un reviewer autorisé approuve dans l'interface GitHub avant de démarrer.

---

**15.** Quelle est la différence entre *Continuous Delivery* et
*Continuous Deployment* ?

B. En delivery, chaque version validée est **prête** à être mise en production, mais la mise en production est déclenchée par une décision humaine ; en deployment, elle est automatique.

---

**16.** Quelle stratégie de déploiement consiste à maintenir deux
environnements de production identiques et à basculer le trafic de l'un à
l'autre ?

D. Blue/green

---

**17.** Comment fournir correctement la clé SSH privée au job Ansible ?

C. En la stockant dans un **secret** (repo ou environment) et en l'injectant au runtime via `ssh-agent` ou un fichier temporaire en `chmod 600`.

---

**18.** Avec une arborescence `/opt/taskflow/releases/<version>` et un lien
symbolique `current`, en quoi consiste un rollback ?

A. Rebasculer le lien `current` vers la release précédente puis redémarrer le service (et recharger nginx).

---

## Section 4 — Monitoring, Prometheus, PromQL, Grafana

**19.** Quel est le modèle de collecte de Prometheus ?

B. Pull : le serveur Prometheus interroge (« scrape ») périodiquement l'endpoint `/metrics` de chaque target.

---

**20.** Quel type de métrique Prometheus convient pour « nombre total de
requêtes HTTP reçues depuis le démarrage » ?

C. Counter

---

**21.** Que renvoie `rate(http_requests_total[5m])` ?

A. Le taux moyen de requêtes **par seconde** calculé sur la fenêtre des 5 dernières minutes.

---

**22.** Que calcule
`histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket[5m])) by (le))` ?

D. Le 95e percentile de la latence (p95) estimé à partir des buckets de l'histogramme ; le label `le` doit être conservé.

---

**23.** Quels sont les quatre *golden signals* définis par Google SRE ?

B. Latence, trafic, erreurs, saturation.

---

**24.** Comment Grafana est-il « provisionné en code » dans le fil rouge ?

C. Via des fichiers YAML dans `provisioning/datasources/` et `provisioning/dashboards/` (+ dashboards JSON) chargés automatiquement au démarrage.

---

## Section 5 — Alerting et bonnes pratiques

**25.** Dans une règle d'alerte Prometheus, à quoi sert `for: 5m` ?

A. L'alerte ne passe à l'état *firing* que si son expression reste vraie pendant 5 minutes consécutives (état *pending* entre-temps).

---

**26.** Que fait `group_by: ['alertname', 'env']` dans Alertmanager ?

C. Il regroupe les alertes ayant le même `alertname` et le même `env` en une seule notification.

---

**27.** Pourquoi configure-t-on une alerte `Watchdog` avec `expr: vector(1)`,
donc **toujours** en état *firing* ?

B. C'est un *dead man's switch* : si cette alerte cesse d'arriver, c'est que la chaîne Prometheus → Alertmanager → notification est cassée.

---

**28.** Pourquoi exécuter `promtool check rules` dans le CI ?

D. Pour valider la syntaxe et les expressions des règles d'alerte **avant** le merge, comme n'importe quel code (monitoring as code).

---

**29.** Quelle alerte illustre le mieux le principe « alerter sur les
symptômes plutôt que sur les causes » ?

A. « Taux d'erreurs 5xx de l'API > 5 % pendant 5 minutes ».

---

**30.** Que détecte l'expression
`predict_linear(node_filesystem_avail_bytes{mountpoint="/"}[1h], 4 * 3600) < 0` ?

C. Que, si la tendance de la dernière heure se poursuit, l'espace disponible sur `/` sera épuisé dans moins de 4 heures.
