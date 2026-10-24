import React, { useState } from 'react';
import {
  Calendar,
  Scale,
  Box,
  Heart,
  Sliders,
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  Check,
  ChevronRight,
  Database,
  Cpu,
  Layers,
  Zap,
  Activity,
  Compass,
  Plus,
  Minus,
  Grid,
  Shield,
  Eye
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'phet' | 'archaeology' | 'sel'>('phet');
  const [selectedWeek, setSelectedWeek] = useState<number>(12);
  
  const [leftWeight, setLeftWeight] = useState<number>(8);
  const [rightWeight, setRightWeight] = useState<number>(5);

  const [tray1Count, setTray1Count] = useState<number>(7);
  const [tray2Count, setTray2Count] = useState<number>(4);

  const [phetSimRunning, setPhetSimRunning] = useState<boolean>(true);
  const [phetFrequency, setPhetFrequency] = useState<number>(2.5);
  const [phetAmplitude, setPhetAmplitude] = useState<number>(4.0);

  const [artifactRotation, setArtifactRotation] = useState<number>(45);
  const [selectedLayer, setSelectedLayer] = useState<'stratum-a' | 'stratum-b' | 'stratum-c'>('stratum-a');
  const [archaeologyZoom, setArchaeologyZoom] = useState<number>(100);

  const [selScenarioIndex, setSelScenarioIndex] = useState<number>(0);
  const [selectedEmpathyChoice, setSelectedEmpathyChoice] = useState<number | null>(null);
  const [selScore, setSelScore] = useState<number>(85);

  const [visualContrast, setVisualContrast] = useState<'normal' | 'high' | 'soft'>('normal');
  const [motionReduced, setMotionReduced] = useState<boolean>(false);
  const [chunkingMode, setChunkingMode] = useState<boolean>(true);
  const [microTimerMinutes, setMicroTimerMinutes] = useState<number>(5);
  const [tactileFidgetMode, setTactileFidgetMode] = useState<boolean>(true);
  const [focusSoundscape, setFocusSoundscape] = useState<'none' | 'white' | 'nature' | 'binaural'>('binaural');

  const merhavimWeeks = Array.from({ length: 53 }, (_, i) => ({
    weekNum: i + 1,
    term: i + 1 <= 14 ? 'Term A (Autumn)' : i + 1 <= 28 ? 'Term B (Winter)' : i + 1 <= 42 ? 'Term C (Spring)' : 'Term D (Summer)',
    status: (i + 1) === selectedWeek ? 'active' : (i + 1) % 5 === 0 ? 'milestone' : 'standard'
  }));

  const isBalanced = leftWeight === rightWeight;
  const scaleTilt = Math.max(-15, Math.min(15, (rightWeight - leftWeight) * 3));

  const selScenarios = [
    {
      title: "Group Project Inclusion",
      context: "A classmate is sitting alone during group work after moving from another district.",
      options: [
        { text: "Invite them to join your 3-Click Math Tray group immediately.", score: 20, feedback: "Great empathy! Promotes instant peer integration." },
        { text: "Ask the teacher to assign them a group.", score: 10, feedback: "Helpful, but direct peer invitation creates stronger social bonds." },
        { text: "Continue working with your existing group without offering a seat.", score: 0, feedback: "Missed opportunity for inclusive community building." }
      ]
    },
    {
      title: "Conflict Resolution in 10-Frame Challenge",
      context: "Two students disagree on how to balance the scale in a team competition.",
      options: [
        { text: "Suggest testing both equations on the Tangible Scale sequentially.", score: 20, feedback: "Excellent collaborative problem solving using tangible evidence." },
        { text: "Vote on which answer sounds right.", score: 10, feedback: "Democratic, but testing empirically builds deeper math reasoning." },
        { text: "Split the group and work independently.", score: 5, feedback: "Avoids conflict but loses teamwork synergy." }
      ]
    }
  ];

  return (
    <div className={`min-h-screen font-sans bg-slate-950 text-slate-100 ${visualContrast === 'high' ? 'contrast-125' : ''}`}>
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-xl shadow-lg shadow-indigo-500/30">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">
                EduHolo Studio 3-Click Teacher & Classroom Interface
              </h1>
              <p className="text-xs text-indigo-400 font-medium tracking-wide flex items-center gap-2 mt-0.5">
                <Database className="w-3.5 h-3.5" />
                <span>HTMX + Alpine.js + SQLite-vec / Turso stack</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-800/50">
              <Zap className="w-3.5 h-3.5" /> HTMX
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sky-950/80 text-sky-400 border border-sky-800/50">
              <Cpu className="w-3.5 h-3.5" /> Alpine.js
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-950/80 text-purple-400 border border-purple-800/50">
              <Layers className="w-3.5 h-3.5" /> SQLite-vec / Turso
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        <section className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-400" />
              <h2 className="text-lg font-semibold text-white">53-week Merhavim calendar selector</h2>
            </div>
            <div className="text-xs text-slate-400 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/50">
              Selected: <span className="text-indigo-300 font-bold">Week {selectedWeek}</span> ({merhavimWeeks[selectedWeek - 1]?.term})
            </div>
          </div>

          <p className="text-xs text-slate-400 mb-4">
            Merhavim academic year timeline index. Select any of the 53 weeks to sync classroom lesson modules and SQLite-vec embeddings.
          </p>

          <div className="grid grid-cols-11 sm:grid-cols-18 md:grid-cols-27 gap-1.5 max-h-40 overflow-y-auto p-2 bg-slate-950/60 rounded-xl border border-slate-800/80">
            {merhavimWeeks.map((item) => (
              <button
                key={item.weekNum}
                onClick={() => setSelectedWeek(item.weekNum)}
                className={`py-2 px-1 text-xs rounded-md font-mono transition-all flex flex-col items-center justify-center border ${
                  item.weekNum === selectedWeek
                    ? 'bg-indigo-600 text-white border-indigo-400 font-bold ring-2 ring-indigo-500/40 shadow-md'
                    : item.status === 'milestone'
                    ? 'bg-amber-950/40 text-amber-300 border-amber-800/60 hover:bg-amber-900/50'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-slate-200'
                }`}
                title={`Week ${item.weekNum} - ${item.term}`}
              >
                <span>W{item.weekNum}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-semibold text-white">Tangible Math Balance Scale & 10-Frame trays</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-slate-300 flex items-center gap-1.5">
                    <Scale className="w-4 h-4 text-emerald-400" />
                    Tangible Math Balance Scale
                  </span>
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${
                    isBalanced 
                      ? 'bg-emerald-950 text-emerald-400 border-emerald-800' 
                      : 'bg-amber-950 text-amber-400 border-amber-800'
                  }`}>
                    {isBalanced ? 'Balanced (Equilibrium)' : 'Unbalanced'}
                  </span>
                </div>

                <div className="relative h-36 bg-slate-900/90 rounded-lg border border-slate-800 flex flex-col items-center justify-center overflow-hidden my-4">
                  <div 
                    className="w-3/4 h-2 bg-indigo-500 rounded transition-transform duration-300 relative flex justify-between items-center px-2"
                    style={{ transform: `rotate(${scaleTilt}deg)` }}
                  >
                    <div className="w-16 h-12 bg-indigo-950/90 border-2 border-indigo-400 rounded-b-xl flex items-center justify-center -translate-y-1 text-indigo-200 font-bold text-sm shadow-md">
                      {leftWeight} kg
                    </div>
                    <div className="w-4 h-4 bg-amber-400 rotate-45 rounded-sm"></div>
                    <div className="w-16 h-12 bg-indigo-950/90 border-2 border-indigo-400 rounded-b-xl flex items-center justify-center -translate-y-1 text-indigo-200 font-bold text-sm shadow-md">
                      {rightWeight} kg
                    </div>
                  </div>
                  <div className="w-0 h-0 border-l-[16px] border-l-transparent border-r-[16px] border-r-transparent border-b-[24px] border-b-slate-600 mt-6"></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="space-y-1">
                  <label className="text-xs text-slate-400">Left Pan Weight ({leftWeight})</label>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setLeftWeight(Math.max(0, leftWeight - 1))}
                      className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-200"
                    ><Minus className="w-3.5 h-3.5" /></button>
                    <input 
                      type="range" min="0" max="20" value={leftWeight} 
                      onChange={(e) => setLeftWeight(Number(e.target.value))}
                      className="w-full accent-indigo-500"
                    />
                    <button 
                      onClick={() => setLeftWeight(leftWeight + 1)}
                      className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-200"
                    ><Plus className="w-3.5 h-3.5" /></button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-slate-400">Right Pan Weight ({rightWeight})</label>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setRightWeight(Math.max(0, rightWeight - 1))}
                      className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-200"
                    ><Minus className="w-3.5 h-3.5" /></button>
                    <input 
                      type="range" min="0" max="20" value={rightWeight} 
                      onChange={(e) => setRightWeight(Number(e.target.value))}
                      className="w-full accent-indigo-500"
                    />
                    <button 
                      onClick={() => setRightWeight(rightWeight + 1)}
                      className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-200"
                    ><Plus className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-slate-300 flex items-center gap-1.5">
                    <Grid className="w-4 h-4 text-emerald-400" />
                    10-Frame Trays
                  </span>
                  <span className="text-xs text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                    Total: <strong className="text-emerald-300">{tray1Count + tray2Count}</strong> / 20
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between items-center text-xs text-slate-400">
                    <span>Tray A ({tray1Count}/10)</span>
                    <div className="flex gap-1">
                      <button onClick={() => setTray1Count(Math.max(0, tray1Count - 1))} className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 rounded">-</button>
                      <button onClick={() => setTray1Count(Math.min(10, tray1Count + 1))} className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 rounded">+</button>
                    </div>
                  </div>
                  <div className="grid grid-cols-5 gap-1.5 bg-slate-900 p-2 rounded-lg border border-slate-800">
                    {Array.from({ length: 10 }).map((_, idx) => (
                      <div 
                        key={idx} 
                        className={`h-8 rounded flex items-center justify-center border transition-all ${
                          idx < tray1Count 
                            ? 'bg-emerald-500/20 border-emerald-500/80 shadow-sm' 
                            : 'bg-slate-950 border-slate-800'
                        }`}
                      >
                        {idx < tray1Count && <div className="w-4 h-4 rounded-full bg-emerald-400 shadow"></div>}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs text-slate-400">
                    <span>Tray B ({tray2Count}/10)</span>
                    <div className="flex gap-1">
                      <button onClick={() => setTray2Count(Math.max(0, tray2Count - 1))} className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 rounded">-</button>
                      <button onClick={() => setTray2Count(Math.min(10, tray2Count + 1))} className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 rounded">+</button>
                    </div>
                  </div>
                  <div className="grid grid-cols-5 gap-1.5 bg-slate-900 p-2 rounded-lg border border-slate-800">
                    {Array.from({ length: 10 }).map((_, idx) => (
                      <div 
                        key={idx} 
                        className={`h-8 rounded flex items-center justify-center border transition-all ${
                          idx < tray2Count 
                            ? 'bg-indigo-500/20 border-indigo-500/80 shadow-sm' 
                            : 'bg-slate-950 border-slate-800'
                        }`}
                      >
                        {idx < tray2Count && <div className="w-4 h-4 rounded-full bg-indigo-400 shadow"></div>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 text-xs text-slate-400 flex justify-between items-center">
                <span>Equation: {tray1Count} + {tray2Count} = {tray1Count + tray2Count}</span>
                <button 
                  onClick={() => { setTray1Count(5); setTray2Count(5); }}
                  className="text-indigo-400 hover:underline flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" /> Reset Trays
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <Box className="w-5 h-5 text-sky-400" />
              <h2 className="text-lg font-semibold text-white">Interactive Modules</h2>
            </div>

            <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
              <button
                onClick={() => setActiveTab('phet')}
                className={`px-4 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-2 ${
                  activeTab === 'phet'
                    ? 'bg-sky-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Activity className="w-4 h-4" /> embedded PhET simulation tab
              </button>

              <button
                onClick={() => setActiveTab('archaeology')}
                className={`px-4 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-2 ${
                  activeTab === 'archaeology'
                    ? 'bg-amber-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Compass className="w-4 h-4" /> 3D Archaeology viewer tab
              </button>

              <button
                onClick={() => setActiveTab('sel')}
                className={`px-4 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-2 ${
                  activeTab === 'sel'
                    ? 'bg-rose-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Heart className="w-4 h-4" /> Friendship SEL simulator tab
              </button>
            </div>
          </div>

          {activeTab === 'phet' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Embedded PhET Physics & Math Simulation Studio</span>
                <span className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${phetSimRunning ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
                  Status: {phetSimRunning ? 'Active' : 'Paused'}
                </span>
              </div>

              <div className="relative h-72 bg-slate-950 rounded-xl border border-slate-800 overflow-hidden flex flex-col items-center justify-center p-6">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]"></div>
                
                <div className="w-full flex items-center justify-center gap-1 z-10 my-auto">
                  {Array.from({ length: 32 }).map((_, i) => {
                    const waveHeight = phetSimRunning 
                      ? Math.sin((i + Date.now() / 200) * 0.4) * (phetAmplitude * 8) + 40 
                      : Math.sin(i * 0.4) * (phetAmplitude * 8) + 40;
                    return (
                      <div
                        key={i}
                        className="w-2 bg-sky-400 rounded-full transition-all duration-75"
                        style={{ height: `${Math.max(8, waveHeight)}px` }}
                      ></div>
                    );
                  })}
                </div>

                <div className="z-10 text-center space-y-1 mt-auto">
                  <p className="text-xs text-sky-300 font-mono">Frequency: {phetFrequency} Hz | Amplitude: {phetAmplitude} cm</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setPhetSimRunning(!phetSimRunning)}
                    className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-semibold flex items-center gap-2"
                  >
                    {phetSimRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    {phetSimRunning ? 'Pause Sim' : 'Start Sim'}
                  </button>
                  <button
                    onClick={() => { setPhetFrequency(2.5); setPhetAmplitude(4.0); }}
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Reset
                  </button>
                </div>

                <div className="flex items-center gap-6 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <label>Frequency:</label>
                    <input 
                      type="range" min="0.5" max="5.0" step="0.1" value={phetFrequency} 
                      onChange={(e) => setPhetFrequency(Number(e.target.value))}
                      className="accent-sky-400 w-24"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <label>Amplitude:</label>
                    <input 
                      type="range" min="1.0" max="8.0" step="0.5" value={phetAmplitude} 
                      onChange={(e) => setPhetAmplitude(Number(e.target.value))}
                      className="accent-sky-400 w-24"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'archaeology' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>3D Archaeology Viewer & Stratigraphy Studio</span>
                <span className="text-amber-400 font-mono">Stratum: {selectedLayer.toUpperCase()}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 h-72 bg-slate-950 rounded-xl border border-slate-800 relative flex items-center justify-center overflow-hidden">
                  <div 
                    className="w-36 h-36 border-4 border-amber-500/80 rounded-2xl bg-amber-950/40 shadow-2xl flex items-center justify-center transition-transform duration-300"
                    style={{ transform: `rotate(${artifactRotation}deg) scale(${archaeologyZoom / 100})` }}
                  >
                    <div className="text-center p-2">
                      <Compass className="w-10 h-10 text-amber-400 mx-auto mb-1 animate-pulse" />
                      <span className="text-[10px] text-amber-200 font-bold block">CANAANITE JAR FRAGMENT</span>
                      <span className="text-[9px] text-amber-400/80 block">C. 1200 BCE</span>
                    </div>
                  </div>

                  <div className="absolute bottom-3 left-3 text-[11px] text-slate-400 bg-slate-900/90 px-2.5 py-1 rounded border border-slate-800">
                    Rotation: {artifactRotation}° | Zoom: {archaeologyZoom}%
                  </div>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-between space-y-3">
                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-amber-300 uppercase tracking-wider">Stratigraphic Layers</h4>
                    <div className="space-y-1.5">
                      {[
                        { id: 'stratum-a', label: 'Stratum A (Iron Age II)', depth: '0.5m - 1.2m' },
                        { id: 'stratum-b', label: 'Stratum B (Bronze Age III)', depth: '1.2m - 2.8m' },
                        { id: 'stratum-c', label: 'Stratum C (Neolithic Layer)', depth: '2.8m - 4.5m' },
                      ].map((layer) => (
                        <button
                          key={layer.id}
                          onClick={() => setSelectedLayer(layer.id as any)}
                          className={`w-full text-left px-3 py-2 rounded text-xs transition-all flex justify-between items-center ${
                            selectedLayer === layer.id
                              ? 'bg-amber-600 text-white font-semibold'
                              : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
                          }`}
                        >
                          <span>{layer.label}</span>
                          <span className="text-[10px] opacity-80">{layer.depth}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-800">
                    <label className="text-xs text-slate-400 block">3D Artifact Controls</label>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setArtifactRotation((r) => (r + 45) % 360)}
                        className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 rounded"
                      >
                        Rotate 45°
                      </button>

                      <button 
                        onClick={() => setArchaeologyZoom((z) => (z === 100 ? 130 : 100))}
                        className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 rounded"
                      >
                        Zoom Toggle
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'sel' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Friendship SEL Simulator</span>
                <span className="text-rose-400 font-semibold">Empathy Score: {selScore} pts</span>
              </div>

              <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
                <div className="border-l-4 border-rose-500 pl-4 py-1">
                  <h3 className="text-sm font-bold text-white">{selScenarios[selScenarioIndex].title}</h3>
                  <p className="text-xs text-slate-300 mt-1">{selScenarios[selScenarioIndex].context}</p>
                </div>

                <div className="space-y-2 pt-2">
                  <p className="text-xs text-slate-400 font-medium">Choose an action path:</p>
                  {selScenarios[selScenarioIndex].options.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSelectedEmpathyChoice(idx);
                        setSelScore((s) => Math.min(100, s + opt.score));
                      }}
                      className={`w-full text-left p-3 rounded-lg text-xs transition-all border ${
                        selectedEmpathyChoice === idx
                          ? 'bg-rose-950/80 border-rose-500 text-rose-200'
                          : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{opt.text}</span>
                        {selectedEmpathyChoice === idx && <Check className="w-4 h-4 text-rose-400" />}
                      </div>
                      {selectedEmpathyChoice === idx && (
                        <p className="text-[11px] text-rose-300 mt-2 font-medium bg-rose-900/30 p-2 rounded">
                          Feedback: {opt.feedback}
                        </p>
                      )}
                    </button>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-slate-800">
                  <button
                    onClick={() => {
                      setSelScenarioIndex((idx) => (idx + 1) % selScenarios.length);
                      setSelectedEmpathyChoice(null);
                    }}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-medium flex items-center gap-1.5"
                  >
                    Next Scenario <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => { setSelectedEmpathyChoice(null); setSelScore(85); }}
                    className="text-xs text-slate-400 hover:underline"
                  >
                    Reset SEL Module
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>

        <section className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sliders className="w-5 h-5 text-purple-400" />
              <h2 className="text-lg font-semibold text-white">3-Axis ADHD support panel</h2>
            </div>
            <span className="text-xs bg-purple-950 text-purple-300 border border-purple-800 px-3 py-1 rounded-full font-medium">
              Active Neuroinclusive Settings
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                <Eye className="w-4 h-4 text-purple-400" />
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Axis 1: Visual Pace & Focus</h3>
              </div>

              <div className="space-y-3 pt-1">
                <div className="space-y-1">
                  <label className="text-xs text-slate-400 block">Contrast & Palette</label>
                  <div className="grid grid-cols-3 gap-1">
                    {(['normal', 'high', 'soft'] as const).map((mode) => (
                      <button
                        key={mode}
                        onClick={() => setVisualContrast(mode)}
                        className={`py-1.5 rounded text-[11px] capitalize border ${
                          visualContrast === mode
                            ? 'bg-purple-600 text-white border-purple-400 font-semibold'
                            : 'bg-slate-900 text-slate-400 border-slate-800'
                        }`}
                      >
                        {mode}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-slate-300">Reduce Motion Effects</span>
                  <input
                    type="checkbox"
                    checked={motionReduced}
                    onChange={(e) => setMotionReduced(e.target.checked)}
                    className="accent-purple-500 w-4 h-4 rounded"
                  />
                </div>
              </div>
            </div>

            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                <Shield className="w-4 h-4 text-purple-400" />
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Axis 2: Executive Chunking</h3>
              </div>

              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-300">3-Click Task Chunking</span>
                  <input
                    type="checkbox"
                    checked={chunkingMode}
                    onChange={(e) => setChunkingMode(e.target.checked)}
                    className="accent-purple-500 w-4 h-4 rounded"
                  />
                </div>

                <div className="space-y-1 pt-1">
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Micro-Step Focus Timer</span>
                    <span className="text-purple-300 font-bold">{microTimerMinutes} min</span>
                  </div>
                  <input
                    type="range" min="1" max="15" value={microTimerMinutes}
                    onChange={(e) => setMicroTimerMinutes(Number(e.target.value))}
                    className="w-full accent-purple-500"
                  />
                </div>
              </div>
            </div>

            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                <Zap className="w-4 h-4 text-purple-400" />
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Axis 3: Engagement Anchors</h3>
              </div>

              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-300">Tactile Fidget Overlay</span>
                  <input
                    type="checkbox"
                    checked={tactileFidgetMode}
                    onChange={(e) => setTactileFidgetMode(e.target.checked)}
                    className="accent-purple-500 w-4 h-4 rounded"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-slate-400 block">Focus Soundscape</label>
                  <select
                    value={focusSoundscape}
                    onChange={(e) => setFocusSoundscape(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-800 rounded text-xs py-1.5 px-2 text-slate-200 focus:outline-none focus:border-purple-500"
                  >
                    <option value="none">Off</option>
                    <option value="white">White Noise</option>
                    <option value="nature">Nature Streams</option>
                    <option value="binaural">Binaural 40Hz Focus</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
