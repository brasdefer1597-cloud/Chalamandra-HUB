import React from 'react';

const projects = [
  {
    title: "Ajedrez Criminal",
    desc: "Motor de decisión estratégica potenciado por Gemini 1.5 Flash. Análisis de patrones y lógica de alto nivel.",
    url: "https://estrategia-maestra-ajedrez-criminal.vercel.app/",
    tag: "IA & Strategy"
  },
  {
    title: "SRAP: Realidades Crudas",
    desc: "Sistema de Renderizado de Alta Precisión. Interfaz semántica para el análisis de contextos urbanos complejos.",
    url: "https://replit.com/@chalamandrama/SRAP-Realidades-Crudas",
    tag: "Semantic UI"
  },
  {
    title: "Memoria Delta",
    desc: "Arquitectura de gestión de datos masivos. Optimización de miles de nodos mediante delegación de eventos.",
    url: "#",
    tag: "Performance"
  },
  {
    title: "Quantum Parser",
    desc: "Analizador de flujos de datos en tiempo real con optimización de carga en GPU mediante IntersectionObserver.",
    url: "#",
    tag: "Data Flow"
  },
  {
    title: "Cipher Protocol",
    desc: "Estructura de arquitectura limpia y seguridad de componentes. El estándar de oro de la Chalamandra.",
    url: "#",
    tag: "Architecture"
  },
  {
    title: "Oráculo Chalamandra",
    desc: "Interfaz de consulta místico-tecnológica. Procesamiento de lenguaje natural con estética de alta fidelidad.",
    url: "https://brasdefer1597-cloud.github.io/Or-culo-Chalamandra-/",
    tag: "Oracle AI"
  }
];

function App() {
  return (
    <div className="min-h-screen bg-black text-gray-100 p-8 font-sans selection:bg-blue-500 selection:text-white">
      <div className="max-w-5xl mx-auto flex justify-end mb-4">
        <div className="flex items-center gap-2 px-3 py-1 border border-green-900 bg-green-950/20 rounded-full">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-[10px] font-mono text-green-500 uppercase tracking-widest">All Systems Operational</span>
        </div>
      </div>

      <header className="max-w-5xl mx-auto mb-16 border-l-4 border-blue-600 pl-8 py-2">
        <h1 className="text-6xl font-black tracking-tighter text-white">CHALAMANDRA</h1>
        <p className="text-blue-500 font-mono tracking-[0.3em] uppercase text-xs mt-2">Ecosistema de Ingeniería</p>
      </header>

      <main className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
        {projects.map((p, i) => (
          <div key={i} className="group relative border border-gray-900 p-8 hover:border-blue-600/50 transition-all duration-500 bg-gradient-to-br from-black to-gray-950">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
              <span className="text-4xl font-black text-blue-900">0{i+1}</span>
            </div>

            <span className="text-[10px] bg-blue-600/10 text-blue-400 border border-blue-600/20 px-3 py-1 rounded-sm uppercase font-bold tracking-widest">
              {p.tag}
            </span>

            <h2 className="text-3xl font-bold mt-6 mb-3 group-hover:text-blue-400 transition-colors">
              {p.title}
            </h2>

            <p className="text-gray-500 text-sm leading-relaxed mb-8 max-w-sm">
              {p.desc}
            </p>

            <a
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-transparent border border-white/20 px-8 py-3 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all duration-300 active:scale-95"
            >
              Launch_System
              <span className="text-lg">→</span>
            </a>
          </div>
        ))}
      </main>

      <footer className="max-w-5xl mx-auto mt-20 pt-8 border-t border-gray-900 text-center">
        <p className="text-gray-600 text-[10px] tracking-[0.5em] uppercase">
          Construido en el borde del hardware • 2026
        </p>
      </footer>
    </div>
  );
}

export default App;
