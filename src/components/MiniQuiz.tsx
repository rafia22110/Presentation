import React, { useState } from 'react';
import { Sparkles, CheckCircle2, RefreshCw } from 'lucide-react';
import { QuizOption } from '../types';
import { audioService } from '../services/audioService';
import { narrationService } from '../services/narrationService';

interface MiniQuizProps {
  dayId: number;
  question: string;
  options: QuizOption[];
  onCorrectAnswer: (dayId: number) => void;
  isAlreadyAnswered: boolean;
}

export const MiniQuiz: React.FC<MiniQuizProps> = ({
  dayId,
  question,
  options,
  onCorrectAnswer,
  isAlreadyAnswered,
}) => {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);

  const handleSelectOption = (idx: number, opt: QuizOption) => {
    setSelectedIdx(idx);
    if (opt.correct) {
      audioService.playCorrect();
      audioService.playStarEarned();
      setFeedback({
        isCorrect: true,
        message: 'כָּל הַכָּבוֹד! תְּשׁוּבָה נְכוֹנָה מְאֹד! זְכִיתֶם בְּכוֹכָב ⭐',
      });
      narrationService.speakEncouragement(true);
      onCorrectAnswer(dayId);
    } else {
      audioService.playEncouragement();
      setFeedback({
        isCorrect: false,
        message: 'כִּמְעַט... נַסּוּ שׁוּב, אַתֶּם יְכוֹלִים! 💪',
      });
      narrationService.speakEncouragement(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50/95 via-sky-50/95 to-cyan-100/90 border-2 border-cyan-300 rounded-2xl p-4 shadow-md">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 font-bold text-indigo-950 text-base sm:text-lg nikud-text">
          <span className="text-xl">🤔</span>
          <span>שְׁאֵלַת חֲשִׁיבָה:</span>
        </div>
        {isAlreadyAnswered && (
          <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-full border border-emerald-300 flex items-center gap-1 nikud-text">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>נֶעֶנְתָה בְּהַצְלָחָה</span>
          </span>
        )}
      </div>

      <p className="text-sm sm:text-base font-semibold text-slate-800 mb-3 nikud-text">
        {question}
      </p>

      {/* Answer options */}
      <div className="space-y-2">
        {options.map((opt, idx) => {
          const isSelected = selectedIdx === idx;
          let btnStyle = 'bg-white hover:bg-indigo-50/80 border-2 border-indigo-200 text-slate-800';

          if (isSelected) {
            btnStyle = opt.correct
              ? 'bg-emerald-100 border-2 border-emerald-500 text-emerald-950 font-bold'
              : 'bg-rose-100 border-2 border-rose-400 text-rose-950 font-semibold';
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelectOption(idx, opt)}
              className={`w-full text-right rounded-xl px-4 py-2.5 text-sm sm:text-base transition-all flex items-center justify-between shadow-sm nikud-text ${btnStyle}`}
            >
              <span>{opt.text}</span>
              <span className="text-indigo-400 font-bold">
                {isSelected ? (opt.correct ? '🌟' : '❌') : '◀'}
              </span>
            </button>
          );
        })}
      </div>

      {/* Feedback banner */}
      {feedback && (
        <div
          className={`mt-3 p-2.5 rounded-xl text-center font-bold text-sm sm:text-base border nikud-text flex items-center justify-center gap-2 animate-fade-in ${
            feedback.isCorrect
              ? 'bg-emerald-200 text-emerald-900 border-emerald-400'
              : 'bg-amber-100 text-amber-900 border-amber-300'
          }`}
        >
          {feedback.isCorrect && <Sparkles className="w-4 h-4 text-emerald-700 animate-spin" />}
          <span>{feedback.message}</span>
          {!feedback.isCorrect && (
            <button
              onClick={() => {
                setSelectedIdx(null);
                setFeedback(null);
              }}
              className="text-xs underline text-amber-800 hover:text-amber-950 mr-2 flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              <span>נַסּוּ שׁוּב</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
