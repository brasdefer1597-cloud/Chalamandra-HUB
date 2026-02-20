import React from 'react';
import { ExternalLink, Activity, Users, Zap } from 'lucide-react';
import { Project } from '../types';
import { ProBadge } from './ProBadge';

interface ProjectCardProps {
  project: Project;
  index: number;
  pudinIntensity: number;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, index, pudinIntensity }) => {
  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'active': return 'text-green-400 border-green-600/20 bg-green-600/10';
      case 'maintenance': return 'text-yellow-400 border-yellow-600/20 bg-yellow-600/10';
      case 'beta': return 'text-blue-400 border-blue-600/20 bg-blue-600/10';
    }
  };

  const getStatusText = (status: Project['status']) => {
    switch (status) {
      case 'active': return 'OPERATIONAL';
      case 'maintenance': return 'MAINTENANCE';
      case 'beta': return 'BETA';
    }
  };

  const pudinEffect = pudinIntensity > 0 ? {
    transform: `scale(${1 + (pudinIntensity * 0.02)})`,
    filter: `hue-rotate(${pudinIntensity * 30}deg) saturate(${1 + (pudinIntensity * 0.2)})`
  } : {};

  return (
    <div 
      className="group relative border border-gray-900 p-8 hover:border-blue-600/50 transition-all duration-500 bg-gradient-to-br from-black to-gray-950"
      style={pudinEffect}
    >
      {/* Número de proyecto */}
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
        <span className="text-4xl font-black text-blue-900">0{index + 1}</span>
      </div>

      {/* Header con badges */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className={`text-[10px] px-3 py-1 rounded-sm uppercase font-bold tracking-widest border ${getStatusColor(project.status)}`}>
            {getStatusText(project.status)}
          </span>
          {project.isPro && <ProBadge size="sm" variant="premium" />}
        </div>
        
        <span className="text-[10px] bg-blue-600/10 text-blue-400 border border-blue-600/20 px-3 py-1 rounded-sm uppercase font-bold tracking-widest">
          {project.tag}
        </span>
      </div>

      {/* Título */}
      <h2 className="text-3xl font-bold mt-6 mb-3 group-hover:text-blue-400 transition-colors">
        {project.title}
      </h2>

      {/* Descripción */}
      <p className="text-gray-500 text-sm leading-relaxed mb-6 max-w-sm">
        {project.desc}
      </p>

      {/* Métricas */}
      <div className="grid grid-cols-3 gap-4 mb-8 p-4 bg-gray-950/50 border border-gray-800 rounded">
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <Activity className="w-3 h-3 text-green-400" />
          </div>
          <div className="text-xs text-gray-400">Uptime</div>
          <div className="text-sm font-bold text-green-400">{project.metrics.uptime}%</div>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <Zap className="w-3 h-3 text-yellow-400" />
          </div>
          <div className="text-xs text-gray-400">Perf</div>
          <div className="text-sm font-bold text-yellow-400">{project.metrics.performance}ms</div>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center mb-1">
            <Users className="w-3 h-3 text-blue-400" />
          </div>
          <div className="text-xs text-gray-400">Users</div>
          <div className="text-sm font-bold text-blue-400">{project.metrics.users.toLocaleString()}</div>
        </div>
      </div>

      {/* Botón de acceso */}
      <a
        href={project.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 bg-transparent border border-white/20 px-8 py-3 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all duration-300 active:scale-95 group/btn"
      >
        Launch_System
        <ExternalLink className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
      </a>

      {/* Última actualización */}
      <div className="absolute bottom-2 left-4 text-[8px] text-gray-600 font-mono">
        Updated: {project.lastUpdate}
      </div>
    </div>
  );
};