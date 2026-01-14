
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Paperclip, ScanLine, Grip, Fingerprint, X, ShieldCheck, Database } from 'lucide-react';
import { Project } from '../types';
import Noise from './Noise';
import DataViz from './DataViz';

interface FolderProps {
  project: Project;
  isActive: boolean;
  index: number;
  total: number;
  onClick: () => void;
  onImageClick?: (url: string) => void;
  scatter: {
    x: string | number;
    y: string | number;
    rotation: number;
  };
}

const Folder: React.FC<FolderProps> = ({ project, isActive, index, total, onClick, onImageClick, scatter }) => {
  const isDark = project.color === '#2C2B29';
  const textColor = isDark ? 'text-white' : 'text-paper-900';
  const borderColor = isDark ? 'border-white/20' : 'border-paper-900/30';
  const mutedTextColor = isDark ? 'text-white/40' : 'text-paper-900/40';

  const restingDimensions = useMemo(() => {
    const baseHeight = 560;
    const minWidth = 460;
    const maxWidth = 750;
    let width = baseHeight * project.aspectRatio;
    if (project.aspectRatio < 1) width = Math.max(minWidth, width * 1.15);
    return { width: Math.min(maxWidth, width), height: baseHeight };
  }, [project.aspectRatio]);

  return (
    <motion.div
      layout={false}
      initial={{ 
        x: '-50%',
        y: '-50%',
        rotate: scatter.rotation, 
        scale: 0.5,
        opacity: 0 
      }}
      animate={{
        x: isActive ? '-50%' : `calc(-50% + ${scatter.x})`,
        y: isActive ? '-50%' : `calc(-50% + ${scatter.y})`,
        rotate: isActive ? 0 : scatter.rotation,
        scale: isActive ? 1 : 0.6,
        zIndex: isActive ? 50 : index + 1, 
        opacity: isActive ? 1 : (index < 6 ? 1 : 0.3),
      }}
      whileHover={!isActive ? { 
        scale: 0.64,
        rotate: scatter.rotation * 0.8,
        transition: { type: "spring", stiffness: 300, damping: 20 }
      } : {}}
      transition={{
        default: {
            type: "spring",
            stiffness: 120,
            damping: 24,
            mass: 1
        },
        zIndex: { delay: isActive ? 0 : 0.25 } 
      }}
      className={`absolute perspective-1000 ${isActive ? 'w-[94%] max-w-6xl h-[86%] cursor-default' : 'cursor-pointer'}`}
      style={{ 
        top: '50%',
        left: '50%',
        width: !isActive ? `${restingDimensions.width}px` : undefined,
        height: !isActive ? `${restingDimensions.height}px` : undefined,
      }}
      onClick={!isActive ? onClick : undefined}
    >
      {/* Folder Tab (Sticker Style) */}
      <div 
        className={`absolute -right-14 top-16 w-16 h-44 rounded-r-md shadow-[10px_0_30px_-10px_rgba(0,0,0,0.2)] flex items-center justify-center transition-all duration-500 z-0 border-y-2 border-r-2 ${borderColor} paper-texture`}
        style={{ backgroundColor: project.color }}
      >
         <div className="absolute top-0 right-0 w-2 h-full bg-black/5" />
         <div className="transform rotate-90 flex items-center gap-6 whitespace-nowrap">
            <span className={`font-mono text-[10px] font-black uppercase tracking-[0.3em] ${mutedTextColor}`}>INDEX_NO:</span>
            <span className={`font-display font-black tracking-widest text-xl ${textColor}`}>{project.code}</span>
         </div>
      </div>

      {/* Main Folder Body */}
      <div 
        className={`relative w-full h-full rounded-sm overflow-hidden flex flex-col border-2 ${isDark ? 'border-white/10' : 'border-black/10'} transition-all duration-700 paper-texture shadow-[0_30px_60px_-15px_rgba(0,0,0,0.2)]`}
        style={{ backgroundColor: project.color }}
      >
        <Noise opacity={isDark ? 0.25 : 0.15} />

        {/* Paper Clip (Aesthetic) */}
        {!isActive && (
          <div className="absolute top-4 left-8 z-[60] opacity-80 rotate-[-15deg]">
             <Paperclip size={32} className={mutedTextColor} strokeWidth={1.5} />
          </div>
        )}

        {/* Header Strip */}
        <div className={`h-14 border-b-2 ${borderColor} flex items-center px-10 justify-between shrink-0 relative z-10 bg-black/5`}>
          <div className="flex items-center gap-6">
             <div className={`w-3 h-3 rounded-full ${isActive ? 'bg-industrial-orange shadow-[0_0_10px_rgba(255,51,0,0.5)]' : 'bg-black/10'}`} />
             <h2 className={`font-display font-black text-2xl uppercase tracking-tighter ${textColor} truncate`}>{project.title}</h2>
             <div className={`hidden sm:flex items-center gap-2 px-3 py-1 border ${borderColor} rounded-full`}>
                <Database size={10} className={mutedTextColor} />
                <span className={`font-mono text-[8px] ${mutedTextColor} font-black tracking-widest`}>S_STORAGE_1A</span>
             </div>
          </div>
          <div className="flex items-center gap-4">
             {isActive && (
                 <button 
                    onClick={(e) => { e.stopPropagation(); onClick(); }}
                    className={`p-2 hover:bg-black/10 rounded-full transition-all ${textColor} active:scale-90`}
                 >
                    <X size={24} strokeWidth={3} />
                 </button>
             )}
             {!isActive && (
                <ShieldCheck size={24} className={mutedTextColor} strokeWidth={1.5} />
             )}
          </div>
        </div>

        {/* Content Area */}
        <div className={`flex-1 p-10 flex gap-10 relative z-10 overflow-hidden`}>
            
            {/* Left Metadata Column */}
            <div className={`w-1/3 flex flex-col gap-8 font-mono text-sm ${textColor} border-r-2 ${borderColor} pr-10 overflow-y-auto custom-scrollbar`}>
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <p className={`text-[9px] uppercase tracking-[0.5em] font-black ${mutedTextColor}`}>01_DESCRIPTION</p>
                      <div className="w-12 h-0.5 bg-industrial-orange opacity-40" />
                    </div>
                    <p className="leading-relaxed opacity-90 text-[12px] font-sans font-bold tracking-tight">{project.description}</p>
                </div>

                <div className="space-y-4">
                     <p className={`text-[9px] uppercase tracking-[0.5em] font-black ${mutedTextColor}`}>02_CATEGORIZATION</p>
                     <div className="flex flex-wrap gap-2">
                        {project.tags.map(tag => (
                            <span key={tag} className={`px-2.5 py-1 border-2 ${borderColor} text-[8px] font-black uppercase tracking-widest bg-black/5`}>{tag}</span>
                        ))}
                     </div>
                </div>

                <div className="space-y-4 mt-auto">
                    <div className="flex justify-between items-end">
                      <p className={`text-[9px] uppercase tracking-[0.5em] font-black ${mutedTextColor}`}>03_SIGNAL_LOG</p>
                      <ScanLine size={16} className={mutedTextColor} />
                    </div>
                    <div className="bg-black/10 p-5 rounded-sm border border-black/5">
                        <DataViz data={project.stats} color={isDark ? '#fff' : '#000'} height={50} width={200} />
                    </div>
                </div>

                <div className="p-4 border-2 border-dashed border-black/20 opacity-20 shrink-0">
                    <div className="barcode-pattern h-8 w-full mb-2" />
                    <p className="text-center text-[8px] tracking-[1em] font-black">SECURE_ASSET</p>
                </div>
            </div>

            {/* Right Visual Column */}
            <div className="flex-1 relative flex flex-col h-full overflow-hidden">
                <div 
                  className={`relative flex-1 bg-black/10 p-4 border-2 border-black/10 shadow-inner overflow-hidden flex items-center justify-center ${isActive ? 'cursor-zoom-in' : ''}`}
                  onClick={() => isActive && onImageClick?.(project.imageUrl)}
                >
                    {/* Industrial Label Overlay */}
                    <div className="absolute top-6 left-6 z-20 px-3 py-1 bg-paper-100 border-2 border-paper-900 shadow-sm rotate-[-2deg] font-mono text-[8px] font-black tracking-widest text-paper-900 pointer-events-none">
                      IMG_REF: {project.code}.JPG
                    </div>

                    <div className="w-full h-full relative flex items-center justify-center group overflow-hidden">
                        <img 
                            src={project.imageUrl} 
                            alt={project.title} 
                            className={`max-w-full max-h-full transition-all duration-700 ease-in-out shadow-2xl ${isActive ? 'object-contain scale-[1.01]' : 'object-cover w-full h-full grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105'}`}
                        />
                         <div className="absolute inset-0 pointer-events-none opacity-20 micro-grid" />
                    </div>
                </div>

                <div className="mt-4 flex justify-between items-center px-2">
                    <div className="flex items-center gap-4">
                        <Grip size={18} className={mutedTextColor} />
                        <span className={`text-[9px] font-mono font-black uppercase tracking-[0.4em] ${mutedTextColor}`}>RELEASE_AUTH_GRANTED</span>
                    </div>
                    <div className="flex gap-2">
                        {[1, 2, 3].map(i => (
                           <div key={i} className={`w-2 h-2 rounded-full ${i === 3 ? 'bg-industrial-orange animate-pulse' : 'border-2 border-current opacity-20'}`} />
                        ))}
                    </div>
                </div>
            </div>
        </div>

        {/* Industrial Footer */}
        <div className={`h-10 border-t-2 ${borderColor} bg-black/15 flex items-center justify-between px-10 z-10 shrink-0`}>
             <p className={`text-[9px] font-mono font-black tracking-[0.6em] uppercase ${mutedTextColor}`}>NODE_{index+1}:STATION_ARCHIVE</p>
             <Fingerprint size={16} className={mutedTextColor} />
        </div>
      </div>
    </motion.div>
  );
};

export default Folder;
