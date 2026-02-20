import React, { useMemo, useState } from 'react';
import { ExternalLink, Activity, Users, Zap, Lock, Sparkles } from 'lucide-react';
import { Project } from '../types';

interface ProjectCardProps {
  project: Project;
  index: number;
  pudinIntensity: number;
  isAdmin: boolean;
  onUpgrade: (project: Project) => void;
  onNodeClick: (node: string) => void;
  isDegraded?: boolean;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  index,
  pudinIntensity,
  isAdmin,
  onUpgrade,
  onNodeClick,
  isDegraded = false
}) => {
  const [isFlashing, setIsFlashing] = useState(false);

  const oraclePenalty = useMemo(() => {
    if (project.id !== 'oraculo-chalamandra') return null;
    const until = Number(localStorage.getItem('oraculo_lock_until') ?? 0);
    if (!until || Number.isNaN(until) || Date.now() > until) return null;
    const remaining = Math.ceil((until - Date.now()) / 60_000);
    return Math.max(1, remaining);
  }, [project.id]);

  const isLocked = Boolean(isDegraded || (project.isPro && !isAdmin) || oraclePenalty);
  const isInternalRoute = project.url.startsWith('/');

  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'active': return 'text-green-400 border-green-600/20 bg-green-600/10';
      case 'maintenance': return 'text-yellow-400 border-yellow-600/20 bg-yellow-600/10';
      case 'beta': return 'text-blue-400 border-blue-600/20 bg-blue-600/10';
      default: return 'text-gray-400 border-gray-600/20 bg-gray-600/10';
    }
  };

  const pudinEffect = pudinIntensity > 0
    ? {
        transform: `scale(${1 + (pudinIntensity * 0.02)})`,
        filter: `hue-rotate(${pudinIntensity * 30}deg) saturate(${1 + (pudinIntensity * 0.2)})`
      }
    : {};

  return (
    <div
      className="group relative rounded-lg border border-gray-900 bg-gradient-to-br from-black to-gray-950 p-8 transition-all duration-500 hover:border-blue-600/50"
      style={pudinEffect}
    >
      {project.isPro && (
        <span className="absolute right-3 top-3 rounded-full border border-white/20 bg-gradient-to-r from-purple-600 to-blue-600 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-lg">
          PREMIUM
        </span>
      )}

      <div className="absolute right-0 top-0 p-4 opacity-10 transition-opacity group-hover:opacity-100">
        <span className="text-4xl font-black text-blue-900">0{index + 1}</span>
      </div>

      <div className="mb-4 flex items-center justify-between">
        <span className={`rounded-sm border px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${getStatusColor(project.status)}`}>
          {project.status}
        </span>

        <span className="rounded-sm border border-blue-600/20 bg-blue-600/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-blue-400">
          {project.tag}
        </span>
      </div>

      <h2 className="mb-3 mt-6 text-3xl font-bold transition-colors group-hover:text-blue-400">{project.title}</h2>
      <p className="mb-6 max-w-sm text-sm leading-relaxed text-gray-500">{project.desc}</p>

      <div className="mb-8 grid grid-cols-3 gap-4 rounded border border-gray-800 bg-gray-950/50 p-4">
        <div className="text-center">
          <Activity className="mx-auto mb-1 h-3 w-3 text-green-400" />
          <div className="text-xs text-gray-400">Uptime</div>
          <div className="text-sm font-bold text-green-400">{project.metrics.uptime}%</div>
        </div>
        <div className="text-center">
          <Zap className="mx-auto mb-1 h-3 w-3 text-yellow-400" />
          <div className="text-xs text-gray-400">Perf</div>
          <div className="text-sm font-bold text-yellow-400">{project.metrics.performance}ms</div>
        </div>
        <div className="text-center">
          <Users className="mx-auto mb-1 h-3 w-3 text-blue-400" />
          <div className="text-xs text-gray-400">Users</div>
          <div className="text-sm font-bold text-blue-400">{project.metrics.users.toLocaleString()}</div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <a
          href={project.url}
          target={isInternalRoute ? undefined : '_blank'}
          rel={isInternalRoute ? undefined : 'noopener noreferrer'}
          title={isLocked ? 'Nodo bloqueado por seguridad' : 'Launch System'}
          onClick={(event) => {
            onNodeClick(project.title);
            if (isLocked) event.preventDefault();
          }}
          className={`inline-flex items-center justify-center gap-2 rounded border px-8 py-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${
            isLocked
              ? 'cursor-not-allowed border-gray-700 bg-gray-900 text-gray-500 opacity-40'
              : 'border-white/20 bg-transparent hover:bg-white hover:text-black active:scale-95'
          }`}
        >
          {isLocked ? (
            <>
              <Lock className="h-3 w-3" /> {isDegraded ? 'Modo degradado (HUB offline)' : oraclePenalty ? `Oráculo bloqueado (${oraclePenalty}m)` : 'Locked (Requires Pro)'}
            </>
          ) : (
            <>
              Launch System
              <ExternalLink className="h-3 w-3 transition-transform group-hover:translate-x-1" />
            </>
          )}
        </a>

        {!isAdmin && (
          <button
            onClick={() => {
              setIsFlashing(true);
              setTimeout(() => setIsFlashing(false), 500);
              onNodeClick(project.title);
              onUpgrade(project);
            }}
            className={`relative inline-flex items-center justify-center gap-2 overflow-hidden rounded border border-purple-500/60 bg-transparent px-8 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-purple-300 transition-all duration-300 hover:border-blue-400 hover:text-blue-300 ${
              isFlashing ? 'shadow-[0_0_25px_rgba(251,191,36,0.75)]' : 'shadow-[0_0_12px_rgba(147,51,234,0.35)]'
            }`}
          >
            {isFlashing && <span className="absolute inset-0 animate-pulse bg-gradient-to-r from-yellow-400/40 via-amber-300/40 to-yellow-400/40" />}
            <Sparkles className="z-10 h-3 w-3" />
            <span className="z-10">Upgrade to Pro</span>
          </button>
        )}
      </div>

      <div className="absolute bottom-2 left-4 text-[8px] font-mono text-gray-600">Updated: {project.lastUpdate}</div>
    </div>
  );
};
