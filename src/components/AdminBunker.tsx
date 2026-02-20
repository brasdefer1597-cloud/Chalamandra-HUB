import React from 'react';
import { getKofiClicksToday, isPanicModeEnabled, setPanicMode } from '../utils/platformState';

const nodes = [
  { id: 'hub', name: 'Hub', status: 'OPERATIVO', color: 'text-green-400' },
  { id: 'ajedrez', name: 'Ajedrez', status: 'OPERATIVO', color: 'text-green-400' },
  { id: 'oraculo', name: 'Oráculo', status: 'ESTABLE', color: 'text-blue-400' },
  { id: 'srap', name: 'SRAP', status: 'MONITOREO', color: 'text-yellow-400' }
];

const hasPudinAccess = () => document.cookie.split(';').some((part) => part.trim() === 'access=pudin');

export const AdminBunker: React.FC = () => {
  const [kofiClicksToday, setKofiClicksToday] = React.useState(0);
  const [panicMode, setPanicModeState] = React.useState(false);

  React.useEffect(() => {
    const refresh = () => {
      setKofiClicksToday(getKofiClicksToday());
      setPanicModeState(isPanicModeEnabled());
    };

    refresh();
    window.addEventListener('chalamandra:kofi-clicks-updated', refresh);
    window.addEventListener('chalamandra:panic-mode-updated', refresh);
    window.addEventListener('storage', refresh);

    return () => {
      window.removeEventListener('chalamandra:kofi-clicks-updated', refresh);
      window.removeEventListener('chalamandra:panic-mode-updated', refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);

  if (!hasPudinAccess()) {
    return (
      <div className="min-h-screen flex items-center justify-center fondo-urbano px-6">
        <div className="border border-[var(--chala-rojo)]/50 p-8 text-center max-w-lg">
          <h1 className="text-2xl font-black text-[var(--chala-rojo)] uppercase tracking-widest">Acceso Denegado</h1>
          <p className="mt-3 text-sm text-[var(--chala-gris)]">Esta ruta oculta requiere cookie de acceso Pudin.</p>
          <a href="/" className="inline-block mt-6 text-[var(--chala-mandala)] hover:underline">Volver al Hub</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen fondo-urbano px-8 py-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-black text-[var(--chala-mandala)] uppercase tracking-wider">Admin Bunker</h1>
        <p className="text-sm text-[var(--chala-gris)] mt-2">Panel oculto de estado y control crítico.</p>

        <section className="mt-8 border border-[var(--chala-azul)]/50 p-6">
          <h2 className="text-lg font-bold text-[var(--chala-rosa)] uppercase">Salud de nodos</h2>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {nodes.map((node) => (
              <div key={node.id} className="border border-gray-700 p-4 bg-black/20">
                <div className="text-xs uppercase text-gray-400">Nodo</div>
                <div className="text-xl font-bold text-white">{node.name}</div>
                <div className={`text-xs mt-1 font-mono ${node.color}`}>{node.status}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-6 border border-[var(--chala-verde)]/40 p-6">
          <h2 className="text-lg font-bold text-[var(--chala-verde)] uppercase">Monitor Ko-fi (hoy)</h2>
          <p className="mt-2 text-sm text-[var(--chala-gris)]">Saltos detectados desde el Hub hacia Ko-fi en el día actual:</p>
          <p className="mt-3 text-4xl font-black text-[var(--chala-mandala)]">{kofiClicksToday}</p>
        </section>

        <section className="mt-6 border border-[var(--chala-rojo)]/60 p-6">
          <h2 className="text-lg font-bold text-[var(--chala-rojo)] uppercase">Modo Pánico</h2>
          <p className="mt-2 text-sm text-[var(--chala-gris)]">
            Al activarlo, todas las páginas públicas muestran “Mantenimiento por Decodificación”.
          </p>
          <button
            onClick={() => setPanicMode(!panicMode)}
            className="mt-4 px-4 py-2 border border-[var(--chala-rojo)] text-white hover:bg-[var(--chala-rojo)]/30 transition-colors"
          >
            {panicMode ? 'Desactivar Modo Pánico' : 'Activar Modo Pánico'}
          </button>
          <p className="mt-2 text-xs font-mono text-[var(--chala-gris)]">
            Estado actual: {panicMode ? 'ACTIVADO' : 'DESACTIVADO'}
          </p>
        </section>
      </div>
    </div>
  );
};
