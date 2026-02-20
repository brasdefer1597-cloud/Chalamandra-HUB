import React, { useState } from 'react';
import { Crown, Sparkles, ExternalLink } from 'lucide-react';
import { useStats } from '../hooks/useStats';

interface PremiumButtonProps {
  variant?: 'default' | 'cta' | 'minimal';
  size?: 'sm' | 'md' | 'lg';
}

export const PremiumButton: React.FC<PremiumButtonProps> = ({ 
  variant = 'cta', 
  size = 'md' 
}) => {
  const [isFlashing, setIsFlashing] = useState(false);
  const { trackDecodification } = useStats();

  const handleUpgradeClick = () => {
    // Activar destello dorado (Alquimia Malandra)
    setIsFlashing(true);
    setTimeout(() => setIsFlashing(false), 600);

    // Tracking de decodificación
    trackDecodification();

    // Abrir Ko-fi en nueva pestaña
    window.open('#', '_blank', 'noopener,noreferrer');
  };

  const variants = {
    default: 'bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border-yellow-500/40 text-yellow-400 hover:from-yellow-500/30 hover:to-orange-500/30',
    cta: 'bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-purple-500/40 text-purple-400 hover:from-purple-500/30 hover:to-pink-500/30',
    minimal: 'bg-transparent border-gray-600/40 text-gray-400 hover:border-yellow-500/40 hover:text-yellow-400'
  };

  const sizes = {
    sm: 'px-3 py-2 text-xs',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base'
  };

  return (
    <button
      onClick={handleUpgradeClick}
      className={`
        relative inline-flex items-center gap-2 border rounded-lg font-bold uppercase tracking-wider
        transition-all duration-300 active:scale-95 group overflow-hidden
        ${variants[variant]} ${sizes[size]}
        ${isFlashing ? 'animate-pulse' : ''}
      `}
    >
      {/* Destello dorado de Alquimia Malandra */}
      {isFlashing && (
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/50 via-orange-400/50 to-yellow-400/50 animate-ping"></div>
      )}
      
      {/* Efecto de brillo permanente */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
      
      <Crown className="w-4 h-4 relative z-10" />
      <span className="relative z-10">Upgrade to Pro</span>
      <ExternalLink className="w-3 h-3 relative z-10 group-hover:translate-x-1 transition-transform" />
      
      {/* Partículas de alquimia */}
      {isFlashing && (
        <>
          <Sparkles className="absolute top-0 left-0 w-2 h-2 text-yellow-400 animate-bounce" />
          <Sparkles className="absolute top-0 right-0 w-2 h-2 text-orange-400 animate-bounce delay-100" />
          <Sparkles className="absolute bottom-0 left-1/2 w-2 h-2 text-yellow-400 animate-bounce delay-200" />
        </>
      )}
    </button>
  );
};