import React from 'react';
import { Crown, Zap } from 'lucide-react';

interface ProBadgeProps {
  variant?: 'default' | 'premium' | 'elite';
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

export const ProBadge: React.FC<ProBadgeProps> = ({ 
  variant = 'default', 
  size = 'md',
  animated = true 
}) => {
  const variants = {
    default: {
      bg: 'bg-gradient-to-r from-yellow-600/20 to-orange-600/20',
      border: 'border-yellow-500/40',
      text: 'text-yellow-400',
      icon: Crown
    },
    premium: {
      bg: 'bg-gradient-to-r from-purple-600/20 to-pink-600/20',
      border: 'border-purple-500/40',
      text: 'text-purple-400',
      icon: Zap
    },
    elite: {
      bg: 'bg-gradient-to-r from-blue-600/20 to-cyan-600/20',
      border: 'border-blue-500/40',
      text: 'text-blue-400',
      icon: Crown
    }
  };

  const sizes = {
    sm: 'px-2 py-1 text-[8px]',
    md: 'px-3 py-1 text-[10px]',
    lg: 'px-4 py-2 text-xs'
  };

  const iconSizes = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  };

  const config = variants[variant];
  const Icon = config.icon;

  return (
    <div className={`
      inline-flex items-center gap-1 rounded-full border font-bold uppercase tracking-widest
      ${config.bg} ${config.border} ${config.text} ${sizes[size]}
      ${animated ? 'animate-pulse' : ''}
    `}>
      <Icon className={iconSizes[size]} />
      <span>PRO</span>
    </div>
  );
};