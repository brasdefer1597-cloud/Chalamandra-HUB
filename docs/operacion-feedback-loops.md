# Operación AdminBunker: Feedback Loops, Hardening y Runbook

Este documento aterriza un plan **ejecutable** para robustecer `/admin-bunker`, el tracking de Ko-fi y el Modo Pánico con enfoque de producto + seguridad.

---

## 6) 🔁 Diseño de Feedback Loops (pseudocódigo, métricas, pipelines)

### 6.1 Loop A — Conversión Hub ➜ Ko-fi

**Objetivo:** medir clicks reales y mejorar conversión sin sesgo de `localStorage`.

**Pipeline sugerido**
1. Frontend emite evento `kofi_click`.
2. API valida `origin`, agrega `user_agent`, `ip_hash`, `session_id`.
3. Se escribe en tabla `events_raw`.
4. Job horario agrega a `metrics_daily`.
5. AdminBunker consume endpoint `/metrics/kofi/today`.

**Pseudocódigo**
```ts
// FE
onKofiClick() {
  post('/api/events', {
    type: 'kofi_click',
    source: 'hub_footer',
    ts: Date.now(),
  });
  redirect(kofiUrlWithReturn);
}

// BE
POST /api/events:
  assert allowed_origin
  sanitize(payload)
  insert events_raw(type, source, ts, ip_hash, ua_hash, session_id)
  return 202

// Aggregator (cron 5 min)
for each day D:
  clicks = count(distinct session_id) where type='kofi_click' and day= D
  upsert metrics_daily(day=D, kofi_clicks=clicks)
```

**Métricas mínimas**
- `kofi_clicks_total`
- `kofi_clicks_unique`
- `ctr_kofi = kofi_clicks_unique / hub_unique_sessions`
- `return_rate = bunker_prompt_views / kofi_clicks_unique`

---

### 6.2 Loop B — Acceso Búnker (post-Ko-fi)

**Objetivo:** reducir falsos positivos y abuso de código estático.

**Pipeline sugerido**
1. Usuario vuelve con `kofi_return=1&nonce=...`.
2. FE muestra prompt solo si nonce válido.
3. API verifica código/claim y emite sesión firmada (`HttpOnly`).
4. FE consulta `/api/me` para habilitar AdminBunker.

**Pseudocódigo**
```ts
// FE
if (searchParams.has('kofi_return')) {
  showAccessPrompt();
}

submitCode(code) {
  const res = post('/api/bunker/verify', { code, nonce });
  if (res.ok) refreshSession();
}

// BE
POST /api/bunker/verify:
  rateLimit(ip, 5/min)
  if !validNonce(nonce) -> 400
  if !verifyCodeHash(code) -> 401
  setCookie('bunker_session', jwt, HttpOnly+Secure+SameSite=Lax)
  return 204
```

**Métricas mínimas**
- `bunker_attempts_total`
- `bunker_success_rate`
- `bunker_failed_by_ip`
- `median_attempt_time`

---

### 6.3 Loop C — Modo Pánico (operación crítica)

**Objetivo:** garantizar consistencia global y auditabilidad.

**Pipeline sugerido**
1. Admin autenticado activa switch.
2. API persiste `panic_mode=true` + `actor` + `reason`.
3. FE pública consulta estado cada 15–30s o por SSE.
4. Se registra evento de activación/desactivación.

**Pseudocódigo**
```ts
// BE
POST /api/admin/panic-mode { enabled, reason }
  requireRole('admin')
  write feature_flags.panic_mode = enabled
  insert audit_log(actor, action='panic_mode_toggle', reason)
  broadcast('panic_mode_updated')

// FE Public
onLoad() {
  panic = fetch('/api/public/flags').panic_mode;
  if (panic) renderMaintenance();
}
```

**Métricas mínimas**
- `panic_mode_uptime_minutes`
- `mttr_panic` (tiempo en desactivar)
- `toggles_per_week`
- `toggle_without_reason_count`

---

## 7) 💻 Código / Snippets (refactorizados y listos para copiar/pegar)

### 7.1 Helper para cookie de acceso (migración temporal FE)
```ts
export const setAccessCookie = () => {
  const secure = location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `access=pudin; path=/; max-age=31536000; SameSite=Lax${secure}`;
};
```

### 7.2 Normalizador de ruta y guard reutilizable
```ts
export const normalizePath = (path: string) => path.replace(/\/$/, '') || '/';

export const hasPudinAccess = () =>
  document.cookie.split(';').some((c) => c.trim() === 'access=pudin');
```

### 7.3 Cliente de métricas (preparado para backend)
```ts
export async function getKofiClicksToday(): Promise<number> {
  const r = await fetch('/api/metrics/kofi/today');
  if (!r.ok) return 0;
  const data = await r.json();
  return Number(data.clicks ?? 0);
}
```

### 7.4 Evento tipado para tracking
```ts
type HubEvent = {
  type: 'kofi_click' | 'bunker_code_submit' | 'panic_mode_toggle';
  ts: number;
  meta?: Record<string, string | number | boolean>;
};

export const track = (evt: HubEvent) => {
  navigator.sendBeacon('/api/events', JSON.stringify(evt));
};
```

---

## 8) 🧪 Tests & Métricas (qué medir, cómo validar)

### 8.1 Tests funcionales
- `/admin-bunker` sin cookie ➜ **Acceso Denegado**.
- `/admin-bunker` con sesión válida ➜ panel visible.
- Activar Modo Pánico ➜ home muestra mantenimiento.
- Desactivar Modo Pánico ➜ home vuelve al hub.
- Click en Suscripción/Soporte ➜ incrementa contador (o evento API).

### 8.2 Tests de seguridad
- Reintentos de código Búnker con rate-limit.
- Verificar flags de cookie (`HttpOnly`, `Secure`, `SameSite`).
- CSRF test en endpoint de pánico (token requerido).
- Validación de origen y payload para `/api/events`.

### 8.3 Métricas operativas recomendadas (dashboard)
- **Funnel Ko-fi:** impresiones CTA ➜ clicks ➜ retorno ➜ acceso Búnker.
- **Confiabilidad:** error rate endpoints admin, p95 latency.
- **Seguridad:** intentos fallidos por IP, toggles pánico por actor.

### 8.4 Criterios de aceptación
- p95 `/api/public/flags` < 150ms.
- 0 activaciones de pánico sin actor/reason.
- `bunker_success_rate` estable (sin picos de brute force).

---

## 9) 🚀 Plan de Despliegue y Rollback (checklist práctico)

### Despliegue
- [ ] Crear feature flag `server_backed_admin`.
- [ ] Publicar endpoints `/api/events`, `/api/admin/panic-mode`, `/api/public/flags`.
- [ ] Habilitar tabla `audit_log`.
- [ ] Migrar lectura de contador Ko-fi a backend.
- [ ] Activar monitoreo + alertas (error rate, latencia, toggles pánico).
- [ ] Canary 10% tráfico por 30 min.
- [ ] Rollout 100% si KPIs sanos.

### Rollback
- [ ] Desactivar `server_backed_admin`.
- [ ] Restaurar lectura local (`localStorage`) solo temporalmente.
- [ ] Mantener endpoints en read-only para forense.
- [ ] Revisar `audit_log` del intervalo del incidente.

---

## 10) 📘 Notas Senior Chalamandra (alto nivel)

- El sistema actual funciona para demo/operación local, pero **no debe considerarse seguro** para control real de acceso.
- `localStorage` y cookies de cliente son útiles para UX, no para autorización fuerte.
- El paso crítico es pasar a un modelo **server-authoritative** (sesión firmada, endpoints protegidos, auditoría).
- Mantén el espíritu del Hub (rápido y visual), pero separa claramente:
  - UX y estado visual en frontend.
  - Seguridad, permisos y métricas reales en backend.

