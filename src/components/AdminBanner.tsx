import React, { useMemo } from 'react';
import { Shield } from 'lucide-react';

interface AdminBannerProps {
  decodificaciones: number;
  escaneos: number;
  nodosActivos: number;
  topNode: string;
}

const Counter: React.FC<{ label: string; value: number }> = ({ label, value }) => {
  const [display, setDisplay] = React.useState(0);

  React.useEffect(() => {
    let frame = 0;
    const maxFrames = 18;
    const timer = window.setInterval(() => {
      frame += 1;
      setDisplay(Math.round((value * frame) / maxFrames));
      if (frame >= maxFrames) {
        window.clearInterval(timer);
      }
    }, 22);

    return () => window.clearInterval(timer);
  }, [value]);

  return (
    <div className="min-w-24">
      <p className="text-[10px] uppercase tracking-wider text-red-200/80">{label}</p>
      <p className="font-mono text-green-300 text-sm">{display.toLocaleString()}</p>
    </div>
  );
};

export const AdminBanner: React.FC<AdminBannerProps> = ({ decodificaciones, escaneos, nodosActivos, topNode }) => {
  const sparklinePath = useMemo(() => {
    const points = [8, 16, 12, 18, 14, 22, 17, 20, 15, 23, 21, 25];
    return points.map((v, i) => `${i * 14},${32 - v}`).join(' ');
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 border-b border-green-400/30 bg-gradient-to-r from-red-950/90 via-black/95 to-red-950/90 backdrop-blur-md px-4 py-2 md:py-3">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-green-300" />
            <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-green-300">🔑 MODO ADMIN: ACCESO TOTAL</p>
          </div>

          <div className="flex items-center gap-4 overflow-x-auto rounded border border-red-500/30 bg-red-950/40 px-3 py-2">
            <Counter label="Escaneos" value={escaneos} />
            <Counter label="Nodos Activos" value={nodosActivos} />
            <Counter label="Decodificaciones" value={decodificaciones} />
            <svg width="154" height="34" viewBox="0 0 154 34" className="shrink-0">
              <polyline fill="none" stroke="#4ade80" strokeWidth="1.5" points={sparklinePath} />
            </svg>
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-wider text-red-200/80">Nodo de Mayor Atracción</p>
              <p className="text-xs text-green-200">{topNode}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
