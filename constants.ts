
import { Project } from './types';

export const PROJECTS: Project[] = [
  {
    id: 'poster-01',
    code: 'FIGMA_EXP_01',
    title: 'NOMBRE_DEL_PROYECTO',
    date: '2024.03.15', 
    description: 'Descripción conceptual de tu poster. Aquí puedes explicar las decisiones tipográficas, la retícula utilizada en Figma o el concepto detrás de la composición.',
    tags: ['POSTER', 'TYPOGRAPHY', 'SWISS'],
    color: '#F2F0E9',
    texture: 'rough', 
    imageUrl: 'https://i.imgur.com/hgr8Wi6.jpeg', 
    stats: [10, 25, 40, 35, 60, 80, 50, 90, 20, 10],
    aspectRatio: 0.7 // Portrait (vertical)
  },
  {
    id: 'poster-02',
    code: 'GRID_SYS_V2',
    title: 'SISTEMA_RETICULAR',
    date: '2024.02.10',
    description: 'Exploración de jerarquías visuales. Este diseño utiliza una retícula de 12 columnas con una tipografía grotesca para generar tensión visual.',
    tags: ['LAYOUT', 'GRID', 'MINIMAL'],
    color: '#E6E2D6',
    texture: 'recycled',
    imageUrl: 'https://i.imgur.com/qHTrW2J.png',
    stats: [50, 55, 60, 50, 45, 60, 75, 80, 90, 100],
    aspectRatio: 1.0 // Square
  },
  {
    id: 'poster-03',
    code: 'COLOR_STUDY',
    title: 'ESTUDIO_CROMÁTICO',
    date: '2024.01.22',
    description: 'Serie experimental sobre la interacción del color en medios impresos. Simulación de sobreimpresión (overprint) y mezcla de tintas.',
    tags: ['COLOR', 'PRINT', 'ART'],
    color: '#D4D4D8',
    texture: 'smooth',
    imageUrl: 'https://i.imgur.com/HpR70s8.png',
    stats: [90, 85, 80, 70, 60, 50, 40, 30, 20, 10],
    aspectRatio: 1.4 // Landscape (horizontal)
  },
  {
    id: 'poster-04',
    code: 'TYPO_3D',
    title: 'VOLUMETRÍA',
    date: '2023.12.05',
    description: 'Integración de elementos 3D en composiciones planas. El objetivo fue crear profundidad sin perder la esencia del diseño gráfico tradicional.',
    tags: ['3D', 'BLENDER', 'COMPOSITION'],
    color: '#8A8580',
    texture: 'rough',
    imageUrl: 'https://i.imgur.com/YYd5vsf.png',
    stats: [20, 30, 10, 50, 40, 60, 80, 20, 50, 70],
    aspectRatio: 1.2 // Adjusted to match UI_CONCEPT proportions
  },
  {
    id: 'poster-05',
    code: 'INTERFACE_01',
    title: 'UI_CONCEPT',
    date: '2023.11.18',
    description: 'Diseño de interfaz traducido a formato poster. Una deconstrucción de los elementos UI habituales presentados como arte estático.',
    tags: ['UI/UX', 'CONCEPT', 'DIGITAL'],
    color: '#2C2B29',
    texture: 'smooth',
    imageUrl: 'https://i.imgur.com/kVKjMvp.png',
    stats: [45, 45, 45, 45, 90, 90, 45, 45, 45, 45],
    aspectRatio: 1.2 // Landscape (wide)
  }
];

export const NOISE_OPACITY = 0.4;
