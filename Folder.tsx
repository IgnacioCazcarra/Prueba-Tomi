
import React from 'react';
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
  scatter: {
    x: string | number;
    y: string | number;
    rotation: number;
  };
}

const Folder: React.FC<FolderProps> = ({ project, isActive, index, total, onClick, scatter }) => {
  const isDark = project.color === '#2C2B29';
  const textColor = isDark ? 'text-gray-200' : 'text-paper-900';
  const borderColor = isDark ? 'border-gray-600' : 'border-gray-400';
  const mutedTextColor = isDark ? 'text-gray-500' : 'text-gray-500';

  return (
    <motion.div
      layout={false}
      initial={{ 
        x: scatter.x, 
        y: scatter.y, 
        rotate: scatter.rotation, 
        scale: 0.65,
        opacity: 0 
      }}
      animate={{
        x: isActive ? 0 : scatter.x,
        y: isActive ? 0 : scatter.y,
        rotate: isActive ? 0 : scatter.rotation,
        scale: isActive ? 1 : 0.65,
        zIndex: isActive ? 50 : index + 1, 
        opacity: 1,
      }}
      whileHover={!isActive ? { 
        scale: 0.7,
        y: typeof scatter.y === 'number' ? scatter.y - 10 : `calc(${scatter.y} - 2vh)`,
        transition: { duration: 0.2 }
      } : {}}
      transition={{
        default: {
            type: "spring",
            stiffness: 100,
            damping: 20,
            mass: 1.2
        },
        zIndex: { delay: isActive ? 0 : 0.3 } 
      }}
      className={`absolute w-full max-w-4xl perspective-1000 ${isActive ? 'h-[85vh] cursor-default' : 'h-[600px] cursor-pointer'}`}
      style={{ 
        top: isActive ? '5vh' : '10vh',
        left: 0,
        right: 0,
        marginLeft: 'auto',
        marginRight: 'auto',
      }}
      onClick={!isActive ? onClick : undefined}
    >
      {/* Folder Tab */}
      <div 
        className={`absolute -right-12 top-8 w-14 h-48 rounded-r-md shadow-lg flex items-center justify-center transition-colors duration-300 z-0`}
        style={{ backgroundColor: project.color }}
      >
         <Noise opacity={0.1} />
         <div className="transform rotate-90 flex items-center gap-4 whitespace-nowrap">
            <span className={`font-mono text-xs ${mutedTextColor}`}>REF:</span>
            <span className={`font-display font-bold tracking-widest text-lg ${textColor}`}>{project.code}</span>
         </div>
      </div>

      {/* Main Folder Body */}
      <div 
        className={`relative w-full h-full rounded-sm shadow-2xl overflow-hidden flex flex-col border border-opacity-20 ${isDark ? 'border-white' : 'border-black'} transition-shadow duration-500 ${isActive ? 'shadow-2xl' : 'shadow-lg hover:shadow-xl'}`}
        style={{ backgroundColor: project.color }}
      >
        <Noise opacity={0.15} />

        {/* Header Strip */}
        <div className={`h-16 border-b ${borderColor} flex items-center px-8 justify-between shrink-0 relative z-10`}>
          <div className="flex items-center gap-6">
             <div className={`w-3 h-3 rounded-full animate-pulse ${isActive ? 'bg-industrial-orange' : 'bg-gray-400'}`} />
             <h2 className={`font-display font-bold text-3xl uppercase tracking-tighter ${textColor} truncate max-w-[300px] sm:max-w-none`}>{project.title}</h2>
             <span className={`font-mono text-[10px] px-2 py-0.5 border ${borderColor} rounded-sm ${mutedTextColor} hidden sm:block font-bold`}>RECORD_V1.0</span>
          </div>
          <div className="flex items-center gap-4">
             {isActive && (
                 <button 
                    onClick={(e) => { e.stopPropagation(); onClick(); }}
                    className={`p-2 hover:bg-black/10 rounded-full transition-colors ${textColor}`}
                 >
                    <X size={24} />
                 </button>
             )}
             {!isActive && (
                <Fingerprint size={28} className={mutedTextColor} strokeWidth={1} />
             )}
          </div>
        </div>

        {/* Content Area */}
        <div className={`flex-1 p-8 flex gap-8 relative z-10 overflow-hidden transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-80'}`}>
            
            {/* Left Metadata Column */}
            <div className={`w-1/3 flex flex-col gap-6 font-mono text-sm ${textColor} border-r ${borderColor} pr-8`}>
                <div className="space-y-3">
                    <p className={`text-[10px] uppercase tracking-widest font-bold ${mutedTextColor}`}>Archive_Abstract</p>
                    <p className="leading-relaxed opacity-90 text-xs font-sans font-medium line-clamp-8">{project.description}</p>
                </div>

                <div className={`h-px w-full ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`} />

                <div className="space-y-3">
                     <p className={`text-[10px] uppercase tracking-widest font-bold ${mutedTextColor}`}>Taxonomy_Tags</p>
                     <div className="flex flex-wrap gap-2">
                        {project.tags.map(tag => (
                            <span key={tag} className={`px-2 py-0.5 border ${borderColor} text-[9px] font-bold uppercase`}>{tag}</span>
                        ))}
                     </div>
                </div>

                <div className={`h-px w-full ${isDark ? 'bg-gray-700' : 'bg-gray-300'}`} />

                <div className="space-y-3 mt-auto">
                    <div className="flex justify-between items-end">
                      <p className={`text-[10px] uppercase tracking-widest font-bold ${mutedTextColor}`}>Signal_Flux</p>
                      <ScanLine size={16} className={mutedTextColor} />
                    </div>
                    <DataViz data={project.stats} color={isDark ? '#fff' : '#000'} height={60} width={220} />
                    <div className="flex justify-between text-[9px] font-mono opacity-40">
                        <span>SYS_MIN_0</span>
                        <span>SYS_MAX_100</span>
                    </div>
                </div>

                <div className="mt-4 p-4 border border-dashed border-black/20 opacity-30 hidden md:block">
                    <div className="barcode-pattern h-10 w-full mix-blend-multiply" />
                    <p className="text-center text-[9px] mt-2 tracking-[0.4em] font-bold">CLASSIFIED_DOCUMENT</p>
                </div>
            </div>

            {/* Right Visual Column */}
            <div className="flex-1 relative flex flex-col h-full">
                <div className="relative flex-1 bg-black bg-opacity-5 p-1 border border-opacity-10 border-black shadow-inner overflow-hidden">
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20">
                        <div className="w-20 h-5 bg-paper-200 opacity-30 rotate-1 shadow-sm transform -skew-x-12 border-x border-black/5" /> 
                    </div>
                    
                    <div className="w-full h-full relative overflow-hidden grayscale hover:grayscale-0 transition-all duration-1000 group">
                        <img 
                            src={project.imageUrl} 
                            alt={project.title} 
                            className="w-full h-full object-cover object-center transform transition-transform duration-1000"
                        />
                         <div className="absolute inset-0 pointer-events-none opacity-10 micro-grid" />
                    </div>
                </div>

                <div className="mt-6 flex justify-between items-center px-2">
                    <div className="flex items-center gap-3">
                        <Paperclip size={18} className={textColor} />
                        <span className={`text-[10px] font-mono font-bold uppercase tracking-widest ${textColor}`}>IMG_FILE_LINK: ATTACHMENT_{project.code}.DAT</span>
                    </div>
                    <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full border border-current opacity-30" />
                        <div className="w-2.5 h-2.5 rounded-full border border-current opacity-60" />
                        <div className="w-2.5 h-2.5 rounded-full bg-current" />
                    </div>
                </div>
            </div>
        </div>

        {/* Industrial Footer */}
        <div className={`h-10 border-t ${borderColor} bg-black/5 flex items-center justify-between px-6 z-10`}>
             <p className={`text-[10px] font-mono font-bold tracking-[0.3em] uppercase ${mutedTextColor}`}>SECURITY_AUTH_01 // ARCHIVE_GRID_SYSTEM</p>
             <Grip size={14} className={mutedTextColor} />
        </div>
      </div>
    </motion.div>
  );
};

export default Folder;
