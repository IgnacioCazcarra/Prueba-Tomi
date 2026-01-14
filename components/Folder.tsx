import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Paperclip, ScanLine, Grip, Fingerprint, X } from 'lucide-react';
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
  const borderColor = isDark ? 'border-white/20' : 'border-paper-900/20';
  const mutedTextColor = isDark ? 'text-white/40' : 'text-paper-900/40';

  // Calculate dynamic dimensions for resting state based on aspect ratio
  // This makes the folders "responsive" to the content inside as requested.
  const restingDimensions = useMemo(() => {
    const baseHeight = 580;
    const minWidth = 480; // Ensuring it's never too "skinny"
    const maxWidth = 800;
    
    let width = baseHeight * project.aspectRatio;
    
    // For the specific portrait orientation common in posters (like 0.7 ratio), 
    // we lean towards a wider profile to maintain the "archival folder" feel.
    if (project.aspectRatio < 1) {
      width = Math.max(minWidth, width * 1.2); 
    }

    return { 
      width: Math.min(maxWidth, width), 
      height: baseHeight 
    };
  }, [project.aspectRatio]);

  return (
    <motion.div
      layout={false}
      initial={{ 
        x: '-50%',
        y: '-50%',
        rotate: scatter.rotation, 
        scale: 0.55,
        opacity: 0 
      }}
      animate={{
        x: isActive ? '-50%' : `calc(-50% + ${scatter.x})`,
        y: isActive ? '-50%' : `calc(-50% + ${scatter.y})`,
        rotate: isActive ? 0 : scatter.rotation,
        scale: isActive ? 1 : 0.6,
        zIndex: isActive ? 50 : index + 1, 
        opacity: isActive ? 1 : (index < 6 ? 1 : 0.2),
      }}
      // Fixed: Changed invalid property 'baseHeight' to 'ease' in transition config
      whileHover={!isActive ? { 
        scale: 0.63,
        transition: { duration: 0.3, ease: "easeOut" }
      } : {}}
      transition={{
        default: {
            type: "spring",
            stiffness: 140,
            damping: 25,
            mass: 0.8
        },
        zIndex: { delay: isActive ? 0 : 0.2 } 
      }}
      className={`absolute perspective-1000 ${isActive ? 'w-[92%] max-w-6xl h-[88%] cursor-default' : 'cursor-pointer'}`}
      style={{ 
        top: '50%',
        left: '50%',
        width: !isActive ? `${restingDimensions.width}px` : undefined,
        height: !isActive ? `${restingDimensions.height}px` : undefined,
      }}
      onClick={!isActive ? onClick : undefined}
    >
      {/* Folder Tab */}
      <div 
        className={`absolute -right-12 top-16 w-14 h-48 rounded-r-sm shadow-[8px_0_20px_-5px_rgba(0,0,0,0.1)] flex items-center justify-center transition-colors duration-500 z-0 border-y border-r ${borderColor} paper-texture`}
        style={{ backgroundColor: project.color }}
      >
         <div className="transform rotate-90 flex items-center gap-4 whitespace-nowrap">
            <span className={`font-mono text-[11px] font-black uppercase tracking-widest ${mutedTextColor}`}>ID:</span>
            <span className={`font-display font-black tracking-widest text-lg ${textColor}`}>{project.code}</span>
         </div>
      </div>

      {/* Main Folder Body */}
      <div 
        className={`relative w-full h-full rounded-sm overflow-hidden flex flex-col border border-opacity-30 ${isDark ? 'border-white' : 'border-black'} transition-all duration-700 paper-texture ${isActive ? 'shadow-[0_60px_100px_-20px_rgba(0,0,0,0.3)]' : 'shadow-[0_20px_40px_-10px_rgba(0,0,0,0.15)]'}`}
        style={{ backgroundColor: project.color }}
      >
        <Noise opacity={isDark ? 0.2 : 0.12} />

        {/* Header Strip */}
        <div className={`h-16 border-b ${borderColor} flex items-center px-10 justify-between shrink-0 relative z-10 bg-black/5`}>
          <div className="flex items-center gap-6">
             <div className={`w-3.5 h-3.5 rounded-full ring-2 ring-offset-2 ring-offset-transparent ${isActive ? 'bg-industrial-orange ring-industrial-orange/40 animate-pulse' : 'bg-paper-900/20 ring-transparent'}`} />
             <h2 className={`font-display font-black text-2xl md:text-3xl uppercase tracking-tighter ${textColor} truncate max-w-[200px] sm:max-w-none`}>{project.title}</h2>
             <span className={`font-mono text-[10px] px-2.5 py-1 border-2 ${borderColor} rounded-sm ${mutedTextColor} hidden sm:block font-black tracking-widest`}>DOC_AUTH_FINAL</span>
          </div>
          <div className="flex items-center gap-6">
             {isActive && (
                 <button 
                    onClick={(e) => { e.stopPropagation(); onClick(); }}
                    className={`p-2 hover:bg-black/15 rounded-full transition-all ${textColor} active:scale-90`}
                 >
                    <X size={26} strokeWidth={2.5} />
                 </button>
             )}
             {!isActive && (
                <Fingerprint size={28} className={mutedTextColor} strokeWidth={1.5} />
             )}
          </div>
        </div>

        {/* Content Area */}
        <div className={`flex-1 p-10 flex gap-10 relative z-10 overflow-hidden`}>
            
            {/* Left Metadata Column */}
            <div className={`w-1/3 flex flex-col gap-6 font-mono text-sm ${textColor} border-r ${borderColor} pr-10 overflow-y-auto custom-scrollbar`}>
                <div className="space-y-3 shrink-0">
                    <p className={`text-[10px] uppercase tracking-[0.4em] font-black ${mutedTextColor}`}>01_CONCEPT_SUMMARY</p>
                    <p className="leading-relaxed opacity-95 text-[13px] font-sans font-semibold tracking-tight">{project.description}</p>
                </div>

                <div className={`h-[2px] w-full shrink-0 ${isDark ? 'bg-white/10' : 'bg-black/10'}`} />

                <div className="space-y-3 shrink-0">
                     <p className={`text-[10px] uppercase tracking-[0.4em] font-black ${mutedTextColor}`}>02_TAG_TAXONOMY</p>
                     <div className="flex flex-wrap gap-2">
                        {project.tags.map(tag => (
                            <span key={tag} className={`px-2.5 py-1 border-2 ${borderColor} text-[9px] font-black uppercase tracking-wider bg-black/5`}>{tag}</span>
                        ))}
                     </div>
                </div>

                <div className={`h-[2px] w-full shrink-0 ${isDark ? 'bg-white/10' : 'bg-black/10'}`} />

                <div className="space-y-4 mt-auto pt-6 shrink-0">
                    <div className="flex justify-between items-end">
                      <p className={`text-[10px] uppercase tracking-[0.4em] font-black ${mutedTextColor}`}>03_SIGNAL_VISUALIZER</p>
                      <ScanLine size={18} className={mutedTextColor} />
                    </div>
                    <div className="bg-black/5 p-4 border border-black/5 rounded-sm">
                        <DataViz data={project.stats} color={isDark ? '#fff' : '#000'} height={60} width={220} />
                    </div>
                    <div className="flex justify-between text-[9px] font-black opacity-30 tracking-widest">
                        <span>L_FREQ</span>
                        <span>H_FREQ</span>
                    </div>
                </div>

                <div className="mt-6 p-4 border-2 border-dashed border-black/10 opacity-30 hidden lg:block shrink-0 rounded-sm">
                    <div className="barcode-pattern h-10 w-full mix-blend-multiply mb-3" />
                    <p className="text-center text-[10px] tracking-[0.6em] font-black">ARCHIVE_CLASSIFIED</p>
                </div>
            </div>

            {/* Right Visual Column */}
            <div className="flex-1 relative flex flex-col h-full overflow-hidden">
                <div 
                  className={`relative flex-1 bg-paper-900/5 p-3 border-2 border-black/10 shadow-inner overflow-hidden flex items-center justify-center ${isActive ? 'cursor-zoom-in' : ''}`}
                  onClick={() => isActive && onImageClick?.(project.imageUrl)}
                >
                    <div className="w-full h-full relative flex items-center justify-center group">
                        <img 
                            src={project.imageUrl} 
                            alt={project.title} 
                            className={`max-w-full max-h-full transition-all duration-1000 ease-in-out shadow-2xl ${isActive ? 'object-contain hover:scale-[1.02]' : 'object-cover w-full h-full grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100'}`}
                        />
                         <div className="absolute inset-0 pointer-events-none opacity-20 micro-grid" />
                    </div>
                </div>

                <div className="mt-5 flex justify-between items-center px-2 shrink-0">
                    <div className="flex items-center gap-4">
                        <Paperclip size={20} className={textColor} />
                        <span className={`text-[11px] font-mono font-black uppercase tracking-[0.3em] ${textColor}`}>ATTACHMENT_{project.code}.DAT</span>
                    </div>
                    <div className="flex gap-2">
                        <div className="w-2.5 h-2.5 rounded-full border-2 border-current opacity-20" />
                        <div className="w-2.5 h-2.5 rounded-full border-2 border-current opacity-50" />
                        <div className="w-2.5 h-2.5 rounded-full bg-industrial-orange" />
                    </div>
                </div>
            </div>
        </div>

        {/* Industrial Footer */}
        <div className={`h-12 border-t ${borderColor} bg-black/10 flex items-center justify-between px-10 z-10 shrink-0`}>
             <p className={`text-[10px] font-mono font-black tracking-[0.5em] uppercase ${mutedTextColor}`}>RESTRICTED_ACCESS_SECURE_NODE_1A</p>
             <Grip size={16} className={mutedTextColor} />
        </div>
      </div>
    </motion.div>
  );
};

export default Folder;