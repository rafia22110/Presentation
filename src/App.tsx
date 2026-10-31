import React, { useState } from 'react';
import { pantryData } from './data/pantryData';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'liveStage' | 'studio' | 'manifesto' | 'library'>('liveStage');
  const [selectedNotebook, setSelectedNotebook] = useState<string | null>('5e674188-c91b-45f1-9b5b-3fe62c291e0f');

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans">
      <header className="border-b border-slate-700 bg-slate-800 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-wide text-indigo-400">EduHolo Studio</h1>
          <nav className="flex space-x-4 rtl:space-x-reverse">
            <button
              onClick={() => setActiveTab('liveStage')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                activeTab === 'liveStage' ? 'bg-indigo-600 text-white' : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
              }`}
            >
              במת השיעור החיה
            </button>
            <button
              onClick={() => setActiveTab('studio')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                activeTab === 'studio' ? 'bg-indigo-600 text-white' : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
              }`}
            >
              אולפן 3 הלחיצות (NotebookLM)
            </button>
            <button
              onClick={() => setActiveTab('manifesto')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                activeTab === 'manifesto' ? 'bg-indigo-600 text-white' : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
              }`}
            >
              מניפסט הרכזות
            </button>
            <button
              onClick={() => setActiveTab('library')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                activeTab === 'library' ? 'bg-indigo-600 text-white' : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
              }`}
            >
              הספרייה הבית-ספרית
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        {activeTab === 'liveStage' && (
          <section className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
            <h2 className="text-xl font-bold text-indigo-300 mb-4">במת השיעור החיה - EduHolo Live Stage</h2>
            <p className="text-slate-300 mb-6">סביבת הדגמה הולוגרפית אינטראקטיבית להוראה מותאמת אישית ולניהול קשב multipolar.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                <h3 className="font-semibold text-indigo-400">Sensory Input Modulation</h3>
                <p className="text-sm text-slate-400 mt-2">{pantryData.adhd3AxisMatrix.sensory}</p>
              </div>
              <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                <h3 className="font-semibold text-indigo-400">Cognitive Load Distribution</h3>
                <p className="text-sm text-slate-400 mt-2">{pantryData.adhd3AxisMatrix.cognitive}</p>
              </div>
              <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                <h3 className="font-semibold text-indigo-400">Emotional Regulation</h3>
                <p className="text-sm text-slate-400 mt-2">{pantryData.adhd3AxisMatrix.emotional}</p>
              </div>
            </div>
          </section>
        )}

        {activeTab === 'studio' && (
          <section className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
            <h2 className="text-xl font-bold text-indigo-300 mb-4">אולפן 3 הלחיצות עם זרימת NotebookLM</h2>
            <p className="text-slate-300 mb-4">חיבור ישיר למחברות מחקר ולמידה של NotebookLM, כולל עקיפת כשל Tokenization (BPE Blindness).</p>

            <div className="mb-6 p-4 bg-amber-950/40 border border-amber-600/50 rounded-lg">
              <h3 className="font-bold text-amber-400">{pantryData.bpeBlindnessExplanation.topic}</h3>
              <p className="text-sm text-slate-300 mt-1"><strong>Strawberry Issue:</strong> {pantryData.bpeBlindnessExplanation.strawberryExplanation}</p>
              <p className="text-sm text-slate-300 mt-1"><strong>9.11 vs 9.9 Issue:</strong> {pantryData.bpeBlindnessExplanation.numericalComparison}</p>
              <p className="text-sm text-emerald-400 mt-1"><strong>Workaround:</strong> {pantryData.bpeBlindnessExplanation.workaround}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pantryData.notebookLmCatalog.map((nb) => (
                <div
                  key={nb.id}
                  onClick={() => setSelectedNotebook(nb.notebookId)}
                  className={`p-4 rounded-lg border cursor-pointer transition ${
                    selectedNotebook === nb.notebookId ? 'border-indigo-500 bg-indigo-950/50' : 'border-slate-700 bg-slate-900'
                  }`}
                >
                  <h4 className="font-semibold text-indigo-300">{nb.title}</h4>
                  <p className="text-xs text-slate-400 mt-1">ID: {nb.notebookId}</p>
                  <p className="text-sm text-slate-300 mt-2">{nb.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === 'manifesto' && (
          <section className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
            <h2 className="text-xl font-bold text-indigo-300 mb-4">מניפסט הרכזות הבית-ספרי (EOS Coordinator Manifesto)</h2>
            {pantryData.coordinatorManifestos.map((m) => (
              <div key={m.id} className="mb-6 p-4 bg-slate-900 rounded-lg border border-slate-700">
                <h3 className="text-lg font-bold text-indigo-400">{m.title}</h3>
                <p className="text-sm text-slate-400 mt-1">{m.role}</p>
                <p className="text-slate-300 mt-2">{m.summary}</p>
              </div>
            ))}

            <h3 className="font-bold text-slate-200 mb-3">לוח 53 השבועות של מרחבים (Merhavim Calendar 53 Weeks)</h3>
            <div className="max-h-64 overflow-y-auto space-y-2 pr-2">
              {pantryData.merhavimCalendarWeeks.map((week) => (
                <div key={week.weekNumber} className="p-3 bg-slate-900 rounded border border-slate-800 text-sm flex justify-between">
                  <span className="font-semibold text-indigo-300">{week.topic}</span>
                  <span className="text-slate-400">{week.focus}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === 'library' && (
          <section className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
            <h2 className="text-xl font-bold text-indigo-300 mb-4">הספרייה הבית-ספרית (Combinatorial Tech Stack Library)</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {pantryData.techStackDefinitions.map((tech) => (
                <div key={tech.id} className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold text-indigo-400">{tech.name}</h3>
                    {tech.size && <span className="text-xs bg-indigo-900 text-indigo-200 px-2 py-1 rounded">{tech.size}</span>}
                  </div>
                  <span className="text-xs text-slate-400 block mb-2">{tech.category}</span>
                  <p className="text-sm text-slate-300">{tech.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default App;
