import { useState, useEffect, useCallback } from 'react';
import { ChalamandraStats } from '../types';

const STATS_STORAGE_KEY = 'chalamandra_stats';

export const useStats = () => {
  const [stats, setStats] = useState<ChalamandraStats>(() => {
    const stored = localStorage.getItem(STATS_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        ...parsed,
        lastDecodification: new Date(parsed.lastDecodification)
      };
    }
    return {
      decodificaciones: 0,
      lastDecodification: new Date(),
      totalRevenue: 0
    };
  });

  const trackDecodification = useCallback(() => {
    const newStats: ChalamandraStats = {
      decodificaciones: stats.decodificaciones + 1,
      lastDecodification: new Date(),
      totalRevenue: stats.totalRevenue + 47 // Valor simbólico por decodificación
    };

    setStats(newStats);
    localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(newStats));

    // Disparar evento global de tracking
    if (window.trackDecoEvent) {
      window.trackDecoEvent('Decodificación_Exitosa', { 
        valor: 'Suscripción_PRO', 
        nodo: 'Refinería' 
      });
    }
  }, [stats]);

  return {
    stats,
    trackDecodification
  };
};