import React from 'react';
import { Check } from 'lucide-react';
import { slidesData } from '../data/slidesData';
import { audioService } from '../services/audioService';

interface NavigationProps {
  currentSlideIndex: number;
  onSelectSlide: (index: number) => void;
  answeredSlides: Set<number>;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentSlideIndex,
  onSelectSlide,
  answeredSlides,
}) => {
  const handleClick = (idx: number) => {
    audioService.playClick();
    onSelectSlide(idx);
  };

  return (
    <nav className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2 w-full mt-2">
      {slidesData.map((slide, idx) => {
        const isActive = currentSlideIndex === idx;
        const isDone = answeredSlides.has(idx);

        return (
          <button
            key={slide.id}
            onClick={() => handleClick(idx)}
            className={`disney-btn font-bold py-2 px-1.5 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-1 transition-all nikud-text ${
              isActive
                ? 'bg-amber-400 text-amber-950 active-tab ring-3 ring-amber-200'
                : 'bg-amber-100 hover:bg-amber-200 text-amber-950'
            }`}
          >
            <span>{slide.emoji}</span>
            <span>{slide.navLabel}</span>
            {isDone && <Check className="w-3.5 h-3.5 text-emerald-700 stroke-[3]" />}
          </button>
        );
      })}

      {/* 9th Button: Summary Game */}
      <button
        onClick={() => handleClick(8)}
        className={`disney-btn font-bold py-2 px-1.5 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-1 transition-all nikud-text ${
          currentSlideIndex === 8
            ? 'bg-purple-500 text-white active-tab ring-3 ring-purple-300'
            : 'bg-gradient-to-r from-purple-400 to-pink-400 text-white hover:brightness-105'
        }`}
      >
        <span>🎮</span>
        <span>מִשְׂחָק!</span>
      </button>
    </nav>
  );
};
