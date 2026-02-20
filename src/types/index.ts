export interface Project {
  id: string;
  title: string;
  desc: string;
  url: string;
  tag: string;
  isPro?: boolean;
  status: 'active' | 'maintenance' | 'beta';
  lastUpdate: string;
  metrics: {
    uptime: number;
    performance: number;
    users: number;
  };
}

export interface User {
  id: string;
  name: string;
  role: 'admin' | 'user' | 'pro';
  avatar?: string;
}

export interface PudinState {
  isActive: boolean;
  intensity: number;
  lastActivation: Date;
  totalActivations: number;
}

export interface ChalamandraStats {
  escaneos: number;
  nodosActivos: number;
  decodificaciones: number;
  lastDecodification: Date;
  totalRevenue: number;
  clicksByNode: Record<string, number>;
}

export interface TrackEventPayload {
  valor: string;
  nodo: string;
}

declare global {
  interface Window {
    trackDecoEvent: (event: string, data: TrackEventPayload) => void;
    chalamandra?: {
      isPudinActive: () => boolean;
    };
  }
}
