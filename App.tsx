
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { PROJECTS } from './constants';
import Folder from './components/Folder';
import { ShieldAlert, Clock, Activity, X, ArrowLeft, Terminal, Cpu } from 'lucide-react';
import Noise from './components/Noise';
import { motion, AnimatePresence } from 'framer-motion';

const SCATTER_POSITIONS = [
  { x: '-22vw', y: '-12vh', rotation: -6 },
  { x: '18vw', y: '-15vh', rotation: 5 },
  { x: '-16vw', y: '16vh', rotation: 7 },
  { x: '20vw', y: '10vh', rotation: -4 },
  { x: '2vw', y: '6vh', rotation: -2 },
];

const App: React.FC = () => {
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
  const [time, setTime] = useState(new Date());
  const [systemLog, setSystemLog] = useState("INITIALIZING_SUBSYSTEMS...");
  const lastScrollTime = useRef(0);
  const SCROLL_COOLDOWN = 900;

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    const logInterval = setInterval(() => {
      const logs = [
        "FETCHING_ARCHIVE_DATA...",
        "DECRYPTING_SECTOR_09...",
        "BUFFERING_VISUAL_ASSETS...",
        "SYSTEM_NOMINAL_100%",
        "ENCRYPTED_HANDSHAKE_OK",
        "UPDATING_RECORD_INDEX...",
        "SCANNING_PHYSICAL_MEDIA..."
      ];
      setSystemLog(logs[Math.floor(Math.random() * logs.length)]);
    }, 4000);
    return () => {
      clearInterval(timer);
      clearInterval(logInterval);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (fullscreenImage) return;
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') navigate(1);
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') navigate(-1);
      if (e.key === 'Escape') setActiveProjectId(null);
    };

    const handleWheel = (e: WheelEvent) => {
      if (fullscreenImage || activeProjectId) return;
      const now = Date.now();
      if (Math.abs(e.deltaY) < 40) return;
      if (now - lastScrollTime.current < SCROLL_COOLDOWN) return;
      lastScrollTime.current = now;
      navigate(e.deltaY > 0 ? 1 : -1);
    };

    const navigate = (direction: number) => {
      setActiveProjectId(currentId => {
        if (!currentId) return direction > 0 ? PROJECTS[0].id : PROJECTS[PROJECTS.length - 1].id;
        const currentIndex = PROJECTS.findIndex(p => p.id === currentId);
        let nextIndex = currentIndex + direction;
        if (nextIndex >= PROJECTS.length) nextIndex = 0;
        if (nextIndex < 0) nextIndex = PROJECTS.length - 1;
        return PROJECTS[nextIndex].id;
      });
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [fullscreenImage, activeProjectId]);

  const handleFolderClick = (id: string) => {
    if (activeProjectId === id) {
      setActiveProjectId(null);
    } else {
      setActiveProjectId(id);
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden relative selection:bg-industrial-orange selection:text-white studio-bg vignette perspective-1000">
      <Noise opacity={0.06} />
      
      {/* CRT SCANLINE EFFECT */}
      <div className="fixed inset-0 pointer-events-none z-[1000] opacity-[0.03] overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
      </div>

      {/* 1. WORKSTATION HEADER */}
      <header className="shrink-0 z-[100] bg-paper-200/80 backdrop-blur-md border-b-4 border-paper-900/10">
        <div className="max-w-[1800px] mx-auto px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-12">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-industrial-orange rounded-full animate-ping" />
                <h1 className="font-display font-black text-3xl tracking-tighter uppercase text-paper-900 leading-none">Archival_OS</h1>
              </div>
              <span className="font-mono text-[9px] opacity-40 font-black tracking-[0.3em]">VERSION_4.2.0_STABLE</span>
            </div>
            
            <div className="hidden lg:flex items-center gap-6 px-6 py-2 bg-black/5 border-l border-r border-black/10">
              <div className="flex flex-col gap-1">
                <span className="font-mono text-[8px] opacity-40 font-bold uppercase">Processor_Load</span>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                    <div key={i} className={`w-1.5 h-3 ${i < 4 ? 'bg-industrial-blue' : 'bg-black/10'}`} />
                  ))}
                </div>
              </div>
              <div className="h-8 w-px bg-black/10" />
              <div className="flex flex-col gap-1">
                <span className="font-mono text-[8px] opacity-40 font-bold uppercase">Net_Traffic</span>
                <div className="flex items-end gap-0.5 h-3">
                   {[40, 70, 30, 90, 20].map((h, i) => (
                     <div key={i} className="w-1 bg-industrial-orange" style={{ height: `${h}%` }} />
                   ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-12 font-mono">
            <div className="flex flex-col items-end">
              <div className="flex items-center gap-3">
                <Clock size={14} className="opacity-30" />
                <span className="text-xs font-black tracking-[0.2em] text-paper-900">
                  {time.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
              </div>
              <span className="text-[9px] opacity-40 font-bold tracking-widest">{time.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()}</span>
            </div>
            <div className="w-10 h-10 bg-paper-900 text-white flex items-center justify-center rounded-sm shadow-inner">
               <Cpu size={20} />
            </div>
          </div>
        </div>
      </header>

      {/* 2. MAIN WORKSPACE */}
      <main className="flex-grow relative overflow-hidden z-10">
        <div className="absolute inset-0 micro-grid opacity-30 pointer-events-none" />
        
        <div className="h-full w-full relative">
          <div className="max-w-[1600px] mx-auto w-full h-full relative">
              {PROJECTS.map((project, index) => {
                const scatter = SCATTER_POSITIONS[index % SCATTER_POSITIONS.length];
                return (
                  <Folder 
                    key={project.id}
                    project={project}
                    isActive={activeProjectId === project.id}
                    index={index}
                    total={PROJECTS.length}
                    onClick={() => handleFolderClick(project.id)}
                    onImageClick={(url) => setFullscreenImage(url)}
                    scatter={scatter}
                  />
                );
              })}
          </div>
        </div>

        {/* LIGHTBOX */}
        <AnimatePresence>
          {fullscreenImage && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setFullscreenImage(null)}
              className="fixed inset-0 z-[200] bg-paper-900/60 flex flex-col items-center justify-center p-12 backdrop-blur-[50px] cursor-zoom-out"
            >
              <Noise opacity={0.04} />
              
              <div className="absolute top-10 left-0 right-0 px-12 flex justify-between items-center z-[210] pointer-events-none">
                <button 
                  onClick={(e) => { e.stopPropagation(); setFullscreenImage(null); }}
                  className="flex items-center gap-4 px-6 py-3 bg-paper-100 hover:bg-white border-2 border-paper-900 text-paper-900 font-mono text-[10px] font-black uppercase tracking-[0.3em] pointer-events-auto transition-all group"
                >
                  <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                  EXIT_FULL_VIEW
                </button>
                <div className="flex items-center gap-3 text-white font-mono text-[10px] uppercase font-black tracking-widest">
                  <span className="px-2 py-1 bg-industrial-orange">ASSET_RAW_V01</span>
                  <span className="opacity-40">4K_UPSCALED</span>
                </div>
              </div>

              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full h-full flex items-center justify-center"
              >
                <img 
                  src={fullscreenImage} 
                  className="max-w-[85%] max-h-[85%] object-contain shadow-[0_80px_160px_rgba(0,0,0,0.6)] border-4 border-white/20"
                  alt="Archive Expanded"
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* 3. TERMINAL FOOTER */}
      <footer className="shrink-0 h-10 bg-paper-900 text-paper-200 border-t-2 border-white/5 px-8 flex items-center justify-between z-[110]">
          <div className="flex gap-8 items-center h-full">
            <div className="flex items-center gap-3 px-3 py-1 bg-white/10 rounded-sm">
               <Terminal size={14} className="text-industrial-orange" />
               <span className="font-mono text-[9px] font-black uppercase tracking-widest">{systemLog}</span>
            </div>
            <span className="hidden md:block font-mono text-[9px] opacity-40 uppercase tracking-[0.2em]">Active_Nodes: 12</span>
          </div>
          <div className="flex gap-8 items-center">
            <span className="text-[9px] font-mono font-black uppercase tracking-[0.5em] opacity-30">© 2024_SYSTEM_ARCHIVE</span>
            <div className="flex gap-1.5 h-3 items-center">
              {[1, 2, 3].map(i => (
                <div key={i} className={`w-3 h-1.5 ${i === 3 ? 'bg-industrial-orange' : 'bg-white/20'}`} />
              ))}
            </div>
          </div>
      </footer>
    </div>
  );
};

export default App;
