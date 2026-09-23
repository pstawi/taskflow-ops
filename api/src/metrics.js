/**
 * Métriques Prometheus pour l'API TaskFlow.
 * Registre isolé (évite les collisions en tests Vitest).
 */
import client from 'prom-client'

export const register = new client.Registry()
register.setDefaultLabels({ app: 'taskflow-api' })
client.collectDefaultMetrics({ register })

export const httpRequestsTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Compteur de requêtes HTTP',
  labelNames: ['method', 'route', 'status_code'],
  registers: [register],
})

export const httpRequestDurationSeconds = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Latence HTTP (secondes)',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2],
  registers: [register],
})

export const tasksTotal = new client.Gauge({
  name: 'taskflow_tasks_total',
  help: 'Nombre de tâches en mémoire',
  registers: [register],
})

export function setTasksGauge(n) {
  tasksTotal.set(n)
}

function routeLabel(req) {
  if (req.route?.path) return `${req.baseUrl}${req.route.path}`
  // Évite la haute cardinalité (ids dans l'URL)
  return req.path.replace(/\/[0-9a-z]{8,}(?=\/|$)/gi, '/:id')
}

export function metricsMiddleware(req, res, next) {
  const stop = httpRequestDurationSeconds.startTimer()
  res.on('finish', () => {
    const labels = {
      method: req.method,
      route: routeLabel(req),
      status_code: String(res.statusCode),
    }
    httpRequestsTotal.inc(labels)
    stop(labels)
  })
  next()
}

export async function metricsHandler(_req, res) {
  res.set('Content-Type', register.contentType)
  res.end(await register.metrics())
}
