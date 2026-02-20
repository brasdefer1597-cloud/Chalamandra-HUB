import { Project } from '../types';

export const projects: Project[] = [
  {
    id: 'oraculo-chalamandra',
    title: "Oráculo Chalamandra",
    desc: "Interfaz de consulta místico-tecnológica. Procesamiento de lenguaje natural con estética de alta fidelidad.",
    url: "https://brasdefer1597-cloud.github.io/Or-culo-Chalamandra-/",
    tag: "Oracle AI",
    isPro: true,
    status: 'active',
    lastUpdate: '2024-12-15',
    metrics: {
      uptime: 99.8,
      performance: 245,
      users: 1247
    }
  },
  {
    id: 'ajedrez-criminal',
    title: "Ajedrez Criminal",
    desc: "Motor de decisión estratégica potenciado por Gemini 1.5 Flash. Análisis de patrones y lógica de alto nivel.",
    url: "https://estrategia-maestra-ajedrez-criminal.vercel.app/",
    tag: "IA & Strategy",
    isPro: true,
    status: 'active',
    lastUpdate: '2024-12-14',
    metrics: {
      uptime: 99.5,
      performance: 180,
      users: 892
    }
  },
  {
    id: 'srap-realidades',
    title: "SRAP: Realidades Crudas",
    desc: "Sistema de Renderizado de Alta Precisión. Interfaz semántica para el análisis de contextos urbanos complejos.",
    url: "https://replit.com/@chalamandrama/SRAP-Realidades-Crudas",
    tag: "Semantic UI",
    status: 'beta',
    lastUpdate: '2024-12-13',
    metrics: {
      uptime: 97.2,
      performance: 320,
      users: 456
    }
  },
  {
    id: 'chalamandra-magistral',
    title: "Chalamandra Magistral",
    desc: "El núcleo del ecosistema. Historias, metodologías y decodificación de realidades.",
    url: "https://chalamandra-magistral.vercel.app/",
    tag: "Mastermind",
    isPro: true,
    status: 'maintenance',
    lastUpdate: '2024-12-12',
    metrics: {
      uptime: 98.9,
      performance: 156,
      users: 2341
    }
  }
];