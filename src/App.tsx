import React from 'react';
import { useState } from 'react';
import { projects } from './data/projects';
import { ProjectCard } from './components/ProjectCard';
import { AdminBanner } from './components/AdminBanner';
import { PudinButton } from './components/PudinButton';
import { ProBadge } from './components/ProBadge';
import { PremiumButton } from './components/PremiumButton';
import { AdminBunker } from './components/AdminBunker';
import { usePudin } from './hooks/usePudin';
import { useStats } from './hooks/useStats';
import { trackKofiClick, isPanicModeEnabled } from './utils/platformState';
import { Terminal, Cpu, Database } from 'lucide-react';

const KOFI_URL = 'https://ko-fi.com/chalamandramagistral';
const BUNKER_ACCESS_CODE = 'BUNKER-2026';
const ACCESS_COOKIE = 'access=pudin; path=/; max-age=31536000; SameSite=Lax';

function App() {
  const [showAdminBanner, setShowAdminBanner] = useState(false);
  const [showBunkerCodeInput, setShowBunkerCodeInput] = useState(false);
  const [accessCode, setAccessCode] = useState('');
  const [accessMessage, setAccessMessage] = useState('');
  const [panicMode, setPanicModeState] = useState(false);
  const { pudinState } = usePudin();
  const { stats } = useStats();

  const getKofiCheckoutUrl = () => {
    const returnUrl = `${window.location.origin}${window.location.pathname}?kofi_return=1`;
    return `${KOFI_URL}?return_url=${encodeURIComponent(returnUrl)}`;
  };

  // Configurar tracking global
  React.useEffect(() => {
    window.trackDecoEvent = (event: string, data: { valor: string; nodo: string }) => {
      console.log(`🔥 DECO EVENT: ${event}`, data);
      // Aquí se podría integrar con Google Analytics, Mixpanel, etc.
    };
  }, []);

  React.useEffect(() => {
    setPanicModeState(isPanicModeEnabled());

    const updatePanicMode = () => {
      setPanicModeState(isPanicModeEnabled());
    };

    window.addEventListener('chalamandra:panic-mode-updated', updatePanicMode);
    window.addEventListener('storage', updatePanicMode);

    return () => {
      window.removeEventListener('chalamandra:panic-mode-updated', updatePanicMode);
      window.removeEventListener('storage', updatePanicMode);
    };
  }, []);

  React.useEffect(() => {
    const url = new URL(window.location.href);
    const returnedFromKofi = url.searchParams.get('kofi_return') === '1';

    if (returnedFromKofi) {
      setShowBunkerCodeInput(true);
      url.searchParams.delete('kofi_return');
      window.history.replaceState({}, '', url.toString());
    }
  }, []);

  const handleBunkerSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (accessCode.trim() === BUNKER_ACCESS_CODE) {
      document.cookie = ACCESS_COOKIE;
      setAccessMessage('✅ Acceso validado. Cookie access=pudin activada.');
      setShowBunkerCodeInput(false);
      setAccessCode('');
      return;
    }

    setAccessMessage('❌ Código inválido. Inténtalo de nuevo.');
  };

  const pathname = window.location.pathname.replace(/\/$/, '') || '/';
  if (pathname === '/admin-bunker') {
    return <AdminBunker />;
  }

  if (panicMode) {
    return (
      <div className="min-h-screen fondo-urbano flex items-center justify-center px-6 text-center">
        <div className="max-w-xl border border-[var(--chala-rojo)]/60 p-8">
          <h1 className="text-3xl font-black uppercase tracking-widest text-[var(--chala-rojo)]">
            Mantenimiento por Decodificación
          </h1>
          <p className="mt-4 text-[var(--chala-gris)] text-sm">
            Estamos aplicando ajustes críticos en vivo. Regresa en unos minutos.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen font-sans selection:bg-[var(--chala-azul)] selection:text-white transition-all duration-300 ${showAdminBanner ? 'pt-20' : 'pt-8'} px-8 pb-8 fondo-urbano`}>
      {/* Admin Banner */}
      <AdminBanner
        isVisible={showAdminBanner}
        onToggle={() => setShowAdminBanner(!showAdminBanner)}
      />

      {/* Status Indicator */}
      <div className="max-w-5xl mx-auto flex justify-between items-center mb-4">
        <div className="flex items-center gap-2 px-3 py-1 border border-[var(--chala-verde)]/40 bg-[var(--chala-verde)]/10 rounded-full">
          <div className="w-2 h-2 bg-[var(--chala-verde)] rounded-full animate-pulse"></div>
          <span className="text-[10px] font-mono text-[var(--chala-verde)] uppercase tracking-widest">All Systems Operational</span>
        </div>

        <div className="flex items-center gap-4">
          <ProBadge variant="elite" size="sm" />
          <div className="flex items-center gap-2 text-[10px] text-gray-500">
            <Terminal className="w-3 h-3" />
            <span>v2.1.0</span>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="max-w-5xl mx-auto mb-16 border-l-4 border-[var(--chala-azul)] pl-8 py-2 relative">
        <h1 className="text-6xl font-black tracking-tighter text-white">CHALAMANDRA</h1>
        <div className="flex items-center justify-between mt-2">
          <p className="text-[var(--chala-mandala)] font-mono tracking-[0.3em] uppercase text-xs">Ecosistema de Ingeniería</p>
          <div className="flex items-center gap-4 text-[10px] text-[var(--chala-gris)]/70">
            <div className="flex items-center gap-1">
              <Cpu className="w-3 h-3" />
              <span>CPU: 23%</span>
            </div>
            <div className="flex items-center gap-1">
              <Database className="w-3 h-3" />
              <span>RAM: 1.2GB</span>
            </div>
          </div>
        </div>
      </header>

      {/* Projects Grid */}
      <main className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
        {projects.map((p, i) => (
          <ProjectCard
            key={p.id}
            project={p}
            index={i}
            pudinIntensity={pudinState.intensity}
          />
        ))}
      </main>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto mt-20 pt-8 border-t border-gray-900 text-center">
        <div className="mb-8 flex justify-center">
          <PremiumButton variant="cta" size="lg" />
        </div>

        <div className="mb-6 flex items-center justify-center gap-6 text-xs uppercase tracking-[0.2em]">
          <a
            href={getKofiCheckoutUrl()}
            target="_blank"
            rel="noopener noreferrer"
            onClick={trackKofiClick}
            className="text-[var(--chala-rosa)] hover:text-[var(--chala-mandala)] transition-colors"
          >
            Suscripción
          </a>
          <a
            href={getKofiCheckoutUrl()}
            target="_blank"
            rel="noopener noreferrer"
            onClick={trackKofiClick}
            className="text-[var(--chala-rosa)] hover:text-[var(--chala-mandala)] transition-colors"
          >
            Soporte
          </a>
        </div>

        {showBunkerCodeInput && (
          <form onSubmit={handleBunkerSubmit} className="mb-6 mx-auto max-w-md space-y-2">
            <label htmlFor="bunker-code" className="block text-xs text-[var(--chala-mandala)] uppercase tracking-widest">
              Introduce tu Código de Acceso del Búnker
            </label>
            <input
              id="bunker-code"
              type="text"
              value={accessCode}
              onChange={(event) => setAccessCode(event.target.value)}
              className="w-full border border-[var(--chala-azul)]/70 bg-[var(--chala-tinta)] px-3 py-2 text-sm text-[var(--chala-gris)] outline-none focus:border-[var(--chala-mandala)]"
              autoComplete="off"
            />
            <button
              type="submit"
              className="px-4 py-2 border border-[var(--chala-rosa)] text-[var(--chala-gris)] text-xs uppercase tracking-wider hover:bg-[var(--chala-rosa)]/20 transition-colors boton-audaz"
            >
              Validar acceso
            </button>
          </form>
        )}

        {accessMessage && <p className="mb-4 text-xs text-[var(--chala-gris)]">{accessMessage}</p>}

        <div className="flex items-center justify-center gap-8 mb-4">
          <div className="text-[10px] text-gray-600">
            <span className="text-gray-500">PUDIN ACTIVATIONS:</span> {pudinState.totalActivations}
          </div>
          <div className="text-[10px] text-gray-600">
            <span className="text-gray-500">DECODIFICACIONES:</span> {stats.decodificaciones}
          </div>
          <div className="text-[10px] text-gray-600">
            <span className="text-gray-500">UPTIME:</span> 99.7%
          </div>
          <div className="text-[10px] text-gray-600">
            <span className="text-gray-500">BUILD:</span> 2026.12.15
          </div>
        </div>
        <p className="text-gray-600 text-[10px] tracking-[0.5em] uppercase">
          Construido en el borde del hardware
        </p>
      </footer>

      {/* Pudin Button */}
      <PudinButton />
    </div>
  );
}

export default App;
