import React from 'react';

const HUB_URL = 'https://chalamandra-hub.vercel.app';

interface EcosystemHeaderProps {
  isAdmin: boolean;
}

export const EcosystemHeader: React.FC<EcosystemHeaderProps> = ({ isAdmin }) => {
  return (
    <div className="fixed top-0 left-0 right-0 z-[60] border-b border-white/10 bg-black/95 px-4 py-2 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <img src="/salamandra.svg" alt="Logo Salamandra" className="h-6 w-6" loading="lazy" />
          <span className="text-xs uppercase tracking-[0.2em] text-gray-300">Ecosistema Chalamandra</span>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={HUB_URL}
            className="rounded-full border border-white/20 px-3 py-1 text-[11px] text-gray-200 transition hover:border-green-400/40 hover:text-green-300"
          >
            ← Volver al Hub Central
          </a>
          {isAdmin && (
            <span className="rounded-full border border-green-500/40 bg-green-500/10 px-2 py-1 text-[10px] uppercase tracking-wider text-green-300">
              Acceso: Nivel 1% (PRO)
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
