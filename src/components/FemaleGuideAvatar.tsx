import React, { useState } from 'react';
import { Volume2, VolumeX, Sparkles, HelpCircle } from 'lucide-react';
import { narrationService } from '../services/narrationService';
import { audioService } from '../services/audioService';

interface FemaleGuideAvatarProps {
  currentStoryText: string;
  noaAdvice: string;
  isSpeaking: boolean;
  onToggleSpeech: () => void;
}

export const FemaleGuideAvatar: React.FC<FemaleGuideAvatarProps> = ({
  currentStoryText,
  noaAdvice,
  isSpeaking,
  onToggleSpeech,
}) => {
  const [showBubble, setShowBubble] = useState(true);
  const [bubbleContent, setBubbleContent] = useState<'story' | 'advice'>('story');

  const handleAdviceClick = () => {
    audioService.playClick();
    setBubbleContent('advice');
    setShowBubble(true);
    narrationService.speakNoaAdvice(noaAdvice);
  };

  const handleReadStory = () => {
    audioService.playClick();
    setBubbleContent('story');
    setShowBubble(true);
    onToggleSpeech();
  };

  return (
    <div className="relative flex items-end gap-3 bg-gradient-to-r from-purple-950/80 via-indigo-950/80 to-blue-950/80 border-2 border-cyan-400/60 rounded-3xl p-3 shadow-xl backdrop-blur-md">
      
      {/* Animated Disney-Style Female Character: Noa (נוֹעָה) */}
      <div className="relative flex-shrink-0 cursor-pointer group" onClick={handleReadStory} title="לַחֲצוּ כְּדֵי שֶׁנּוֹעָה תַּקְרִיא לָכֶם!">
        
        {/* Glow halo behind Noa */}
        <div className={`absolute -inset-2 rounded-full filter blur-md transition-all duration-300 ${
          isSpeaking ? 'bg-gradient-to-r from-amber-400/50 to-cyan-400/60 opacity-100 scale-105' : 'bg-cyan-500/20 opacity-50'
        }`} />

        {/* Character Avatar SVG */}
        <div className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-full border-3 border-amber-300 bg-gradient-to-b from-sky-200 to-indigo-100 overflow-hidden shadow-[0_8px_20px_rgba(0,0,0,0.5)] ${
          isSpeaking ? 'avatar-talking' : ''
        }`}>
          <svg viewBox="0 0 120 120" className="w-full h-full">
            <defs>
              <linearGradient id="hairGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#7c3f00" />
                <stop offset="100%" stopColor="#4a2200" />
              </linearGradient>
              <linearGradient id="skinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ffdfc4" />
                <stop offset="100%" stopColor="#f5cba7" />
              </linearGradient>
              <linearGradient id="dressGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2dd4bf" />
                <stop offset="100%" stopColor="#0284c7" />
              </linearGradient>
            </defs>

            {/* Background sparkle behind head */}
            <circle cx="60" cy="60" r="56" fill="#e0f2fe" opacity="0.6" />

            {/* Back Hair */}
            <path d="M 28 55 C 22 85 30 115 42 120 L 78 120 C 90 115 98 85 92 55 Z" fill="url(#hairGrad)" />

            {/* Neck & Shoulders */}
            <path d="M 52 75 L 68 75 L 72 90 L 48 90 Z" fill="url(#skinGrad)" />
            <path d="M 32 90 C 44 84 76 84 88 90 L 98 120 L 22 120 Z" fill="url(#dressGrad)" />

            {/* Golden Star Collar Accent */}
            <polygon points="60,86 62,91 67,91 63,94 65,99 60,96 55,99 57,94 53,91 58,91" fill="#facc15" />

            {/* Head */}
            <ellipse cx="60" cy="52" rx="26" ry="29" fill="url(#skinGrad)" />

            {/* Rosy Cheeks */}
            <ellipse cx="44" cy="62" rx="5" ry="3" fill="#fb7185" opacity="0.55" />
            <ellipse cx="76" cy="62" rx="5" ry="3" fill="#fb7185" opacity="0.55" />

            {/* Disney Big Expressive Eyes */}
            {/* Left Eye */}
            <ellipse cx="48" cy="51" rx="5.5" ry="6.5" fill="#ffffff" />
            <ellipse cx="48.5" cy="51.5" rx="3.6" ry="4.5" fill="#1e3a8a" />
            <circle cx="47" cy="49.5" r="1.6" fill="#ffffff" />
            <circle cx="50" cy="53" r="0.8" fill="#ffffff" />
            <path d="M 42 44 Q 48 41 54 44" stroke="#4a2200" strokeWidth="1.8" fill="none" strokeLinecap="round" />

            {/* Right Eye */}
            <ellipse cx="72" cy="51" rx="5.5" ry="6.5" fill="#ffffff" />
            <ellipse cx="71.5" cy="51.5" rx="3.6" ry="4.5" fill="#1e3a8a" />
            <circle cx="70" cy="49.5" r="1.6" fill="#ffffff" />
            <circle cx="73" cy="53" r="0.8" fill="#ffffff" />
            <path d="M 66 44 Q 72 41 78 44" stroke="#4a2200" strokeWidth="1.8" fill="none" strokeLinecap="round" />

            {/* Cute Nose */}
            <path d="M 60 55 Q 61 58 58 59" stroke="#d97706" strokeWidth="1.2" fill="none" strokeLinecap="round" />

            {/* Mouth: Changes dynamically when talking! */}
            {isSpeaking ? (
              <path d="M 54 66 Q 60 76 66 66 Z" fill="#e11d48" className="avatar-mouth-moving" />
            ) : (
              <path d="M 54 66 Q 60 72 66 66" stroke="#e11d48" strokeWidth="2.2" fill="none" strokeLinecap="round" />
            )}

            {/* Front Bangs & Disney Hair Styling */}
            <path d="M 34 46 C 40 30 75 26 86 44 C 74 36 62 42 58 48 C 50 38 42 42 34 46 Z" fill="url(#hairGrad)" />

            {/* Cute Hair Flower Barrette */}
            <circle cx="36" cy="36" r="4.5" fill="#f43f5e" />
            <circle cx="36" cy="36" r="2" fill="#fde047" />
          </svg>
        </div>

        {/* Small character badge */}
        <div className="absolute -bottom-1.5 right-1/2 translate-x-1/2 bg-amber-400 border border-white text-amber-950 text-[11px] font-bold px-2 py-0.5 rounded-full shadow whitespace-nowrap nikud-text flex items-center gap-1">
          <span>נוֹעָה</span>
          {isSpeaking && <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />}
        </div>
      </div>

      {/* Speech & Controls Area */}
      <div className="flex-grow flex flex-col justify-center">
        
        {/* Name, Guide Role and ElevenLabs Voice Badge */}
        <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-amber-300 font-bold text-sm sm:text-base nikud-text">
              נוֹעָה הַמַּדְרִיכָה
            </span>
            <span className="text-[11px] text-cyan-200 bg-cyan-900/60 px-2 py-0.5 rounded-full border border-cyan-400/40 nikud-text">
              קול: ElevenLabs (fuMEGqYpFlKTER3VqptM) ✨
            </span>
          </div>

          <button
            onClick={() => setShowBubble(!showBubble)}
            className="text-xs text-cyan-300 hover:text-white underline nikud-text"
          >
            {showBubble ? 'הַסְתֵּר בּוּעָה' : 'הַצֵּג בּוּעָה'}
          </button>
        </div>

        {/* Interactive Speech Bubble */}
        {showBubble && (
          <div className="relative bg-white/95 text-indigo-950 p-2.5 sm:p-3 rounded-2xl rounded-tr-none border-2 border-cyan-300 shadow-md text-xs sm:text-sm nikud-text mb-2">
            <p className="font-medium leading-relaxed">
              {bubbleContent === 'advice' ? (
                <span>
                  💡 <strong>עֵצָה מִנּוֹעָה:</strong> {noaAdvice}
                </span>
              ) : (
                <span>
                  {isSpeaking ? '🗣️ מַקְרִיאָה עַכְשָׁו: ' : '✨ '}
                  {currentStoryText.slice(0, 140)}...
                </span>
              )}
            </p>
          </div>
        )}

        {/* Action Buttons: Play/Stop + Noa's Hint */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleReadStory}
            className={`disney-btn font-bold px-3.5 py-1.5 rounded-xl text-xs sm:text-sm flex items-center gap-1.5 transition-all ${
              isSpeaking
                ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-white'
                : 'bg-gradient-to-r from-cyan-400 to-sky-500 text-sky-950'
            }`}
          >
            {isSpeaking ? (
              <>
                <VolumeX className="w-4 h-4" />
                <span className="nikud-text">עֲצוֹר הַקְרָאָה</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4" />
                <span className="nikud-text">נוֹעָה, הַקְרִיאִי לִי! 🔊</span>
              </>
            )}
          </button>

          <button
            onClick={handleAdviceClick}
            className="disney-btn bg-amber-300 hover:bg-amber-200 text-amber-950 font-bold px-3 py-1.5 rounded-xl text-xs sm:text-sm flex items-center gap-1"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span className="nikud-text">רֶמֶז מִנּוֹעָה 💡</span>
          </button>
        </div>

      </div>

    </div>
  );
};
