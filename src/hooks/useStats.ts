import { useState, useCallback } from 'react';
import { ChalamandraStats } from '../types';

const STATS_STORAGE_KEY = 'chalamandra_stats';

const getInitialStats = (): ChalamandraStats => {
  const stored = localStorage.getItem(STATS_STORAGE_KEY);
  if (stored) {
    const parsed = JSON.parse(stored);
    return {
      escaneos: parsed.escaneos ?? 0,
      nodosActivos: parsed.nodosActivos ?? 128,
      decodificaciones: parsed.decodificaciones ?? 0,
      lastDecodification: parsed.lastDecodification ? new Date(parsed.lastDecodification) : new Date(),
      totalRevenue: parsed.totalRevenue ?? 0,
      clicksByNode: parsed.clicksByNode ?? {}
    };
  }

  return {
    escaneos: 0,
    nodosActivos: 128,
    decodificaciones: 0,
    lastDecodification: new Date(),
    totalRevenue: 0,
    clicksByNode: {}
  };
};

export const useStats = () => {
  const [stats, setStats] = useState<ChalamandraStats>(getInitialStats);

  const persist = useCallback((updater: (prev: ChalamandraStats) => ChalamandraStats) => {
    setStats((prev) => {
      const next = updater(prev);
      localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const registerVisit = useCallback(() => {
    persist((prev) => ({
      ...prev,
      escaneos: prev.escaneos + 1
    }));
  }, [persist]);

  const updateNodosActivos = useCallback((value: number) => {
    persist((prev) => ({
      ...prev,
      nodosActivos: value
    }));
  }, [persist]);

  const trackNodeClick = useCallback((node: string) => {
    persist((prev) => {
      const current = prev.clicksByNode[node] ?? 0;
      return {
        ...prev,
        clicksByNode: {
          ...prev.clicksByNode,
          [node]: current + 1
        }
      };
    });
  }, [persist]);

  const trackDecodification = useCallback(() => {
    persist((prev) => ({
      ...prev,
      decodificaciones: prev.decodificaciones + 1,
      lastDecodification: new Date(),
      totalRevenue: prev.totalRevenue + 47
    }));

    if (window.trackDecoEvent) {
      window.trackDecoEvent('Decodificación_Exitosa', {
        valor: 'Suscripción_PRO',
        nodo: 'Refinería'
      });
    }
  }, [persist]);

  const topNode = Object.entries(stats.clicksByNode).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'Sin datos';

  return {
    stats,
    topNode,
    registerVisit,
    updateNodosActivos,
    trackNodeClick,
    trackDecodification
  };
};
