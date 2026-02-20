import { useState, useCallback } from 'react';
import { PudinState } from '../types';

const PUDIN_STORAGE_KEY = 'chalamandra_pudin_state';
const PUDIN_COOLDOWN = 3000; // 3 segundos

export const usePudin = () => {
  const [pudinState, setPudinState] = useState<PudinState>(() => {
    const stored = localStorage.getItem(PUDIN_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        ...parsed,
        lastActivation: new Date(parsed.lastActivation),
        isActive: false // Siempre inicia inactivo
      };
    }
    return {
      isActive: false,
      intensity: 0,
      lastActivation: new Date(),
      totalActivations: 0
    };
  });

  const activatePudin = useCallback(() => {
    const now = new Date();
    const timeSinceLastActivation = now.getTime() - pudinState.lastActivation.getTime();
    
    if (timeSinceLastActivation < PUDIN_COOLDOWN) {
      return; // Cooldown activo
    }

    const newIntensity = Math.min(pudinState.intensity + 1, 5);
    const newState: PudinState = {
      isActive: true,
      intensity: newIntensity,
      lastActivation: now,
      totalActivations: pudinState.totalActivations + 1
    };

    setPudinState(newState);
    localStorage.setItem(PUDIN_STORAGE_KEY, JSON.stringify(newState));

    // Auto-desactivar después de 2 segundos
    setTimeout(() => {
      setPudinState(prev => ({ ...prev, isActive: false }));
    }, 2000);
  }, [pudinState]);

  const resetPudin = useCallback(() => {
    const resetState: PudinState = {
      isActive: false,
      intensity: 0,
      lastActivation: new Date(),
      totalActivations: 0
    };
    setPudinState(resetState);
    localStorage.removeItem(PUDIN_STORAGE_KEY);
  }, []);

  return {
    pudinState,
    activatePudin,
    resetPudin,
    canActivate: Date.now() - pudinState.lastActivation.getTime() >= PUDIN_COOLDOWN
  };
};