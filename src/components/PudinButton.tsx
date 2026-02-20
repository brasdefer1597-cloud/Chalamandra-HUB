import React from 'react';
import { Sparkles } from 'lucide-react';
import { usePudin } from '../hooks/usePudin';

export const PudinButton: React.FC = () => {
  const { pudinState, activatePudin, canActivate } = usePudin();

  const getIntensityColor = (intensity: number) => {
    switch (intensity) {
      case 0: return 'text-gray-500';
      case 1: return 'text-blue-400';
      case 2: return 'text-green-400';
      case 3: return 'text-yellow-400';
      case 4: return 'text-orange-400';
      case 5: return 'text-red-400';
      default: return 'text-gray-500';
    }
  };

  const getIntensityBg = (intensity: number) => {
    switch (intensity) {
      case 0: return 'bg-gray-900/20';
      case 1: return 'bg-blue-900/20';
      case 2: return 'bg-green-900/20';
      case 3: return 'bg-yellow-900/20';
      case 4: return 'bg-orange-900/20';
      case 5: return 'bg-red-900/20';
      default: return 'bg-gray-900/20';
    }
  };

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <button
        onClick={activatePudin}
        disabled={!canActivate}
        className={`
          group relative p-3 border rounded-full transition-all duration-300
          ${getIntensityBg(pudinState.intensity)}
          ${pudinState.intensity > 0 ? 'border-current' : 'border-gray-700'}
          ${canActivate ? 'hover:scale-110 cursor-pointer' : 'cursor-not-allowed opacity-50'}
          ${pudinState.isActive ? 'animate-bounce' : ''}
        `}
        title={`Pudin Level: ${pudinState.intensity}/5 | Total: ${pudinState.totalActivations}`}
      >
        <Sparkles className={`w-5 h-5 ${getIntensityColor(pudinState.intensity)} transition-colors`} />
        
        {pudinState.intensity > 0 && (
          <div className={`
            absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center
            text-[8px] font-bold ${getIntensityBg(pudinState.intensity)} border border-current
            ${getIntensityColor(pudinState.intensity)}
          `}>
            {pudinState.intensity}
          </div>
        )}

        {pudinState.isActive && (
          <div className="absolute inset-0 rounded-full animate-ping border-2 border-current opacity-75"></div>
        )}
      </button>

      {pudinState.totalActivations > 0 && (
        <div className="mt-2 text-center">
          <div className="text-[8px] text-gray-500 font-mono">
            PUDIN: {pudinState.totalActivations}
          </div>
        </div>
      )}
    </div>
  );
};