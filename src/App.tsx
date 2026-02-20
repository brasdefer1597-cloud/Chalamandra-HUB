import React from 'react';
import { useState } from 'react';
import { projects } from './data/projects';
import { ProjectCard } from './components/ProjectCard';
import { AdminBanner } from './components/AdminBanner';
import { PudinButton } from './components/PudinButton';
import { ProBadge } from './components/ProBadge';
import { PremiumButton } from './components/PremiumButton';
import { usePudin } from './hooks/usePudin';
import { useStats } from './hooks/useStats';
import { Terminal, Cpu, Database } from 'lucide-react';

const KOFI_URL = 'https://ko-fi.com/chalamandramagistral';
const BUNKER_ACCESS_CODE = 'BUNKER-2026';
const ACCESS_COOKIE = 'access=pudin; path=/; max-age=31536000; SameSite=Lax';

function App() {
  const [showAdminBanner, setShowAdminBanner] = useState(false);
  const [showBunkerCodeInput, setShowBunkerCodeInput] = useState(false);
  const [accessCode, setAccessCode] = useState('');
  const [accessMessage, setAccessMessage] = useState('');
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

  return (
    <div className={`min-h-screen bg-black text-gray-100 font-sans selection:bg-blue-500 selection:text-white transition-all duration-300 ${showAdminBanner ? 'pt-20' : 'pt-8'} px-8 pb-8`}>
      {/* Admin Banner */}
      <AdminBanner
        isVisible={showAdminBanner}
        onToggle={() => setShowAdminBanner(!showAdminBanner)}
      />

      {/* Status Indicator */}
      <div className="max-w-5xl mx-auto flex justify-between items-center mb-4">
        <div className="flex items-center gap-2 px-3 py-1 border border-green-900 bg-green-950/20 rounded-full">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-[10px] font-mono text-green-500 uppercase tracking-widest">All Systems Operational</span>
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
      <header className="max-w-5xl mx-auto mb-16 border-l-4 border-blue-600 pl-8 py-2 relative">
        <h1 className="text-6xl font-black tracking-tighter text-white">CHALAMANDRA</h1>
        <div className="flex items-center justify-between mt-2">
          <p className="text-blue-500 font-mono tracking-[0.3em] uppercase text-xs">Ecosistema de Ingeniería</p>
          <div className="flex items-center gap-4 text-[10px] text-gray-600">
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
            className="text-purple-400 hover:text-purple-300 transition-colors"
          >
            Suscripción
          </a>
          <a
            href={getKofiCheckoutUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-400 hover:text-purple-300 transition-colors"
          >
            Soporte
          </a>
        </div>

        {showBunkerCodeInput && (
          <form onSubmit={handleBunkerSubmit} className="mb-6 mx-auto max-w-md space-y-2">
            <label htmlFor="bunker-code" className="block text-xs text-purple-300 uppercase tracking-widest">
              Introduce tu Código de Acceso del Búnker
            </label>
            <input
              id="bunker-code"
              type="text"
              value={accessCode}
              onChange={(event) => setAccessCode(event.target.value)}
              className="w-full border border-purple-600/50 bg-black px-3 py-2 text-sm text-purple-100 outline-none focus:border-purple-400"
              autoComplete="off"
            />
            <button
              type="submit"
              className="px-4 py-2 border border-purple-500 text-purple-300 text-xs uppercase tracking-wider hover:bg-purple-800/20 transition-colors"
            >
              Validar acceso
            </button>
          </form>
        )}

        {accessMessage && <p className="mb-4 text-xs text-purple-300">{accessMessage}</p>}

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
