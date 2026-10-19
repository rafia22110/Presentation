import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Sparkles, RefreshCw, Star, ArrowRight } from 'lucide-react';
import { GameQuestion } from '../types';
import { gameQuestions } from '../data/slidesData';
import { audioService } from '../services/audioService';
import { narrationService } from '../services/narrationService';

interface SummaryGameProps {
  onEarnStar: () => void;
  onGoToDay: (dayIndex: number) => void;
}

export const SummaryGame: React.FC<SummaryGameProps> = ({ onEarnStar, onGoToDay }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const currentQ: GameQuestion = gameQuestions[currentIdx];

  const dayButtons = [
    { num: 1, label: "יוֹם רִאשׁוֹן (א')", emoji: "🕯️" },
    { num: 2, label: "יוֹם שֵׁנִי (ב')", emoji: "☁️" },
    { num: 3, label: "יוֹם שְׁלִישִׁי (ג')", emoji: "🌳" },
    { num: 4, label: "יוֹם רְבִיעִי (ד')", emoji: "☀️" },
    { num: 5, label: "יוֹם חֲמִישִׁי (ה')", emoji: "🐬" },
    { num: 6, label: "יוֹם שִׁשִּׁי (ו')", emoji: "🦁" },
    { num: 7, label: "יוֹם שַׁבָּת (ז')", emoji: "🕯️" },
  ];

  const handleSelectDay = (dayNum: number) => {
    if (dayNum === currentQ.day) {
      audioService.playCorrect();
      audioService.playStarEarned();
      onEarnStar();
      setFeedback({
        isCorrect: true,
        text: `🎉 נָכוֹן מְאֹד! ${currentQ.name} נִבְרָא בְּ${currentQ.dayHebrewName}!`,
      });

      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.65 },
        colors: ['#FFD700', '#00f2fe', '#ff4d6d', '#38b000'],
      });

      narrationService.speak(`נָכוֹן מְאֹד! כָּל הַכָּבוֹד!`);

      setTimeout(() => {
        setFeedback(null);
        setShowHint(false);
        if (currentIdx < gameQuestions.length - 1) {
          setCurrentIdx(prev => prev + 1);
        } else {
          setIsCompleted(true);
          audioService.playCelebration();
          narrationService.speak(
            `כָּל הַכָּבוֹד אַלּוּפִים! סִיַּמְתֶּם אֶת מִשְׂחַק בְּרִיאַת הָעוֹלָם בְּהַצְלָחָה מֻפְלָאָה!`
          );
          confetti({
            particleCount: 150,
            spread: 90,
            origin: { y: 0.5 },
          });
        }
      }, 1100);
    } else {
      audioService.playEncouragement();
      setFeedback({
        isCorrect: false,
        text: '🤔 לֹא בְּדִיּוּק... נַסּוּ יוֹם אַחֵר אוֹ לַחֲצוּ עַל רֶמֶז מִנּוֹעָה!',
      });
      narrationService.speakEncouragement(false);
    }
  };

  const handleRestart = () => {
    audioService.playClick();
    setCurrentIdx(0);
    setIsCompleted(false);
    setFeedback(null);
    setShowHint(false);
  };

  if (isCompleted) {
    return (
      <div className="flex flex-col items-center justify-center py-6 text-center max-w-xl mx-auto">
        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-200 border-4 border-amber-500 flex items-center justify-center shadow-[0_0_40px_rgba(255,215,0,0.6)] mb-4 animate-bounce">
          <Trophy className="w-14 h-14 text-amber-900" />
        </div>

        <span className="bg-amber-300 text-amber-950 font-bold px-4 py-1.5 rounded-full text-base border-2 border-amber-600 nikud-text mb-2">
          🏆 אַלּוּפֵי בְּרֵאשִׁית
        </span>

        <h2 className="text-3xl sm:text-4xl font-bold text-indigo-950 mb-3 nikud-text">
          כָּל הַכָּבוֹד! יְדַעְתֶּם אֶת כָּל הַתְּשׁוּבוֹת!
        </h2>

        <p className="text-lg text-slate-800 leading-relaxed max-w-md mb-6 nikud-text">
          לְמַדְתֶּם בְּהַצְלָחָה מָה נִבְרָא בְּכָל אֶחָד מִשִּׁבְעַת יְמֵי הַבְּרִיאָה! נוֹעָה וְכָל הַחַיּוֹת גֵּאִים בָּכֶם מְאֹד.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={handleRestart}
            className="disney-btn bg-emerald-400 hover:bg-emerald-300 text-emerald-950 font-bold px-6 py-2.5 rounded-2xl text-lg flex items-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            <span className="nikud-text">שַׂחֵק שׁוּב 🔄</span>
          </button>

          <button
            onClick={() => onGoToDay(0)}
            className="disney-btn bg-amber-300 hover:bg-amber-200 text-amber-950 font-bold px-6 py-2.5 rounded-2xl text-lg flex items-center gap-2"
          >
            <ArrowRight className="w-5 h-5" />
            <span className="nikud-text">חֲזֹר לִתְחִלַּת הַמַּצֶּגֶת</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-2 max-w-4xl mx-auto w-full">
      
      {/* Header */}
      <div className="text-center max-w-xl mx-auto mb-4">
        <span className="bg-amber-300 text-amber-950 font-bold px-4 py-1 rounded-full text-sm sm:text-base border-2 border-amber-700 nikud-text">
          🏆 מִשְׂחַק אֲלוּפֵי הַבְּרִיאָה
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold text-indigo-950 mt-1 nikud-text">
          בְּאֵיזֶה יוֹם זֶה נִבְרָא?
        </h2>
        <p className="text-sm sm:text-base text-slate-700 mt-1 nikud-text">
          הִסְתַּכְּלוּ עַל הַפְּרִיט שֶׁבַּכַּרְטִיס וּלְחֲצוּ עַל הַיּוֹם שֶׁבּוֹ אֱלֹהִים בָּרָא אוֹתוֹ!
        </p>
      </div>

      {/* Item Card */}
      <div className="relative bg-gradient-to-b from-amber-50 to-amber-100/90 border-3 border-amber-600 rounded-3xl p-5 sm:p-7 shadow-xl flex flex-col items-center max-w-md w-full mb-5 transition-transform">
        
        {/* Progress pill */}
        <div className="absolute top-3 right-3 text-xs font-bold text-amber-800 bg-amber-200/80 px-2.5 py-0.5 rounded-full border border-amber-400 nikud-text">
          שְׁאֵלָה {currentIdx + 1} מִתּוֹךְ {gameQuestions.length}
        </div>

        {/* Emoji visual */}
        <div className="text-6xl sm:text-7xl mb-3 drop-shadow animate-bounce">
          {currentQ.emoji}
        </div>

        {/* Name */}
        <h3 className="text-xl sm:text-2xl font-bold text-amber-950 text-center mb-2 nikud-text">
          {currentQ.name}
        </h3>

        {/* Noa hint button */}
        <div className="mt-1">
          {showHint ? (
            <p className="text-xs sm:text-sm text-cyan-900 bg-cyan-100/90 border border-cyan-300 rounded-xl px-3 py-1.5 text-center nikud-text">
              💡 <strong>רֶמֶז מִנּוֹעָה:</strong> {currentQ.hint}
            </p>
          ) : (
            <button
              onClick={() => {
                audioService.playClick();
                setShowHint(true);
                narrationService.speak(`רֶמֶז מִנּוֹעָה: ${currentQ.hint}`);
              }}
              className="text-xs text-amber-800 hover:text-amber-950 underline font-semibold flex items-center gap-1 nikud-text"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>רוֹצִים רֶמֶז מִנּוֹעָה?</span>
            </button>
          )}
        </div>

      </div>

      {/* 7 Days Selection Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5 w-full">
        {dayButtons.map((btn) => (
          <button
            key={btn.num}
            onClick={() => handleSelectDay(btn.num)}
            className="disney-btn bg-gradient-to-b from-amber-200 to-amber-300 hover:from-amber-100 hover:to-amber-200 text-amber-950 font-bold py-3 px-1.5 rounded-2xl flex flex-col items-center justify-center gap-1 shadow-md"
          >
            <span className="text-2xl">{btn.emoji}</span>
            <span className="text-xs sm:text-sm text-center leading-tight nikud-text">
              {btn.label}
            </span>
          </button>
        ))}
      </div>

      {/* Feedback Message */}
      <div className="mt-4 min-h-[3rem] flex items-center justify-center">
        {feedback ? (
          <div
            className={`px-5 py-2 rounded-2xl font-bold text-base sm:text-lg border-2 shadow-sm nikud-text flex items-center gap-2 ${
              feedback.isCorrect
                ? 'bg-emerald-100 text-emerald-950 border-emerald-500'
                : 'bg-rose-100 text-rose-950 border-rose-400'
            }`}
          >
            {feedback.isCorrect && <Star className="w-5 h-5 text-amber-500 fill-amber-400 animate-spin" />}
            <span>{feedback.text}</span>
          </div>
        ) : (
          <p className="text-base font-semibold text-slate-700 nikud-text">
            בַּחֲרוּ אֶת הַיּוֹם הַנָּכוֹן כְּדֵי לִזְכּוֹת בְּכוֹכָב! ⭐
          </p>
        )}
      </div>

    </div>
  );
};
