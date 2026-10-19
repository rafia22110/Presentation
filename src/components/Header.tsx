import React from 'react';
import { Volume2, VolumeX, Music, Star, BookOpen } from 'lucide-react';
import { ViewMode } from '../types';
import { audioService } from '../services/audioService';

interface HeaderProps {
  stars: number;
  isMuted: boolean;
  onToggleMute: () => void;
  isBgmPlaying: boolean;
  onToggleBgm: () => void;
  viewMode: ViewMode;
  onChangeViewMode: (mode: ViewMode) => void;
  onOpenDictionary: () => void;
  isDictionaryActive: boolean;
  isSpeaking: boolean;
  onSpeakCurrent: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  stars,
  isMuted,
  onToggleMute,
  isBgmPlaying,
  onToggleBgm,
  viewMode,
  onChangeViewMode,
  onOpenDictionary,
  isDictionaryActive,
  isSpeaking,
  onSpeakCurrent,
}) => {
  return (
    <header className="max-w-6xl w-full mx-auto mb-3 relative z-10">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-3 bg-indigo-950/80 border-2 border-cyan-400/60 rounded-3xl p-3.5 shadow-[0_15px_35px_rgba(0,0,0,0.6),0_0_20px_rgba(0,242,254,0.2)] backdrop-blur-xl">
        
        {/* Brand & Title */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-300 via-amber-300 to-amber-500 border-2 border-white flex items-center justify-center shadow-[0_0_20px_rgba(0,242,254,0.6)] text-2xl flex-shrink-0">
            🔮
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-cyan-200 to-amber-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] nikud-text">
              בְּרִיאַת הָעוֹלָם - הוֹלוֹגְרָמָה 3D
            </h1>
            <p className="text-cyan-100 text-xs sm:text-sm nikud-text">
              מַסָּע עֲתִידָנִי קָסוּם בְּסֵפֶר בְּרֵאשִׁית לְתַלְמִידֵי כִּתָּה ב' ✨
            </p>
          </div>
        </div>

        {/* Dictionary Button, Read to Me Button, View Mode, Audio Controls & Stars */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          
          {/* Genesis Dictionary Button */}
          <button
            onClick={() => {
              audioService.playClick();
              onOpenDictionary();
            }}
            className={`disney-btn font-bold px-3.5 py-2 rounded-2xl flex items-center gap-1.5 text-sm sm:text-base transition-all ${
              isDictionaryActive
                ? 'bg-gradient-to-b from-cyan-300 to-cyan-500 text-slate-950 ring-3 ring-white'
                : 'bg-gradient-to-b from-amber-300 to-amber-500 text-amber-950'
            }`}
          >
            <span>📖</span>
            <span className="nikud-text">מִלּוֹן בְּרֵאשִׁית</span>
          </button>

          {/* Read Current Slide / Dictionary with Noa's Voice */}
          <button
            onClick={() => {
              audioService.playClick();
              onSpeakCurrent();
            }}
            className={`disney-btn font-bold px-3.5 py-2 rounded-2xl flex items-center gap-1.5 text-sm sm:text-base transition-all ${
              isSpeaking
                ? 'bg-gradient-to-b from-rose-400 to-rose-600 text-white ring-2 ring-rose-200'
                : 'bg-gradient-to-b from-cyan-300 to-sky-500 text-sky-950'
            }`}
          >
            <span>{isSpeaking ? '⏹️' : '🔊'}</span>
            <span className="nikud-text">{isSpeaking ? 'עֲצוֹר הַקְרָאָה' : 'הַקְרֵא לִי (נוֹעָה)'}</span>
          </button>

          {/* View mode buttons: 3D / Pixel / Both */}
          <div className="bg-indigo-900/90 border border-cyan-400/50 p-1 rounded-2xl flex items-center gap-1 shadow-inner">
            <button
              onClick={() => {
                audioService.playClick();
                onChangeViewMode('3d');
              }}
              className={`px-2.5 py-1 rounded-xl text-xs sm:text-sm font-bold transition-all nikud-text ${
                viewMode === '3d'
                  ? 'bg-cyan-400 text-cyan-950 shadow'
                  : 'text-cyan-200 hover:text-white'
              }`}
            >
              🔮 תְּלַת-מְמַד
            </button>

            <button
              onClick={() => {
                audioService.playClick();
                onChangeViewMode('pixel');
              }}
              className={`px-2.5 py-1 rounded-xl text-xs sm:text-sm font-bold transition-all nikud-text ${
                viewMode === 'pixel'
                  ? 'bg-amber-400 text-amber-950 shadow'
                  : 'text-cyan-200 hover:text-white'
              }`}
            >
              🎨 פִּיקְסֶל
            </button>

            <button
              onClick={() => {
                audioService.playClick();
                onChangeViewMode('both');
              }}
              className={`px-2.5 py-1 rounded-xl text-xs sm:text-sm font-bold transition-all nikud-text hidden sm:block ${
                viewMode === 'both'
                  ? 'bg-purple-400 text-white shadow'
                  : 'text-cyan-200 hover:text-white'
              }`}
            >
              ✨ מְשֻׁלָּב
            </button>
          </div>

          {/* Background Music Toggle */}
          <button
            onClick={() => {
              audioService.playClick();
              onToggleBgm();
            }}
            className={`disney-btn px-3 py-1.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-1.5 ${
              isBgmPlaying
                ? 'bg-gradient-to-r from-emerald-400 to-teal-500 text-teal-950'
                : 'bg-indigo-900/80 text-cyan-200 border-cyan-400/40'
            }`}
            title="מוּזִיקַת רֶקַע קְסוּמָה"
          >
            <Music className="w-3.5 h-3.5" />
            <span className="nikud-text hidden md:inline">{isBgmPlaying ? 'מוּזִיקָה: פְּעִילָה' : 'מוּזִיקָה'}</span>
          </button>

          {/* Sound Mute Toggle */}
          <button
            onClick={() => {
              onToggleMute();
            }}
            className="disney-btn bg-indigo-900/80 text-cyan-200 border-cyan-400/40 p-2 rounded-2xl"
            title={isMuted ? 'הַפְעֵל צְלִילִים' : 'הַשְׁתֵּק צְלִילִים'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-cyan-300" />}
          </button>

          {/* Stars counter */}
          <div className="bg-indigo-900/90 border-2 border-cyan-400/70 px-3.5 py-1.5 rounded-2xl flex items-center gap-1.5 text-amber-200 font-bold text-sm sm:text-base shadow-[inset_0_2px_8px_rgba(0,0,0,0.6)]">
            <Star className="w-4 h-4 text-amber-400 fill-amber-300" />
            <span className="nikud-text">כּוֹכָבִים:</span>
            <span className="text-cyan-300 text-lg sm:text-xl font-extrabold">{stars}</span>
          </div>

        </div>

      </div>
    </header>
  );
};
