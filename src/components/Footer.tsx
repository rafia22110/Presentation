import React from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { audioService } from '../services/audioService';

interface FooterProps {
  currentSlideIndex: number;
  totalSlides: number;
  onPrev: () => void;
  onNext: () => void;
  onSelectSlide: (index: number) => void;
}

export const Footer: React.FC<FooterProps> = ({
  currentSlideIndex,
  totalSlides,
  onPrev,
  onNext,
  onSelectSlide,
}) => {
  return (
    <footer className="max-w-6xl w-full mx-auto mt-3 relative z-10">
      <div className="flex items-center justify-between bg-amber-950/85 border-3 border-amber-400 rounded-2xl p-2.5 sm:p-3 shadow-lg backdrop-blur-md">
        
        {/* Previous Button */}
        <button
          onClick={() => {
            audioService.playClick();
            onPrev();
          }}
          disabled={currentSlideIndex === 0}
          className="disney-btn bg-amber-400 hover:bg-amber-300 disabled:opacity-40 disabled:hover:scale-100 disabled:cursor-not-allowed text-amber-950 font-bold px-4 sm:px-5 py-2 rounded-xl flex items-center gap-1.5 text-base sm:text-lg"
        >
          <ChevronRight className="w-5 h-5" />
          <span className="nikud-text">הַקּוֹדֵם</span>
        </button>

        {/* Progress dots */}
        <div className="hidden sm:flex items-center gap-2">
          {Array.from({ length: totalSlides }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                audioService.playClick();
                onSelectSlide(idx);
              }}
              className={`h-3 rounded-full transition-all ${
                currentSlideIndex === idx
                  ? 'w-8 bg-amber-400 shadow-[0_0_10px_#f59e0b]'
                  : 'w-3 bg-amber-800/80 hover:bg-amber-600'
              }`}
              title={`עֲבֹר לְשִׁקּוּפִית ${idx === 8 ? 'מִשְׂחָק' : idx}`}
            />
          ))}
        </div>

        {/* Next Button */}
        <button
          onClick={() => {
            audioService.playClick();
            onNext();
          }}
          disabled={currentSlideIndex === totalSlides - 1}
          className="disney-btn bg-emerald-400 hover:bg-emerald-300 disabled:opacity-40 disabled:hover:scale-100 disabled:cursor-not-allowed text-emerald-950 font-bold px-5 sm:px-6 py-2 rounded-xl flex items-center gap-1.5 text-base sm:text-lg"
        >
          <span className="nikud-text">הַבָּא</span>
          <ChevronLeft className="w-5 h-5" />
        </button>

      </div>
    </footer>
  );
};
