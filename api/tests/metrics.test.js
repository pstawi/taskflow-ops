import { describe, it, expect } from 'vitest'
import request from 'supertest'
import { createApp } from '../src/app.js'
import { register } from '../src/metrics.js'

describe('instrumentation /metrics', () => {
  it('répond en text/plain avec les métriques attendues', async () => {
    const res = await request(createApp()).get('/metrics')
    expect(res.status).toBe(200)
    expect(res.headers['content-type']).toMatch(/text\/plain/)
    expect(res.text).toContain('# HELP http_requests_total')
    expect(res.text).toContain('# TYPE http_request_duration_seconds histogram')
    expect(res.text).toContain('taskflow_tasks_total')
    expect(res.text).toContain('process_cpu_seconds_total')
  })

  it('étiquette method / route normalisée / status_code', async () => {
    const app = createApp()
    await request(app).get('/api/tasks')
    const created = await request(app).post('/api/tasks').send({ text: 'metric-test' })
    await request(app).patch(`/api/tasks/${created.body.id}/toggle`)

    const body = (await request(app).get('/metrics')).text
    expect(body).toMatch(
      /http_requests_total\{[^}]*method="GET"[^}]*route="\/api\/tasks"[^}]*status_code="200"/
    )
    expect(body).toMatch(/route="\/api\/tasks\/:id\/toggle"/)
    expect(body).not.toContain(created.body.id)
  })

  it('met à jour taskflow_tasks_total après création', async () => {
    const app = createApp()
    await request(app).post('/api/tasks').send({ text: 'un' })
    await request(app).post('/api/tasks').send({ text: 'deux' })
    const gauge = await register.getSingleMetric('taskflow_tasks_total').get()
    expect(gauge.values[0].value).toBe(2)
  })
})
