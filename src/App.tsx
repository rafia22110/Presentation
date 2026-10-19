/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { slidesData, dictionaryWords, gameQuestions } from './data/slidesData';
import { ViewMode, DictionaryWord } from './types';
import { audioService } from './services/audioService';
import { narrationService } from './services/narrationService';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { ThreeCanvas } from './components/ThreeCanvas';
import { PixelCanvas } from './components/PixelCanvas';
import { FemaleGuideAvatar } from './components/FemaleGuideAvatar';
import { MiniQuiz } from './components/MiniQuiz';
import { SummaryGame } from './components/SummaryGame';
import { DictionaryModule } from './components/DictionaryModule';
import { Footer } from './components/Footer';

export default function App() {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [stars, setStars] = useState(0);
  const [answeredSlides, setAnsweredSlides] = useState<Set<number>>(new Set());
  const [magicBurst, setMagicBurst] = useState(0);
  const [viewMode, setViewMode] = useState<ViewMode>('3d');
  const [isMuted, setIsMuted] = useState(false);
  const [isBgmPlaying, setIsBgmPlaying] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedQuickWord, setSelectedQuickWord] = useState<DictionaryWord | null>(null);

  // Sync speech state from narrationService
  useEffect(() => {
    const unsubscribe = narrationService.addStateListener((speaking) => {
      setIsSpeaking(speaking);
    });
    return () => unsubscribe();
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.tagName === 'INPUT') return;
      if (e.key === 'ArrowLeft') {
        goToNextSlide();
      } else if (e.key === 'ArrowRight') {
        goToPrevSlide();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  const goToSlide = useCallback((index: number) => {
    narrationService.stop();
    setSelectedQuickWord(null);
    setCurrentSlideIndex(index);
    audioService.playMagicChime();
  }, []);

  const goToNextSlide = () => {
    if (currentSlideIndex < 9) {
      goToSlide(currentSlideIndex + 1);
    }
  };

  const goToPrevSlide = () => {
    if (currentSlideIndex > 0) {
      goToSlide(currentSlideIndex - 1);
    }
  };

  const handleMagicClick = () => {
    audioService.playMagicBurst();
    setMagicBurst(35);
    setTimeout(() => setMagicBurst(0), 1200);
  };

  const handleToggleSpeech = () => {
    if (isSpeaking) {
      narrationService.stop();
      return;
    }

    if (currentSlideIndex === 9) {
      narrationService.speakFullDictionary(dictionaryWords);
    } else if (currentSlideIndex === 8) {
      const q = gameQuestions[0];
      narrationService.speak(`מִשְׂחַק אֲלוּפֵי הַבְּרִיאָה! בְּאֵיזֶה יוֹם נִבְרָא: ${q.name}?`);
    } else {
      const slide = slidesData[currentSlideIndex];
      if (slide) {
        const textToRead = `${slide.badge}. ${slide.title}. ${slide.verse}. ${slide.story}`;
        narrationService.speak(textToRead, undefined, undefined, slide.id);
      }
    }
  };

  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    audioService.setMuted(nextMuted);
    if (nextMuted) {
      setIsBgmPlaying(false);
    }
  };

  const handleToggleBgm = () => {
    const playing = audioService.toggleBackgroundMusic();
    setIsBgmPlaying(playing);
  };

  const handleCorrectAnswer = (dayId: number) => {
    if (!answeredSlides.has(dayId)) {
      setAnsweredSlides((prev) => new Set(prev).add(dayId));
      setStars((prev) => prev + 1);
    }
    handleMagicClick();
  };

  const handleGameEarnStar = () => {
    setStars((prev) => prev + 1);
    handleMagicClick();
  };

  const currentSlide = slidesData[currentSlideIndex] || slidesData[0];
  const isGameView = currentSlideIndex === 8;
  const isDictionaryView = currentSlideIndex === 9;

  // Words relevant to the current day slide
  const currentDayWords = useMemo(() => {
    if (isGameView || isDictionaryView) return [];
    return dictionaryWords.filter(
      (w) =>
        w.day === currentSlide.id ||
        (currentSlide.id === 1 && w.word === 'תֹהוּ וָבֹהוּ') ||
        (currentSlide.id === 2 && w.word === 'וַיַּבְדֵּל')
    );
  }, [currentSlide.id, isGameView, isDictionaryView]);

  const handleSelectQuickWord = (wordObj: DictionaryWord) => {
    audioService.playMagicChime();
    setSelectedQuickWord(wordObj);
    narrationService.speakDictionaryWord(wordObj);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between p-2 sm:p-4 md:p-6 relative overflow-x-hidden">
      
      {/* Liquid 3D floating background orbs */}
      <div className="liquid-bg-orb w-80 h-80 bg-cyan-500/40 top-6 -right-16" />
      <div className="liquid-bg-orb w-96 h-96 bg-purple-600/40 bottom-8 -left-20" style={{ animationDelay: '-5s' }} />
      <div className="liquid-bg-orb w-72 h-72 bg-amber-400/30 top-1/3 left-1/3" style={{ animationDelay: '-9s' }} />

      {/* Header with App Title, Dictionary button, Noa TTS button, Audio Controls & Star Count */}
      <Header
        stars={stars}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        isBgmPlaying={isBgmPlaying}
        onToggleBgm={handleToggleBgm}
        viewMode={viewMode}
        onChangeViewMode={setViewMode}
        onOpenDictionary={() => goToSlide(9)}
        isDictionaryActive={isDictionaryView}
        isSpeaking={isSpeaking}
        onSpeakCurrent={handleToggleSpeech}
      />

      {/* Navigation Bar (Days 0-7 + Game + Dictionary) */}
      <div className="max-w-6xl w-full mx-auto relative z-10 mb-2">
        <Navigation
          currentSlideIndex={currentSlideIndex}
          onSelectSlide={goToSlide}
          answeredSlides={answeredSlides}
        />
      </div>

      {/* Main Interactive Disney Frame */}
      <main className="max-w-6xl w-full mx-auto flex-grow flex items-center justify-center my-1 relative z-10">
        <div className="disney-frame w-full p-4 sm:p-6 md:p-7">
          
          {isDictionaryView ? (
            /* Genesis Difficult Words Dictionary Module (Slide 9) */
            <DictionaryModule isSpeaking={isSpeaking} />
          ) : isGameView ? (
            /* Summary Game Module (Slide 8) */
            <SummaryGame
              onEarnStar={handleGameEarnStar}
              onGoToDay={goToSlide}
            />
          ) : (
            /* Slide Learning View (Slides 0-7) */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              
              {/* Left Column: Visual Canvas (3D and/or Pixel) + Female Guide Avatar Noa */}
              <div className="lg:col-span-7 flex flex-col space-y-3.5">
                
                {/* 3D or Pixel Display Container */}
                <div className="relative w-full">
                  {viewMode === '3d' && (
                    <ThreeCanvas
                      dayIndex={currentSlide.id}
                      magicBurst={magicBurst}
                      onMagicClick={handleMagicClick}
                      dayBadge={currentSlide.badge}
                      holoTitle={currentSlide.holoTitle}
                    />
                  )}

                  {viewMode === 'pixel' && (
                    <div className="relative w-full aspect-[4/3] bg-slate-950 rounded-3xl border-4 border-amber-400/80 shadow-[0_20px_50px_rgba(0,0,0,0.75),0_0_30px_rgba(255,215,0,0.3)] overflow-hidden">
                      <PixelCanvas
                        dayIndex={currentSlide.id}
                        magicBurst={magicBurst}
                      />
                      <div className="absolute top-3 right-3 bg-gradient-to-r from-amber-300 to-amber-400 text-amber-950 border-2 border-white font-bold px-3.5 py-1 rounded-2xl text-sm sm:text-base shadow-lg nikud-text">
                        {currentSlide.badge}
                      </div>
                    </div>
                  )}

                  {viewMode === 'both' && (
                    <div className="grid grid-cols-2 gap-2">
                      <div className="relative aspect-square">
                        <ThreeCanvas
                          dayIndex={currentSlide.id}
                          magicBurst={magicBurst}
                          onMagicClick={handleMagicClick}
                          dayBadge="3D"
                          holoTitle={currentSlide.holoTitle}
                        />
                      </div>
                      <div className="relative aspect-square bg-slate-950 rounded-3xl border-3 border-amber-400/80 overflow-hidden">
                        <PixelCanvas
                          dayIndex={currentSlide.id}
                          magicBurst={magicBurst}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* 3D interaction guide hint */}
                <p className="text-indigo-950 font-semibold text-xs sm:text-sm text-center nikud-text bg-cyan-100/90 border border-cyan-300 px-4 py-1.5 rounded-full shadow-sm">
                  🖐️ סוֹבְבוּ אֶת הַהוֹלוֹגְרָמָה הַתְּלַת-מְמַדִּית עִם הָעַכְבָּר אוֹ הָאֶצְבַּע! לַחֲצוּ עַל אֲלוּמַת קֶסֶם!
                </p>

                {/* Female Guide Character Avatar: Noa */}
                <FemaleGuideAvatar
                  currentStoryText={currentSlide.story}
                  noaAdvice={currentSlide.noaAdvice}
                  isSpeaking={isSpeaking}
                  onToggleSpeech={handleToggleSpeech}
                />

              </div>

              {/* Right Column: Content, Biblical Torah Verse, Story, Difficult Words & Mini Quiz */}
              <div className="lg:col-span-5 flex flex-col justify-between space-y-3">
                
                {/* Title & Emoji Card */}
                <div className="bg-gradient-to-br from-white/95 to-sky-50/90 border-2 border-white/90 rounded-2xl p-3.5 shadow-sm">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-cyan-800 font-bold text-sm sm:text-base nikud-text">
                      {currentSlide.subTitle}
                    </span>
                    <span className="text-3xl drop-shadow">{currentSlide.emoji}</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-indigo-950 nikud-text">
                    {currentSlide.title}
                  </h2>
                </div>

                {/* Torah Scroll Verse */}
                <div className="torah-scroll p-3 sm:p-3.5 text-center">
                  <div className="text-xs font-bold text-amber-800 mb-0.5 nikud-text">
                    📖 מִתּוֹךְ סֵפֶר בְּרֵאשִׁית:
                  </div>
                  <p className="text-base sm:text-lg md:text-xl font-bold text-amber-950 nikud-text leading-relaxed">
                    "{currentSlide.verse}"
                  </p>
                </div>

                {/* Story Explanation + Created Items + Per-Day Difficult Words Popup */}
                <div className="bg-gradient-to-br from-white/95 to-slate-50/90 border border-cyan-200/80 rounded-2xl p-3.5 shadow-sm">
                  <p className="text-base sm:text-lg text-slate-800 font-medium nikud-text leading-relaxed">
                    {currentSlide.story}
                  </p>
                  
                  {/* Created items badges */}
                  <div className="mt-3 pt-2.5 border-t border-cyan-200/60 flex flex-wrap gap-1.5">
                    {currentSlide.createdItems.map((item, idx) => (
                      <span
                        key={idx}
                        className="bg-amber-200/80 border border-amber-400 text-amber-950 font-bold px-2.5 py-0.5 rounded-xl text-xs sm:text-sm nikud-text"
                      >
                        {item}
                      </span>
                    ))}
                  </div>

                  {/* Difficult Words of the Day (Click to open immediate explanation + Noa narration) */}
                  {currentDayWords.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-amber-300/70">
                      <div className="text-xs sm:text-sm font-bold text-indigo-900 mb-1.5 flex items-center justify-between nikud-text">
                        <span>🔍 מִלִּים חֲדָשׁוֹת בַּיּוֹם הַזֶּה (לִחֲצוּ לְפֵרוּשׁ):</span>
                        <button
                          onClick={() => goToSlide(9)}
                          className="text-cyan-700 hover:text-cyan-900 underline text-xs font-bold cursor-pointer"
                        >
                          לְכָל הַמִּלּוֹן ⬅️
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        {currentDayWords.map((wObj) => {
                          const isSelected = selectedQuickWord?.id === wObj.id;
                          return (
                            <button
                              key={wObj.id}
                              onClick={() => handleSelectQuickWord(wObj)}
                              className={`disney-btn font-bold px-3 py-1 rounded-xl text-xs sm:text-sm flex items-center gap-1 border nikud-text transition-all ${
                                isSelected
                                  ? 'bg-gradient-to-b from-amber-300 to-amber-400 text-amber-950 border-amber-500 ring-2 ring-cyan-400'
                                  : 'bg-gradient-to-b from-cyan-100 to-cyan-200 hover:from-cyan-200 hover:to-cyan-300 text-indigo-950 border-cyan-400'
                              }`}
                            >
                              <span>{wObj.emoji}</span>
                              <span>{wObj.word}</span>
                            </button>
                          );
                        })}
                      </div>

                      {selectedQuickWord && (
                        <div className="mt-2.5 p-3 rounded-2xl bg-gradient-to-r from-amber-100 via-white to-cyan-50 border-2 border-amber-400 text-slate-800 text-sm sm:text-base shadow-md nikud-text animate-fadeIn">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span className="font-bold text-indigo-950 text-base sm:text-lg">
                              {selectedQuickWord.emoji} {selectedQuickWord.word}:
                            </span>
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => narrationService.speakDictionaryWord(selectedQuickWord)}
                                className="disney-btn bg-cyan-500 hover:bg-cyan-400 text-white px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1"
                              >
                                <Volume2 className="w-3.5 h-3.5" />
                                <span>🔊 הַקְרֵא (נוֹעָה)</span>
                              </button>
                              <button
                                onClick={() => setSelectedQuickWord(null)}
                                className="text-slate-400 hover:text-slate-700 font-bold px-1.5 text-xs"
                                title="סְגֹר"
                              >
                                ✕
                              </button>
                            </div>
                          </div>
                          <p className="font-bold text-emerald-900">
                            ✨ {selectedQuickWord.simpleMeaning}
                          </p>
                          <p className="text-xs sm:text-sm text-slate-700 mt-1">
                            💡 <strong>דּוּגְמָה:</strong> {selectedQuickWord.kidExample}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Mini Quiz for each slide */}
                <MiniQuiz
                  dayId={currentSlide.id}
                  question={currentSlide.question}
                  options={currentSlide.options}
                  onCorrectAnswer={handleCorrectAnswer}
                  isAlreadyAnswered={answeredSlides.has(currentSlide.id)}
                />

              </div>

            </div>
          )}

        </div>
      </main>

      {/* Footer with Previous / Next Buttons and Progress Dots */}
      <Footer
        currentSlideIndex={currentSlideIndex}
        totalSlides={10}
        onPrev={goToPrevSlide}
        onNext={goToNextSlide}
        onSelectSlide={goToSlide}
      />

    </div>
  );
}
