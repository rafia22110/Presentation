import React, { useState, useMemo } from 'react';
import { Volume2, VolumeX, Search, BookOpen, Sparkles } from 'lucide-react';
import { DictionaryWord } from '../types';
import { dictionaryWords } from '../data/slidesData';
import { audioService } from '../services/audioService';
import { narrationService } from '../services/narrationService';

interface DictionaryModuleProps {
  isSpeaking: boolean;
}

const stripNikud = (str: string): string => str.replace(/[\u0591-\u05C7]/g, '');

export const DictionaryModule: React.FC<DictionaryModuleProps> = ({ isSpeaking }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDay, setSelectedDay] = useState<number | 'all'>('all');
  const [activeWordId, setActiveWordId] = useState<number | null>(null);
  const [isReadingAll, setIsReadingAll] = useState(false);

  const filterButtons: Array<{ id: number | 'all'; label: string }> = [
    { id: 'all', label: `🌟 כָּל הַמִּלִּים (${dictionaryWords.length})` },
    { id: 0, label: '🌍 פְּתִיחָה' },
    { id: 1, label: "🕯️ יוֹם א'" },
    { id: 2, label: "☁️ יוֹם ב'" },
    { id: 3, label: "🌳 יוֹם ג'" },
    { id: 4, label: "☀️ יוֹם ד'" },
    { id: 5, label: "🐬 יוֹם ה'" },
    { id: 6, label: "🦁 יוֹם ו'" },
    { id: 7, label: '🕯️ שַׁבָּת' },
  ];

  const filteredWords = useMemo(() => {
    const cleanQuery = stripNikud(searchQuery.trim());
    return dictionaryWords.filter((item) => {
      const matchesDay =
        selectedDay === 'all' ||
        item.day === selectedDay ||
        (selectedDay === 1 && item.word === 'תֹהוּ וָבֹהוּ') ||
        (selectedDay === 2 && item.word === 'וַיַּבְדֵּל');

      const matchesText =
        !cleanQuery ||
        stripNikud(item.word).includes(cleanQuery) ||
        stripNikud(item.simpleMeaning).includes(cleanQuery) ||
        stripNikud(item.kidExample).includes(cleanQuery) ||
        stripNikud(item.verseQuote).includes(cleanQuery);

      return matchesDay && matchesText;
    });
  }, [searchQuery, selectedDay]);

  const handleSpeakWord = async (item: DictionaryWord) => {
    audioService.playClick();
    if (isSpeaking && activeWordId === item.id) {
      narrationService.stop();
      setActiveWordId(null);
      setIsReadingAll(false);
      return;
    }

    setIsReadingAll(false);
    setActiveWordId(item.id);
    await narrationService.speakDictionaryWord(
      item,
      () => setActiveWordId(item.id),
      () => setActiveWordId(null)
    );
  };

  const handleToggleReadFullDictionary = async () => {
    audioService.playClick();
    if (isSpeaking || isReadingAll) {
      narrationService.stop();
      setIsReadingAll(false);
      setActiveWordId(null);
      return;
    }

    if (filteredWords.length === 0) return;

    setIsReadingAll(true);
    await narrationService.speakFullDictionary(
      filteredWords,
      (wordId) => setActiveWordId(wordId),
      () => {
        setIsReadingAll(false);
        setActiveWordId(null);
      }
    );
  };

  const activeWordObj = useMemo(
    () => dictionaryWords.find((w) => w.id === activeWordId) || null,
    [activeWordId]
  );

  return (
    <div className="flex flex-col py-1 w-full">
      {/* Top Dictionary Header & Search Bar */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4 mb-4 bg-gradient-to-r from-indigo-950 via-sky-950 to-indigo-950 p-4 sm:p-5 rounded-3xl border-2 border-cyan-400/70 shadow-xl text-white">
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-300 to-amber-500 text-amber-950 flex items-center justify-center text-3xl shadow-[0_0_25px_rgba(255,215,0,0.6)] border-2 border-white flex-shrink-0">
            📘
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-amber-300 nikud-text">
              מִלּוֹן הַמִּלִּים הַקָּשׁוֹת שֶׁל בְּרֵאשִׁית
            </h2>
            <p className="text-cyan-100 text-sm sm:text-base nikud-text">
              לִחֲצוּ עַל כָּל מִלָּה כְּדֵי לִשְׁמֹעַ אוֹתָהּ מִנּוֹעָה וּלְגַלּוֹת מָה הִיא אוֹמֶרֶת בְּשָׂפָה פְּשׁוּטָה! ✨
            </p>
          </div>
        </div>

        {/* Search Input & Full Read Button */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full lg:w-auto">
          <div className="w-full sm:w-64 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="חַפְּשׂוּ מִלָּה בַּמִּלּוֹן..."
              className="w-full px-4 py-2.5 pr-10 rounded-2xl bg-white/95 text-slate-900 font-bold border-2 border-cyan-300 focus:outline-none focus:ring-4 focus:ring-cyan-400 text-sm sm:text-base nikud-text placeholder:text-slate-400"
            />
            <Search className="w-5 h-5 text-indigo-600 absolute right-3 top-3 pointer-events-none" />
          </div>

          <button
            onClick={handleToggleReadFullDictionary}
            className={`disney-btn font-bold px-4 py-2.5 rounded-2xl text-sm sm:text-base flex items-center justify-center gap-2 whitespace-nowrap w-full sm:w-auto ${
              isSpeaking && isReadingAll
                ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-white'
                : 'bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-400 text-amber-950'
            }`}
          >
            {isSpeaking && isReadingAll ? (
              <>
                <VolumeX className="w-5 h-5" />
                <span className="nikud-text">עֲצוֹר הַקְרָאַת מִלּוֹן</span>
              </>
            ) : (
              <>
                <Volume2 className="w-5 h-5" />
                <span className="nikud-text">נוֹעָה, הַקְרִיאִי אֶת הַמִּלּוֹן! 🔊</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Noa's Live Dictionary Reading Banner */}
      <div className="flex items-center gap-3 bg-gradient-to-r from-purple-950/90 via-indigo-950/90 to-cyan-950/90 border-2 border-cyan-400/60 rounded-2xl p-3 mb-4 text-white shadow-md">
        <div
          className={`w-12 h-12 rounded-full border-2 border-amber-300 bg-sky-200 flex items-center justify-center text-2xl flex-shrink-0 shadow ${
            isSpeaking ? 'avatar-talking ring-4 ring-cyan-400/50' : ''
          }`}
        >
          👩‍🏫
        </div>
        <div className="flex-grow nikud-text">
          <div className="flex items-center gap-2">
            <span className="text-amber-300 font-bold text-sm sm:text-base">
              נוֹעָה הַמַּדְרִיכָה (קול: ElevenLabs - fuMEGqYpFlKTER3VqptM):
            </span>
            {isSpeaking && (
              <span className="bg-emerald-500/30 border border-emerald-400 text-emerald-200 text-xs px-2 py-0.5 rounded-full animate-pulse">
                מַקְרִיאָה עַכְשָׁו... 🔊
              </span>
            )}
          </div>
          <p className="text-cyan-100 text-xs sm:text-sm mt-0.5">
            {activeWordObj ? (
              <span>
                🗣️ <strong>{activeWordObj.word}:</strong> {activeWordObj.simpleMeaning} —{' '}
                <em>{activeWordObj.kidExample}</em>
              </span>
            ) : (
              <span>
                לִחֲצוּ עַל כַּפְתּוֹר <strong>"🔊 הַקְרֵא"</strong> בְּכָל כַּרְטִיס מִלָּה אוֹ עַל{' '}
                <strong>"נוֹעָה, הַקְרִיאִי אֶת הַמִּלּוֹן!"</strong> כְּדֵי לִשְׁמֹעַ אֶת כָּל הַמִּלִּים בְּקוֹלָהּ שֶׁל נוֹעָה!
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Filter Bar by Days */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
        {filterButtons.map((f) => {
          const active = selectedDay === f.id;
          return (
            <button
              key={String(f.id)}
              onClick={() => {
                audioService.playClick();
                setSelectedDay(f.id);
              }}
              className={`disney-btn px-3 py-1.5 rounded-xl font-bold text-xs sm:text-sm nikud-text transition-all ${
                active
                  ? 'bg-amber-400 text-amber-950 active-tab ring-2 ring-white'
                  : 'bg-indigo-100 text-indigo-950 hover:bg-indigo-200'
              }`}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {/* Dictionary Cards Grid */}
      {filteredWords.length === 0 ? (
        <div className="text-center py-10 bg-white/90 rounded-3xl border-2 border-cyan-300 shadow-inner">
          <div className="text-5xl mb-2">🔍</div>
          <p className="text-xl font-bold text-indigo-950 nikud-text">
            לֹא מָצָאנוּ אֶת הַמִּלָּה הַזֹּאת... נַסּוּ מִלָּה אַחֶרֶת!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[54vh] overflow-y-auto p-2">
          {filteredWords.map((item) => {
            const isCardActive = activeWordId === item.id && isSpeaking;
            return (
              <div
                key={item.id}
                onClick={() => handleSpeakWord(item)}
                className={`cursor-pointer rounded-3xl p-4 flex flex-col justify-between transition-all duration-300 border-2 shadow-md ${
                  isCardActive
                    ? 'bg-gradient-to-br from-amber-50 via-white to-cyan-100 border-amber-500 ring-4 ring-cyan-400/70 scale-[1.02] shadow-xl'
                    : 'bg-gradient-to-br from-white/95 to-sky-50/90 border-cyan-300/80 hover:border-amber-400 hover:-translate-y-1'
                }`}
              >
                <div>
                  {/* Card Top Row: Day Badge + Speak Button */}
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <span className="bg-amber-200 text-amber-950 font-bold px-2.5 py-0.5 rounded-full text-xs border border-amber-400 nikud-text">
                      {item.dayLabel}
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSpeakWord(item);
                      }}
                      className={`disney-btn font-bold px-3 py-1 rounded-xl text-xs flex items-center gap-1 nikud-text ${
                        isCardActive
                          ? 'bg-rose-500 text-white'
                          : 'bg-cyan-400 hover:bg-cyan-300 text-slate-950'
                      }`}
                    >
                      {isCardActive ? (
                        <>
                          <VolumeX className="w-3.5 h-3.5" />
                          <span>עֲצוֹר</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>🔊 הַקְרֵא</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Word Title & Emoji */}
                  <div className="flex items-center gap-2.5 mb-2.5">
                    <span className="text-3xl bg-indigo-100 w-12 h-12 rounded-2xl flex items-center justify-center border border-indigo-200 shadow-inner flex-shrink-0">
                      {item.emoji}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold text-indigo-950 nikud-text">
                      {item.word}
                    </h3>
                  </div>

                  {/* Simple Meaning */}
                  <p className="text-sm sm:text-base font-bold text-emerald-950 bg-emerald-50/95 border border-emerald-200 p-2.5 rounded-2xl mb-2 nikud-text">
                    ✨ {item.simpleMeaning}
                  </p>

                  {/* Kid Everyday Example */}
                  <p className="text-xs sm:text-sm text-slate-700 mb-2 nikud-text leading-relaxed">
                    💡 <strong>בְּחַיֵּי הַיּוֹם-יוֹם:</strong> {item.kidExample}
                  </p>
                </div>

                {/* Verse Quote */}
                <div className="mt-2 pt-2 border-t border-amber-300/60 text-xs font-bold text-amber-950 bg-amber-50/90 px-2.5 py-1.5 rounded-xl nikud-text">
                  📜 מֵהַפָּסוּק: {item.verseQuote}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
