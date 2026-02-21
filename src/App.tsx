import { useEffect, useMemo, useState } from 'react';
import { Terminal, Cpu, Database, Activity, Flame, AlertTriangle, KeyRound } from 'lucide-react';
import { projects } from './data/projects';
import { ProjectCard } from './components/ProjectCard';
import { AdminBanner } from './components/AdminBanner';
import { PudinButton } from './components/PudinButton';
import { EcosystemHeader } from './components/EcosystemHeader';
import { SrapBridgePage } from './components/SrapBridgePage';
import { usePudin } from './hooks/usePudin';
import { useStats } from './hooks/useStats';
import { Project } from './types';
import { syncPudinFromUrl } from './utils/access';

interface HubStatus {
  cpu_load: number;
  vqe_state: string;
  shor_factor: string;
  vibe: string;
  system_status: 'online' | 'offline';
  grover_status: 'READY' | 'RUNNING' | 'LOCKED' | 'OFFLINE';
  vqe_status: 'READY' | 'OPTIMIZING' | 'LOCKED' | 'OFFLINE';
  shor_status: 'READY' | 'FACTORIZING' | 'LOCKED' | 'OFFLINE';
  poas: number;
  ultima_llave: string;
  llave_expiracion: number;
  countdown: string;
  status: 'online' | 'offline';
  updated_at?: string;
}

const HOUR = 3600;

const initialStatus: HubStatus = {
  cpu_load: 23,
  vqe_state: '-0.9321',
  shor_factor: 'pending',
  vibe: 'Estable',
  system_status: 'online',
  grover_status: 'READY',
  vqe_status: 'OPTIMIZING',
  shor_status: 'LOCKED',
  poas: 0.6,
  ultima_llave: '92028127',
  llave_expiracion: Math.floor(Date.now() / 1000) + HOUR,
  countdown: '60:00',
  status: 'online',
  updated_at: new Date().toISOString()
};

const formatCountdown = (seconds: number) => {
  const safe = Math.max(0, seconds);
  const mm = Math.floor(safe / 60).toString().padStart(2, '0');
  const ss = Math.floor(safe % 60).toString().padStart(2, '0');
  return `${mm}:${ss}`;
};

function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [hubStatus, setHubStatus] = useState<HubStatus>(initialStatus);
  const [statusLatencyMs, setStatusLatencyMs] = useState<number | null>(null);
  const [countdownNow, setCountdownNow] = useState(initialStatus.countdown);
  const { pudinState } = usePudin();
  const { stats, topNode, registerVisit, updateNodosActivos, trackDecodification, trackNodeClick } = useStats();

  useEffect(() => {
    setIsAdmin(syncPudinFromUrl());
  }, []);

  useEffect(() => {
    registerVisit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    window.chalamandra = window.chalamandra || {
      isPudinActive: () => isAdmin
    };
  }, [isAdmin]);

  useEffect(() => {
    window.trackDecoEvent = (event: string, details: { valor: string; nodo: string }) => {
      console.log(`[DECO_LOG]: ${event}`, {
        ...details,
        timestamp: new Date().toISOString(),
        access_level: isAdmin ? 'Pudin_Master' : 'User'
      });
    };
  }, [isAdmin]);

  useEffect(() => {
    const readStatus = async () => {
      const startedAt = performance.now();
      try {
        const response = await fetch('/status.json', { cache: 'no-store' });
        if (!response.ok) throw new Error('status_unreachable');

        const payload = (await response.json()) as Partial<HubStatus>;
        const keyExpires = payload.llave_expiracion ?? Math.floor(Date.now() / 1000) + HOUR;
        const remaining = keyExpires - Math.floor(Date.now() / 1000);

        const normalized: HubStatus = {
          ...initialStatus,
          ...payload,
          status: payload.status ?? payload.system_status ?? 'online',
          system_status: payload.system_status ?? payload.status ?? 'online',
          poas: payload.poas ?? Number((Math.max(0.1, (payload.cpu_load ?? initialStatus.cpu_load) / 70)).toFixed(2)),
          ultima_llave: payload.ultima_llave ?? initialStatus.ultima_llave,
          llave_expiracion: keyExpires,
          countdown: payload.countdown ?? formatCountdown(remaining),
          updated_at: payload.updated_at ?? new Date().toISOString()
        };

        setHubStatus(normalized);
        setStatusLatencyMs(Math.round(performance.now() - startedAt));
        setCountdownNow(normalized.countdown);
        localStorage.setItem('hub_status', JSON.stringify(normalized));
        localStorage.setItem('hub_system_mode', normalized.system_status);
        window.dispatchEvent(new CustomEvent('chalamandra:hub-status', { detail: { ...normalized, status: normalized.system_status } }));
      } catch {
        setHubStatus((prev) => {
          const offline: HubStatus = {
            ...prev,
            system_status: 'offline',
            vibe: 'Offline',
            grover_status: 'OFFLINE',
            vqe_status: 'OFFLINE',
            shor_status: 'OFFLINE',
            status: 'offline'
          };
          localStorage.setItem('hub_system_mode', 'offline');
          window.dispatchEvent(new CustomEvent('chalamandra:hub-status', { detail: { ...offline, status: 'offline' } }));
          return offline;
        });
      }
    };

    readStatus();
    const timer = window.setInterval(readStatus, 30_000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setHubStatus((prev) => {
        const left = prev.llave_expiracion - Math.floor(Date.now() / 1000);
        const nextCountdown = formatCountdown(left);
        setCountdownNow(nextCountdown);
        if (left <= 0 && prev.system_status !== 'offline') {
          const expired = {
            ...prev,
            countdown: '00:00',
            system_status: 'offline' as const,
            status: 'offline' as const,
            vibe: 'Llave expirada'
          };
          window.dispatchEvent(new CustomEvent('chalamandra:hub-status', { detail: { ...expired, status: 'offline' } }));
          return expired;
        }
        return { ...prev, countdown: nextCountdown };
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const isOffline = hubStatus.system_status === 'offline';
  const keyRemaining = Math.max(0, hubStatus.llave_expiracion - Math.floor(Date.now() / 1000));
  const isLast10Minutes = keyRemaining <= 600;
  const isShorFactoring15 = hubStatus.shor_factor.includes('15=') || hubStatus.shor_status === 'FACTORIZING';
  const cpuDisplay = isShorFactoring15 || isLast10Minutes ? 100 : hubStatus.cpu_load;

  useEffect(() => {
    updateNodosActivos(isOffline ? 0 : Math.max(100, 90 + Math.floor(cpuDisplay)));
  }, [cpuDisplay, isOffline, updateNodosActivos]);

  const handleUpgrade = (project: Project) => {
    trackDecodification();
    trackNodeClick(project.title);
    window.open('#', '_blank', 'noopener,noreferrer');
  };

  const path = window.location.pathname;

  const pulseValues = useMemo(() => {
    const base = isOffline ? 4 : Math.min(96, Math.max(8, cpuDisplay));
    return Array.from({ length: 24 }, (_, i) => {
      const wobble = Math.sin((i + base) / 2.7) * (isOffline ? 1.5 : 7);
      const spike = i % 6 === 0 && !isOffline ? base * 0.18 : 0;
      return Math.max(2, Math.min(100, Math.round(base * 0.55 + wobble + spike)));
    });
  }, [cpuDisplay, isOffline]);

  const networkHeat = [
    { label: 'HUB', value: 1 },
    { label: 'DOSSIER', value: stats.clicksByNode['Chalamandra Magistral'] ?? 0 },
    { label: 'AJEDREZ', value: stats.clicksByNode['Ajedrez Criminal'] ?? 0 },
    { label: 'ORÁCULO', value: stats.clicksByNode['Oráculo Chalamandra'] ?? 0 },
    { label: 'SRAP', value: stats.clicksByNode['SRAP: Realidades Crudas'] ?? 0 }
  ];

  if (path === '/nodo-srap' || path === '/srap') {
    return <SrapBridgePage />;
  }

  return (
    <div className={`min-h-screen bg-black px-6 pb-8 text-gray-100 transition-all duration-300 md:px-8 ${isAdmin ? 'pt-44 md:pt-36' : 'pt-20'} ${isOffline ? 'grayscale' : ''}`}>
      <EcosystemHeader isAdmin={isAdmin} />

      {isAdmin && (
        <AdminBanner
          decodificaciones={stats.decodificaciones}
          escaneos={stats.escaneos}
          nodosActivos={stats.nodosActivos}
          topNode={topNode}
        />
      )}

      {isOffline && (
        <div className="mx-auto mb-4 flex max-w-5xl items-center gap-2 rounded border border-red-500/50 bg-red-950/30 px-3 py-2 text-xs text-red-200">
          <AlertTriangle className="h-4 w-4" />
          SISTEMA OFFLINE: Bloqueo total. Regresa al Dossier para generar otra llave temporal.
        </div>
      )}

      <div className="mx-auto mb-4 flex max-w-5xl items-center justify-between">
        <div className="flex items-center gap-2 rounded-full border border-green-900 bg-green-950/20 px-3 py-1">
          <div className={`h-2 w-2 rounded-full ${isOffline ? 'bg-red-500' : 'animate-pulse bg-green-500'}`} />
          <span className="text-[10px] uppercase tracking-widest text-green-500">Monitor de Masa Crítica · status.json</span>
        </div>

        <div className="flex items-center gap-2 text-[10px] text-gray-500">
          <Terminal className="h-3 w-3" />
          <span>v2.6.0</span>
        </div>
      </div>

      <header className="relative mx-auto mb-10 max-w-5xl border-l-4 border-blue-600 py-2 pl-8">
        <h1 className="text-5xl font-black tracking-tighter text-white md:text-6xl">CHALAMANDRA HUB</h1>
        <div className="mt-2 flex items-center justify-between">
          <p className="text-xs uppercase tracking-[0.3em] text-blue-500">Monitor de Masa Crítica · Celeron N4020</p>
          <div className="flex items-center gap-4 text-[10px] text-gray-600">
            <div className="flex items-center gap-1">
              <Cpu className="h-3 w-3" />
              <span>CPU: {cpuDisplay}%</span>
            </div>
            <div className="flex items-center gap-1">
              <Database className="h-3 w-3" />
              <span>RAM: {isOffline ? '--' : Math.max(1.1, cpuDisplay / 40).toFixed(1)}GB</span>
            </div>
          </div>
        </div>
      </header>

      <section className="mx-auto mb-8 grid max-w-5xl grid-cols-1 gap-4 md:grid-cols-4">
        <div className="rounded border border-green-700/30 bg-green-950/10 p-4">
          <p className="mb-2 text-[10px] uppercase tracking-[0.25em] text-green-300">Live Pulse</p>
          <div className="flex h-16 items-end gap-1">
            {pulseValues.map((value, idx) => (
              <div key={idx} className={`w-full rounded-sm ${isOffline ? 'bg-slate-500/60' : 'bg-green-500/80'}`} style={{ height: `${value}%` }} />
            ))}
          </div>
        </div>

        <div className="rounded border border-blue-700/30 bg-blue-950/10 p-4 text-xs text-blue-200">
          <p className="mb-2 text-[10px] uppercase tracking-[0.25em] text-blue-300">Latencia de Conciencia</p>
          <p className="font-mono text-xl text-blue-100">{statusLatencyMs ?? '--'}ms</p>
          <p className="mt-2 text-[11px] text-blue-300/80">VQE {hubStatus.vqe_state} · SHOR {hubStatus.shor_factor}</p>
        </div>

        <div className={`rounded border p-4 text-xs ${cpuDisplay >= 90 ? 'border-red-600/40 bg-red-950/20 text-red-200' : 'border-yellow-700/30 bg-yellow-950/10 text-yellow-200'}`}>
          <p className="mb-2 flex items-center gap-2 text-[10px] uppercase tracking-[0.25em]"><Flame className="h-3 w-3" /> Sensor de Estrés</p>
          <p className="font-mono text-xl">{hubStatus.vibe}</p>
          <p className="mt-2 text-[11px]">
            {cpuDisplay >= 90
              ? 'ALERTA: Uso de CPU al 100% (Shor/escasez de llave).'
              : isOffline
                ? 'Sistema sin telemetría: modo degradado activo.'
                : 'Operación estable.'}
          </p>
        </div>

        <div className={`rounded border p-4 text-xs ${isLast10Minutes ? 'border-rose-500/50 bg-rose-950/30 text-rose-200 animate-pulse' : 'border-cyan-700/30 bg-cyan-950/10 text-cyan-200'}`}>
          <p className="mb-2 flex items-center gap-2 text-[10px] uppercase tracking-[0.25em]"><KeyRound className="h-3 w-3" /> Vida media de llave</p>
          <p className="font-mono text-xl">{countdownNow}</p>
          <p className="mt-2 text-[11px]">Llave: {hubStatus.ultima_llave} · POAS {hubStatus.poas.toFixed(2)}</p>
        </div>
      </section>

      <section className="mx-auto mb-10 max-w-5xl rounded border border-fuchsia-700/20 bg-fuchsia-950/10 p-4">
        <div className="mb-3 flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-fuchsia-300">
          <Activity className="h-3 w-3" /> Mapa de Calor de la Red
        </div>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-5">
          {networkHeat.map((zone) => {
            const hot = zone.value > 3;
            const warm = zone.value > 0;
            return (
              <div key={zone.label} className={`rounded border p-2 text-center font-mono text-xs ${hot ? 'border-red-500/50 bg-red-900/40 text-red-200' : warm ? 'border-yellow-500/40 bg-yellow-900/30 text-yellow-200' : 'border-slate-700/50 bg-slate-900/40 text-slate-300'}`}>
                <p>{zone.label}</p>
                <p className="text-[10px] opacity-80">{hot ? 'Zona de Conflicto' : warm ? 'Caliente' : 'Fría'}</p>
              </div>
            );
          })}
        </div>
      </section>

      <main className="mx-auto grid max-w-6xl grid-cols-1 gap-12 md:grid-cols-2">
        {projects.map((p, i) => (
          <ProjectCard
            key={p.id}
            project={p}
            index={i}
            pudinIntensity={pudinState.intensity}
            isAdmin={isAdmin}
            onUpgrade={handleUpgrade}
            onNodeClick={trackNodeClick}
            isDegraded={isOffline}
          />
        ))}
      </main>

      <footer className="mx-auto mt-20 max-w-5xl border-t border-gray-900 pt-8 text-center">
        <div className="mb-4 flex items-center justify-center gap-8">
          <div className="text-[10px] text-gray-600"><span className="text-gray-500">PUDIN ACTIVATIONS:</span> {pudinState.totalActivations}</div>
          <div className="text-[10px] text-gray-600"><span className="text-gray-500">DECODIFICACIONES:</span> {stats.decodificaciones}</div>
          <div className="text-[10px] text-gray-600"><span className="text-gray-500">UPTIME:</span> {isOffline ? 'OFFLINE' : '99.7%'}</div>
        </div>

        <div className="grid grid-cols-3 gap-2 opacity-50 transition-all font-mono text-[9px] hover:opacity-100">
          <div id="status-grover">GROVER: <span className="text-green-500">{hubStatus.grover_status}</span></div>
          <div id="status-vqe">VQE: <span className="text-yellow-500">{hubStatus.vqe_status}</span></div>
          <div id="status-shor">SHOR: <span className="text-red-500">{hubStatus.shor_status}</span></div>
        </div>

        <p className="mt-4 text-[10px] uppercase tracking-[0.5em] text-gray-600">Construido en el borde del hardware</p>
      </footer>

      <PudinButton />
    </div>
  );
}

export default App;
