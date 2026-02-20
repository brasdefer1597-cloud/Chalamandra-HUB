import { useEffect, useState } from 'react';
import { Terminal, Cpu, Database } from 'lucide-react';
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

function App() {
  const [isAdmin, setIsAdmin] = useState(false);
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
    const timer = window.setInterval(() => {
      const next = 120 + Math.floor(Math.random() * 60);
      updateNodosActivos(next);
    }, 4000);

    return () => window.clearInterval(timer);
  }, [updateNodosActivos]);

  const handleUpgrade = (project: Project) => {
    trackDecodification();
    trackNodeClick(project.title);
    window.open('#', '_blank', 'noopener,noreferrer');
  };

  const path = window.location.pathname;
  if (path === '/nodo-srap' || path === '/srap') {
    return <SrapBridgePage />;
  }

  return (
    <div className={`min-h-screen bg-black px-6 pb-8 text-gray-100 transition-all duration-300 md:px-8 ${isAdmin ? 'pt-44 md:pt-36' : 'pt-20'}`}>
      <EcosystemHeader isAdmin={isAdmin} />

      {isAdmin && (
        <AdminBanner
          decodificaciones={stats.decodificaciones}
          escaneos={stats.escaneos}
          nodosActivos={stats.nodosActivos}
          topNode={topNode}
        />
      )}

      <div className="mx-auto mb-4 flex max-w-5xl items-center justify-between">
        <div className="flex items-center gap-2 rounded-full border border-green-900 bg-green-950/20 px-3 py-1">
          <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
          <span className="text-[10px] uppercase tracking-widest text-green-500">All Systems Operational</span>
        </div>

        <div className="flex items-center gap-2 text-[10px] text-gray-500">
          <Terminal className="h-3 w-3" />
          <span>v2.3.0</span>
        </div>
      </div>

      <header className="relative mx-auto mb-16 max-w-5xl border-l-4 border-blue-600 py-2 pl-8">
        <h1 className="text-5xl font-black tracking-tighter text-white md:text-6xl">CHALAMANDRA</h1>
        <div className="mt-2 flex items-center justify-between">
          <p className="text-xs uppercase tracking-[0.3em] text-blue-500">Ecosistema de Ingeniería</p>
          <div className="flex items-center gap-4 text-[10px] text-gray-600">
            <div className="flex items-center gap-1">
              <Cpu className="h-3 w-3" />
              <span>CPU: 23%</span>
            </div>
            <div className="flex items-center gap-1">
              <Database className="h-3 w-3" />
              <span>RAM: 1.2GB</span>
            </div>
          </div>
        </div>
      </header>

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
          />
        ))}
      </main>

      <footer className="mx-auto mt-20 max-w-5xl border-t border-gray-900 pt-8 text-center">
        <div className="mb-4 flex items-center justify-center gap-8">
          <div className="text-[10px] text-gray-600"><span className="text-gray-500">PUDIN ACTIVATIONS:</span> {pudinState.totalActivations}</div>
          <div className="text-[10px] text-gray-600"><span className="text-gray-500">DECODIFICACIONES:</span> {stats.decodificaciones}</div>
          <div className="text-[10px] text-gray-600"><span className="text-gray-500">UPTIME:</span> 99.7%</div>
        </div>
        <p className="text-[10px] uppercase tracking-[0.5em] text-gray-600">Construido en el borde del hardware</p>
      </footer>

      <PudinButton />
    </div>
  );
}

export default App;
