import React, { useEffect } from 'react';

const SRAP_URL = 'https://replit.com/@chalamandrama/SRAP-Realidades-Crudas';

export const SrapBridgePage: React.FC = () => {
  useEffect(() => {
    const timer = window.setTimeout(() => {
      window.location.href = SRAP_URL;
    }, 2000);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-6 text-green-300">
      <div className="w-full max-w-2xl rounded-lg border border-green-500/30 bg-black/80 p-6 font-mono shadow-[0_0_30px_rgba(34,197,94,.15)]">
        <p className="mb-2 text-xs uppercase tracking-[0.2em] text-green-400">Nodo SRAP</p>
        <p className="text-lg">Estableciendo conexión encriptada con el motor SRAP...</p>
        <p className="mt-3 animate-pulse text-sm text-green-500">Estableciendo enlace con el Nodo Operativo SRAP...</p>
      </div>
    </div>
  );
};
