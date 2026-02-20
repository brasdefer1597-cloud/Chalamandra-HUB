import React from 'react';
import { Shield, Settings, Activity } from 'lucide-react';
import { useStats } from '../hooks/useStats';

interface AdminBannerProps {
  isVisible: boolean;
  onToggle: () => void;
}

export const AdminBanner: React.FC<AdminBannerProps> = ({ isVisible, onToggle }) => {
  const { stats } = useStats();

  if (!isVisible) {
    return (
      <button
        onClick={onToggle}
        className="fixed top-4 right-4 z-50 p-2 bg-red-900/20 border border-red-600/30 rounded-full hover:bg-red-900/40 transition-all duration-300"
        title="Mostrar panel de administración"
      >
        <Shield className="w-4 h-4 text-red-400" />
      </button>
    );
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-r from-red-900/90 to-red-800/90 backdrop-blur-sm border-b border-red-600/30 p-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-red-400" />
            <span className="text-red-100 font-mono text-sm font-bold">ADMIN MODE</span>
          </div>
          
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1">
              <Activity className="w-3 h-3 text-green-400" />
              <span className="text-red-200">Sistema Operativo</span>
            </div>
            <div className="text-red-300">
              Decodificaciones: {stats.decodificaciones}
            </div>
            <div className="text-red-300">
              Uptime: 99.7%
            </div>
            <div className="text-red-300">
              Usuarios Activos: 1,247
            </div>
            <div className="text-red-300">
              Revenue: ${stats.totalRevenue}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-1 hover:bg-red-800/50 rounded transition-colors">
            <Settings className="w-4 h-4 text-red-300" />
          </button>
          <button
            onClick={onToggle}
            className="px-3 py-1 bg-red-800/50 hover:bg-red-700/50 border border-red-600/30 rounded text-xs text-red-200 transition-colors"
          >
            Ocultar
          </button>
        </div>
      </div>
    </div>
  );
};