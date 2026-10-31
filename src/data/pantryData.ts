export interface TechStackItem {
  id: string;
  name: string;
  size?: string;
  description: string;
  category: string;
}

export interface CoordinatorManifesto {
  id: string;
  title: string;
  role: string;
  summary: string;
}

export interface MerhavimCalendarWeek {
  weekNumber: number;
  topic: string;
  focus: string;
}

export interface ADHD3AxisMatrix {
  sensory: string;
  cognitive: string;
  emotional: string;
}

export interface BPEBlindnessExplanation {
  topic: string;
  strawberryExplanation: string;
  numericalComparison: string;
  workaround: string;
}

export interface NotebookLmItem {
  id: string;
  title: string;
  notebookId: string;
  description: string;
}

export const techStackDefinitions: TechStackItem[] = [
  { id: 'htmx', name: 'HTMX', size: '14KB', description: 'High-power HTML attributes for AJAX and SSE', category: 'Frontend' },
  { id: 'alpine', name: 'Alpine.js', size: '15KB', description: 'Lightweight reactive framework', category: 'Frontend' },
  { id: 'sqlite-vec', name: 'SQLite-vec', description: 'Vector search extension for SQLite', category: 'Database' },
  { id: 'turso', name: 'Turso', description: 'Edge-hosted libSQL database', category: 'Database Cloud' },
  { id: 'caddy', name: 'Caddy', description: 'Web server with automatic HTTPS', category: 'Web Server' },
  { id: 'bun', name: 'Bun', description: 'All-in-one JavaScript runtime', category: 'Runtime' }
];

export const coordinatorManifestos: CoordinatorManifesto[] = [
  { id: 'eos-manifesto', title: 'EOS Pedagogical OS Manifesto', role: 'School Pedagogical Coordinator', summary: 'Empowering school leadership through structured 53-week cadence' }
];

export const merhavimCalendarWeeks: MerhavimCalendarWeek[] = Array.from({ length: 53 }, (_, i) => ({
  weekNumber: i + 1,
  topic: `Week ${i + 1}: Pedagogical Focus & Merhavim Alignment`,
  focus: `EOS Operational Sprint for Week ${i + 1} of 53-week calendar`
}));

export const adhd3AxisMatrix: ADHD3AxisMatrix = {
  sensory: 'Sensory Input Modulation: Managing environmental stimuli and visual layout density.',
  cognitive: 'Cognitive Load Distribution: Micro-chunking instructional prompts.',
  emotional: 'Emotional Regulation & Executive Functioning: Dopamine-aligned reward loops.'
};

export const bpeBlindnessExplanation: BPEBlindnessExplanation = {
  topic: 'BPE Tokenization Failure & Workaround',
  strawberryExplanation: 'Sub-word Byte Pair Encoding splits words into non-intuitive token chunks, causing LLM blindness to letter counts (e.g., counting r in Strawberry).',
  numericalComparison: 'BPE tokenizers often misalign raw decimal string comparisons such as evaluating 9.11 vs 9.9.',
  workaround: 'Character-level breakdown, explicit regex pre-processing, or structured JSON schema prompting.'
};

export const notebookLmCatalog: NotebookLmItem[] = [
  {
    id: 'israel-birds',
    title: 'עולם הציפורים בישראל (World of Birds in Israel)',
    notebookId: '5e674188-c91b-45f1-9b5b-3fe62c291e0f',
    description: 'Comprehensive NotebookLM research catalog covering avifauna in Israel.'
  }
];

export const pantryData = {
  techStackDefinitions,
  coordinatorManifestos,
  merhavimCalendarWeeks,
  adhd3AxisMatrix,
  bpeBlindnessExplanation,
  notebookLmCatalog
};

export default pantryData;
