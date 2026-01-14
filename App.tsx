
import React, { useState, useEffect, useRef } from 'react';
import { PROJECTS } from './constants';
import Folder from './components/Folder';
import { ShieldAlert, Clock, Activity, X, ArrowLeft } from 'lucide-react';
import Noise from './components/Noise';
import { motion, AnimatePresence } from 'framer-motion';

const SCATTER_POSITIONS = [
  { x: '-20vw', y: '-10vh', rotation: -5 },
  { x: '16vw', y: '-14vh', rotation: 4 },
  { x: '-15vw', y: '14vh', rotation: 6 },
  { x: '18vw', y: '12vh', rotation: -3 },
  { x: '3vw', y: '5vh', rotation: -2 },
];

const App: React.FC = () => {
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
  const [time, setTime] = useState(new Date());
  const lastScrollTime = useRef(0);
  const SCROLL_COOLDOWN = 800;

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (fullscreenImage) return;
      const now = Date.now();
      if (Math.abs(e.deltaY) < 30) return;
      if (now - lastScrollTime.current < SCROLL_COOLDOWN) return;

      lastScrollTime.current = now;
      const direction = e.deltaY > 0 ? 1 : -1;

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
    return () => window.removeEventListener('wheel', handleWheel);
  }, [fullscreenImage]);

  const handleClose = () => setActiveProjectId(null);

  const handleFolderClick = (id: string) => {
    if (activeProjectId === id) {
      handleClose();
    } else {
      setActiveProjectId(id);
    }
  };

  const closeFullscreen = () => setFullscreenImage(null);

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden relative selection:bg-industrial-orange selection:text-white studio-bg vignette">
      <Noise opacity={0.08} />
      
      {/* 1. HEADER */}
      <header className="shrink-0 z-[100] bg-paper-400/60 backdrop-blur-xl border-b border-paper-900/10">
        <div className="max-w-[1600px] mx-auto px-10 h-24 flex items-center justify-between">
          <div className="flex items-center gap-10">
            <div className="flex flex-col">
              <h1 className="font-display font-black text-4xl tracking-tighter uppercase leading-none text-paper-900">Portfolio</h1>
            </div>
            <div className="hidden md:flex items-center gap-4 px-5 py-2 bg-paper-900/5 border border-paper-900/5 rounded-sm">
              <Activity size={14} className="text-industrial-orange animate-pulse" />
              <span className="font-mono text-[11px] font-black tracking-widest opacity-90 uppercase text-paper-800">SYSTEM_NOMINAL</span>
            </div>
          </div>

          <div className="flex-1" />

          <div className="flex items-center gap-10 font-mono">
            <div className="flex flex-col items-end">
              <div className="flex items-center gap-3">
                <Clock size={16} className="opacity-30" />
                <span className="text-sm font-black tracking-[0.2em] text-paper-900">
                  {time.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
              </div>
              <span className="text-[9px] opacity-40 uppercase tracking-tighter font-bold">47.6062° N, 122.3321° W</span>
            </div>
            <div className="w-12 h-12 bg-industrial-orange flex items-center justify-center text-white rounded-sm shadow-xl shadow-industrial-orange/20 ring-1 ring-white/10">
               <ShieldAlert size={26} />
            </div>
          </div>
        </div>
      </header>

      {/* 2. MAIN CANVAS */}
      <main className="flex-grow relative overflow-hidden z-10">
        <div className="absolute inset-0 micro-grid opacity-80 pointer-events-none" />
        
        <div className="h-full w-full relative overflow-hidden">
          <div className="max-w-[1600px] mx-auto w-full h-full relative">
            <div className="w-full h-full relative">
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
        </div>

        {/* LIGHTBOX / FULLSCREEN IMAGE */}
        <AnimatePresence>
          {fullscreenImage && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeFullscreen}
              /* Increased background darkening and backdrop-blur to match ref 2 blur effect while staying on brand */
              className="fixed inset-0 z-[200] bg-paper-900/40 flex flex-col items-center justify-center p-12 backdrop-blur-[40px] cursor-zoom-out"
            >
              <Noise opacity={0.05} />
              
              {/* Top Controls Overlay */}
              <div className="absolute top-10 left-0 right-0 px-12 flex justify-between items-center z-[210] pointer-events-none">
                <button 
                  onClick={(e) => { e.stopPropagation(); closeFullscreen(); }}
                  /* Text color maintained as #121212 as per previous requirement, but on a clear translucent pill */
                  className="flex items-center gap-4 px-6 py-3 bg-paper-100/80 hover:bg-paper-100 border border-black/10 text-[#121212] font-mono text-[11px] uppercase tracking-[0.3em] backdrop-blur-xl pointer-events-auto transition-all group rounded-sm ring-1 ring-black/5"
                >
                  <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                  RETURN_TO_ARCHIVE
                </button>
                
                <div className="flex items-center gap-10">
                  <div className="hidden sm:flex flex-col items-end text-[#121212]/50 font-mono text-[9px] uppercase tracking-[0.3em] font-bold">
                    <span>ASSET_EXPANDED</span>
                    <span>RESOLUTION_OPTIMIZED</span>
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); closeFullscreen(); }}
                    className="text-[#121212]/30 hover:text-[#121212] p-3 transition-colors pointer-events-auto"
                  >
                    <X size={32} />
                  </button>
                </div>
              </div>

              {/* Main Expanded Image Container */}
              <motion.div 
                initial={{ scale: 0.98, opacity: 0, y: 10 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.98, opacity: 0, y: 10 }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-[90vw] h-[75vh] flex items-center justify-center cursor-default"
              >
                <img 
                  src={fullscreenImage} 
                  /* Stronger shadow to make the crisp image pop against the heavily blurred background */
                  className="max-w-full max-h-full object-contain shadow-[0_50px_120px_rgba(0,0,0,0.4)] border border-white/10"
                  alt="Fullscreen Archive"
                />
                
                {/* 
                  FOOTER TEXTS REMOVED: 
                  As requested, the ENCRYPTED_DATA_LINK and ASSET_ENLARGER texts are gone 
                */}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* 3. FOOTER */}
      <footer className="shrink-0 h-12 bg-paper-400/80 backdrop-blur-xl border-t border-paper-900/10 px-10 flex items-center justify-between z-[110] text-[10px] font-mono uppercase tracking-[0.4em] text-paper-800 font-black">
          <div className="flex gap-12">
            <span className="opacity-60">TOTAL_RECORDS: {PROJECTS.length}</span>
            <span className="opacity-60">Uptime: 99.99%</span>
          </div>
          <div className="flex gap-6 items-center">
            <span className="opacity-40 tracking-normal font-sans font-bold">© 2024_DESIGN_ARCHIVE_OS</span>
            <div className="flex gap-1.5">
              <div className="w-2 h-2 bg-paper-900/10" />
              <div className="w-2 h-2 bg-paper-900/40" />
              <div className="w-2 h-2 bg-industrial-orange" />
            </div>
          </div>
      </footer>
    </div>
  );
};

export default App;
