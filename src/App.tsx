import { useEffect, useMemo, useState } from 'react';
import {
  BarChart3,
  Bell,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Circle,
  Clock3,
  Download,
  Eye,
  History,
  Languages,
  Library,
  Lightbulb,
  MessageSquareText,
  RotateCcw,
  Share2,
  Shuffle,
  Sparkles,
  WandSparkles,
  X,
} from 'lucide-react';
import TarotScene from './components/TarotScene';
import {
  beginnerActions,
  beginnerPositionCopy,
  beginnerSteps,
  beginnerUi,
  locales,
  questionTemplates,
  readingModes,
  spreads,
  tarotDeck,
  ui,
} from './data/tarot';
import { createReading } from './utils/reading';
import type { Locale, ReadingSlot } from './types';

const recordsStorageKey = 'arcana-kin-reading-records';
const maxStoredRecords = 60;
const oneDayMs = 24 * 60 * 60 * 1000;

interface ReadingRecordCard {
  slotId: string;
  cardId: string;
  reversed: boolean;
  slotLabel?: string;
  cardName?: string;
  orientationLabel?: string;
  keywords?: string[];
  positionText?: string;
  meaning?: string;
  nextMove?: string;
}

interface PlainReadingNarrative {
  headline: string;
  overview: string;
  cardBreakdown: Array<{
    slotId: string;
    cardId: string;
    title: string;
    body: string;
    action: string;
  }>;
  actionPlan: string;
  reminder: string;
  keywords: string[];
}

interface ReadingRecord {
  id: string;
  createdAt: string;
  question: string;
  spreadId: string;
  modeId: string;
  language?: Locale;
  spreadLabel?: string;
  spreadDescription?: string;
  modeLabel?: string;
  plainSummary?: PlainReadingNarrative;
  reviewDueAt?: string;
  reviewedAt?: string;
  reviewNote?: string;
  cards: ReadingRecordCard[];
}

interface DailyCardEntry {
  dateKey: string;
  cardId: string;
  reversed: boolean;
}

const engagementUi = {
  dailyTitle: {
    'zh-TW': '今日一牌',
    en: 'Daily Card',
    ja: '今日の一枚',
  },
  dailyBody: {
    'zh-TW': '每天回來先看一張牌，把它當成今天的提醒。',
    en: 'Return each day for one small prompt to carry with you.',
    ja: '毎日一枚のカードを、その日の小さな合図として受け取ります。',
  },
  useDailyQuestion: {
    'zh-TW': '用作今日提問',
    en: 'Use as today question',
    ja: '今日の問いに使う',
  },
  reviewTitle: {
    'zh-TW': '復盤提醒',
    en: 'Reflection Reminder',
    ja: '振り返りリマインダー',
  },
  reviewBody: {
    'zh-TW': '選一個時間回看，之後在閱讀記錄裡補上實際發生了什麼。',
    en: 'Pick a return date, then add what actually happened later.',
    ja: '戻ってくる日を選び、後で実際に起きたことを書き足します。',
  },
  tomorrow: {
    'zh-TW': '明天',
    en: 'Tomorrow',
    ja: '明日',
  },
  threeDays: {
    'zh-TW': '3 天後',
    en: 'In 3 days',
    ja: '3日後',
  },
  sevenDays: {
    'zh-TW': '7 天後',
    en: 'In 7 days',
    ja: '7日後',
  },
  dueNow: {
    'zh-TW': '該回看了',
    en: 'Ready to review',
    ja: '振り返り時期',
  },
  scheduled: {
    'zh-TW': '已安排',
    en: 'Scheduled',
    ja: '予定済み',
  },
  reviewed: {
    'zh-TW': '已復盤',
    en: 'Reviewed',
    ja: '振り返り済み',
  },
  reviewPlaceholder: {
    'zh-TW': '幾天後回看時，這次牌陣真的提醒了什麼？',
    en: 'When you revisit this, what did the reading actually help you notice?',
    ja: '振り返った時、このリーディングは何を気づかせましたか？',
  },
  saveReview: {
    'zh-TW': '保存復盤',
    en: 'Save reflection',
    ja: '振り返りを保存',
  },
  insightsTitle: {
    'zh-TW': '個人洞察',
    en: 'Personal Insights',
    ja: '個人インサイト',
  },
  recentReadings: {
    'zh-TW': '近 7 天',
    en: 'Last 7 days',
    ja: '直近7日',
  },
  reversalRatio: {
    'zh-TW': '逆位比例',
    en: 'Reversal ratio',
    ja: '逆位置比率',
  },
  topCards: {
    'zh-TW': '常出現的牌',
    en: 'Frequent cards',
    ja: 'よく出るカード',
  },
  topKeywords: {
    'zh-TW': '常出現的關鍵詞',
    en: 'Frequent keywords',
    ja: 'よく出るキーワード',
  },
  timelineTitle: {
    'zh-TW': '時間線',
    en: 'Timeline',
    ja: 'タイムライン',
  },
  shareTitle: {
    'zh-TW': '分享卡片',
    en: 'Share Card',
    ja: 'シェアカード',
  },
  downloadShare: {
    'zh-TW': '下載分享圖',
    en: 'Download image',
    ja: '画像を保存',
  },
  shareSaved: {
    'zh-TW': '分享圖已生成',
    en: 'Share image created',
    ja: 'シェア画像を作成しました',
  },
} as const;

const plainSummaryUi = {
  title: {
    'zh-TW': '大白話總結',
    en: 'Plain Summary',
    ja: 'やさしいまとめ',
  },
  conclusion: {
    'zh-TW': '先講結論',
    en: 'Bottom Line',
    ja: 'まず結論',
  },
  overview: {
    'zh-TW': '這個牌陣在說什麼',
    en: 'What This Reading Says',
    ja: 'この展開が言っていること',
  },
  cardBreakdown: {
    'zh-TW': '逐張翻成白話',
    en: 'Card By Card',
    ja: 'カードごとに',
  },
  actionPlan: {
    'zh-TW': '接下來怎麼做',
    en: 'What To Do Next',
    ja: '次にすること',
  },
  reminder: {
    'zh-TW': '最後提醒',
    en: 'Final Note',
    ja: '最後のメモ',
  },
} as const;

function App() {
  const [language, setLanguage] = useState<Locale>('zh-TW');
  const [spreadId, setSpreadId] = useState(spreads[0].id);
  const [modeId, setModeId] = useState(readingModes[0].id);
  const [intention, setIntention] = useState('');
  const [reading, setReading] = useState<ReadingSlot[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [beginnerMode, setBeginnerMode] = useState(true);
  const [inspectedIndex, setInspectedIndex] = useState<number | null>(null);
  const [records, setRecords] = useState<ReadingRecord[]>([]);
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);
  const [readingSessionId, setReadingSessionId] = useState(createReadingId);
  const [savedReadingId, setSavedReadingId] = useState<string | null>(null);
  const [reviewDraft, setReviewDraft] = useState('');
  const [shareNotice, setShareNotice] = useState('');
  const dailyEntry = useMemo(() => getDailyCardEntry(), []);

  const spread = useMemo(
    () => spreads.find((item) => item.id === spreadId) ?? spreads[0],
    [spreadId],
  );
  const mode = useMemo(
    () => readingModes.find((item) => item.id === modeId) ?? readingModes[0],
    [modeId],
  );
  const revealedCount = reading.filter((slot) => slot.revealed).length;
  const drawnCount = reading.filter((slot) => slot.drawn).length;
  const completedCards = reading.filter((slot) => slot.revealed);
  const activeSlot = activeIndex === null ? null : reading[activeIndex] ?? null;
  const inspectedSlot = inspectedIndex === null ? null : reading[inspectedIndex] ?? null;
  const completed = reading.length > 0 && revealedCount === reading.length;
  const hasQuestion = intention.trim().length > 0;
  const nextDrawIndex = reading.findIndex((slot) => !slot.drawn);
  const nextUnrevealedIndex = reading.findIndex((slot) => slot.drawn && !slot.revealed);
  const readingQuestion = intention.trim() || beginnerUi.defaultQuestion[language];
  const activePositionText = activeSlot
    ? getBeginnerPositionText(activeSlot.slotId, language)
    : '';
  const activeMeaning = activeSlot?.reversed
    ? activeSlot.card.shadow[language]
    : activeSlot?.card.meaning[language];
  const activeNextMove = activeSlot
    ? beginnerActions[activeSlot.reversed ? 'reversed' : 'upright'][language]
    : '';
  const selectedRecord =
    (selectedRecordId ? records.find((record) => record.id === selectedRecordId) : null) ??
    records[0] ??
    null;
  const selectedRecordCards = selectedRecord ? getRecordCards(selectedRecord) : [];
  const selectedRecordNarrative = selectedRecord
    ? getRecordNarrative(selectedRecord, language)
    : null;
  const currentRecord = savedReadingId
    ? records.find((record) => record.id === savedReadingId) ?? null
    : null;
  const dailyCard = tarotDeck.find((card) => card.id === dailyEntry.cardId) ?? tarotDeck[0];
  const insights = useMemo(() => getInsights(records, language), [language, records]);
  const recordCountText = beginnerUi.recordCount[language].replace('{count}', String(records.length));
  const isCurrentReadingSaved = completed && savedReadingId === readingSessionId;
  const plainNarrative = useMemo(
    () =>
      completed
        ? createPlainReadingNarrative(completedCards, language, readingQuestion)
        : null,
    [completed, language, reading, readingQuestion],
  );

  useEffect(() => {
    try {
      const rawRecords = window.localStorage.getItem(recordsStorageKey);
      if (!rawRecords) {
        return;
      }

      const parsedRecords: unknown = JSON.parse(rawRecords);
      if (!Array.isArray(parsedRecords)) {
        return;
      }

      const normalizedRecords = parsedRecords
        .filter(isReadingRecord)
        .map(normalizeReadingRecord)
        .slice(0, maxStoredRecords);
      persistRecords(normalizedRecords);
      setRecords(normalizedRecords);
      setSelectedRecordId(normalizedRecords[0]?.id ?? null);
    } catch {
      setRecords([]);
    }
  }, []);

  useEffect(() => {
    setReviewDraft(selectedRecord?.reviewNote ?? '');
  }, [selectedRecord?.id, selectedRecord?.reviewNote]);

  useEffect(() => {
    if (!completed || reading.length === 0 || savedReadingId === readingSessionId) {
      return;
    }

    const record: ReadingRecord = {
      id: readingSessionId,
      createdAt: new Date().toISOString(),
      question: readingQuestion,
      spreadId: spread.id,
      modeId: mode.id,
      language,
      spreadLabel: spread.labels[language],
      spreadDescription: spread.description[language],
      modeLabel: mode.labels[language],
      plainSummary:
        plainNarrative ?? createPlainReadingNarrative(reading, language, readingQuestion),
      cards: createStoredReadingCards(reading, language),
    };

    setRecords((currentRecords) => {
      const nextRecords = [
        record,
        ...currentRecords.filter((currentRecord) => currentRecord.id !== record.id),
      ].slice(0, maxStoredRecords);
      persistRecords(nextRecords);
      return nextRecords;
    });
    setSelectedRecordId(record.id);
    setSavedReadingId(record.id);
  }, [
    completed,
    language,
    mode.id,
    mode.labels,
    plainNarrative,
    reading,
    readingQuestion,
    readingSessionId,
    savedReadingId,
    spread.description,
    spread.id,
    spread.labels,
  ]);

  useEffect(() => {
    if (inspectedIndex === null) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setInspectedIndex(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [inspectedIndex]);

  useEffect(() => {
    if (!inspectedSlot?.revealed) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [inspectedSlot?.id, inspectedSlot?.revealed]);

  const castReading = () => {
    if (!hasQuestion) {
      setIntention(beginnerUi.defaultQuestion[language]);
    }
    setReading(createReading(spread));
    setActiveIndex(null);
    setInspectedIndex(null);
    setReadingSessionId(createReadingId());
    setSavedReadingId(null);
  };

  const drawCard = () => {
    if (nextUnrevealedIndex >= 0) {
      return;
    }

    const nextIndex = reading.findIndex((slot) => !slot.drawn);

    if (nextIndex < 0) {
      return;
    }

    setReading((current) => {
      if (!current[nextIndex] || current[nextIndex].drawn) {
        return current;
      }

      return current.map((slot, slotIndex) =>
        slotIndex === nextIndex ? { ...slot, drawn: true } : slot,
      );
    });
    setActiveIndex(nextIndex);
  };

  const clearReading = () => {
    setReading([]);
    setActiveIndex(null);
    setInspectedIndex(null);
    setSavedReadingId(null);
  };

  const revealCard = (index: number) => {
    setReading((current) =>
      current.map((slot, slotIndex) =>
        slotIndex === index && slot.drawn ? { ...slot, revealed: true } : slot,
      ),
    );
    setActiveIndex(index);
  };

  const inspectCard = (index: number) => {
    const slot = reading[index];
    if (!slot) {
      return;
    }

    if (slot.drawn && !slot.revealed) {
      revealCard(index);
      return;
    }

    if (slot.revealed) {
      setActiveIndex(index);
      setInspectedIndex(index);
    }
  };

  const applyTemplate = (template: (typeof questionTemplates)[number]) => {
    setIntention(template.text[language]);
    setModeId(template.modeId);
  };

  const applyDailyCard = () => {
    setIntention(
      language === 'en'
        ? `What can ${dailyCard.names[language]} help me notice today?`
        : language === 'ja'
          ? `今日、${dailyCard.names[language]}は何に気づかせてくれますか？`
          : `今天，${dailyCard.names[language]}想提醒我注意什麼？`,
    );
    setModeId('growth');
    setSpreadId('three-paths');
    setReading([]);
    setActiveIndex(null);
    setInspectedIndex(null);
    setSavedReadingId(null);
  };

  const updateRecords = (updater: (currentRecords: ReadingRecord[]) => ReadingRecord[]) => {
    setRecords((currentRecords) => {
      const nextRecords = updater(currentRecords).slice(0, maxStoredRecords);
      persistRecords(nextRecords);
      return nextRecords;
    });
  };

  const scheduleReview = (recordId: string, days: number) => {
    updateRecords((currentRecords) =>
      currentRecords.map((record) =>
        record.id === recordId
          ? {
              ...record,
              reviewDueAt: getFutureReviewDate(days),
              reviewedAt: undefined,
            }
          : record,
      ),
    );
  };

  const saveReviewNote = () => {
    if (!selectedRecord) {
      return;
    }

    updateRecords((currentRecords) =>
      currentRecords.map((record) =>
        record.id === selectedRecord.id
          ? {
              ...record,
              reviewNote: reviewDraft.trim(),
              reviewedAt: new Date().toISOString(),
            }
          : record,
      ),
    );
  };

  const downloadSelectedShareCard = (record: ReadingRecord) => {
    downloadShareCard(record, language);
    setShareNotice(engagementUi.shareSaved[language]);
    window.setTimeout(() => setShareNotice(''), 2200);
  };

  const getStepClass = (stepId: string) => {
    if (stepId === 'question') {
      return hasQuestion || reading.length > 0 ? 'done' : 'active';
    }

    if (stepId === 'cast') {
      return drawnCount > 0 ? 'done' : hasQuestion ? 'active' : '';
    }

    if (stepId === 'read') {
      return completed ? 'done' : drawnCount > 0 ? 'active' : '';
    }

    return '';
  };

  return (
    <main className="app-shell" style={{ '--mode-accent': mode.accent } as React.CSSProperties}>
      <aside className="control-panel" aria-label="Tarot controls">
        <header className="brand-lockup">
          <div className="brand-mark" aria-hidden="true">
            <Sparkles size={22} />
          </div>
          <div>
            <p>{ui.openSource[language]}</p>
            <h1>{ui.appName[language]}</h1>
            <span>{ui.subtitle[language]}</span>
          </div>
        </header>

        <section className="beginner-panel">
          <div className="beginner-heading">
            <BookOpen size={17} />
            <span>{beginnerUi.startHere[language]}</span>
            <button
              className={beginnerMode ? 'guide-toggle active' : 'guide-toggle'}
              onClick={() => setBeginnerMode((current) => !current)}
              type="button"
            >
              {beginnerMode ? beginnerUi.guideOn[language] : beginnerUi.guideOff[language]}
            </button>
          </div>
          <div className="step-strip">
            {beginnerSteps.map((step) => {
              const stepClass = getStepClass(step.id);
              return (
                <span className={`step-pill ${stepClass}`} key={step.id}>
                  {stepClass === 'done' ? <CheckCircle2 size={14} /> : <Circle size={12} />}
                  {step.labels[language]}
                </span>
              );
            })}
          </div>
        </section>

        <section className="daily-card-panel">
          <div className="daily-card-heading">
            <CalendarDays size={17} />
            <div>
              <strong>{engagementUi.dailyTitle[language]}</strong>
              <span>{formatDailyDate(dailyEntry.dateKey, language)}</span>
            </div>
          </div>
          <div className="daily-card-preview" style={getCardPaletteStyleFromCard(dailyCard)}>
            <span>{dailyCard.glyph}</span>
            <div>
              <strong>{dailyCard.names[language]}</strong>
              <em>{dailyEntry.reversed ? ui.reversed[language] : ui.upright[language]}</em>
            </div>
          </div>
          <p>{dailyEntry.reversed ? dailyCard.shadow[language] : dailyCard.meaning[language]}</p>
          <div className="keyword-cloud compact">
            {dailyCard.keywords[language].slice(0, 3).map((keyword) => (
              <span key={keyword}>{keyword}</span>
            ))}
          </div>
          <button className="secondary-action" onClick={applyDailyCard} type="button">
            <Sparkles size={15} />
            <span>{engagementUi.useDailyQuestion[language]}</span>
          </button>
        </section>

        <section className="control-section">
          <div className="section-title">
            <Languages size={17} />
            <span>{ui.language[language]}</span>
          </div>
          <div className="segmented-control compact" role="group">
            {locales.map((locale) => (
              <button
                className={locale.id === language ? 'active' : ''}
                key={locale.id}
                onClick={() => setLanguage(locale.id)}
                title={locale.label}
                type="button"
              >
                {locale.short}
              </button>
            ))}
          </div>
        </section>

        <section className="control-section">
          <div className="section-title">
            <Library size={17} />
            <span>{ui.spread[language]}</span>
          </div>
          <div className="spread-list">
            {spreads.map((item) => (
              <button
                className={item.id === spreadId ? 'spread-option active' : 'spread-option'}
                key={item.id}
                onClick={() => {
                  setSpreadId(item.id);
                  setReading([]);
                  setActiveIndex(null);
                  setInspectedIndex(null);
                  setSavedReadingId(null);
                }}
                type="button"
              >
                <span>
                  {item.labels[language]}
                  {item.id === 'three-paths' && (
                    <em className="recommend-badge">{beginnerUi.recommended[language]}</em>
                  )}
                </span>
                <small>
                  {item.description[language]} · {item.slots.length}{' '}
                  {ui.slots[language]}
                </small>
              </button>
            ))}
          </div>
        </section>

        <section className="control-section">
          <div className="section-title">
            <WandSparkles size={17} />
            <span>{ui.lens[language]}</span>
          </div>
          <div className="mode-grid" role="group">
            {readingModes.map((item) => (
              <button
                className={item.id === modeId ? 'mode-chip active' : 'mode-chip'}
                key={item.id}
                onClick={() => setModeId(item.id)}
                style={{ '--chip-accent': item.accent } as React.CSSProperties}
                type="button"
              >
                {item.labels[language]}
              </button>
            ))}
          </div>
        </section>

        <section className="control-section">
          <label className="section-title" htmlFor="intention">
            <span>{ui.intention[language]}</span>
          </label>
          <textarea
            id="intention"
            onChange={(event) => setIntention(event.target.value)}
            placeholder={ui.intentionPlaceholder[language]}
            value={intention}
          />
        </section>

        {beginnerMode && (
          <section className="control-section">
            <div className="section-title">
              <Lightbulb size={17} />
              <span>{beginnerUi.templates[language]}</span>
            </div>
            <div className="template-list">
              {questionTemplates.map((template) => (
                <button
                  className={intention === template.text[language] ? 'template-chip active' : 'template-chip'}
                  key={template.id}
                  onClick={() => applyTemplate(template)}
                  type="button"
                >
                  <span>{template.text[language]}</span>
                  <small>{beginnerUi.applyTemplate[language]}</small>
                </button>
              ))}
            </div>
          </section>
        )}

        <div className="action-row">
          <button className="primary-action" onClick={castReading} type="button">
            <Shuffle size={18} />
            <span>{reading.length ? ui.recast[language] : ui.draw[language]}</span>
          </button>
          <button className="icon-action" onClick={clearReading} title={ui.reset[language]} type="button">
            <RotateCcw size={19} />
          </button>
        </div>
      </aside>

      <section className="table-stage" aria-label="3D tarot table">
        <div className="table-status">
          <span className="status-dot" />
          <span>
            {reading.length === 0
              ? ui.deckReady[language]
              : completed
                ? ui.complete[language]
                : nextUnrevealedIndex >= 0
                  ? ui.activePrompt[language]
                  : nextDrawIndex >= 0
                  ? beginnerUi.drawFromDeck[language]
                  : ui.activePrompt[language]}
          </span>
        </div>
        <TarotScene
          activeIndex={activeIndex}
          language={language}
          onDraw={drawCard}
          onInspect={inspectCard}
          onReveal={revealCard}
          reading={reading}
          spread={spread}
        />
      </section>

      <aside className="reading-panel" aria-label="Tarot reading">
        <header className="reading-header">
          <p>{ui.reading[language]}</p>
          <h2>{spread.labels[language]}</h2>
          <span>
            {drawnCount}/{reading.length || spread.slots.length}
          </span>
        </header>

        <div className="reading-context">
          <span style={{ backgroundColor: mode.accent }} />
          <strong>{mode.labels[language]}</strong>
          <p>{reading.length || hasQuestion ? readingQuestion : beginnerUi.emptyBody[language]}</p>
        </div>
        {beginnerMode && completed && (
          <section className="completion-panel">
            <div className="completion-panel-header">
              <CheckCircle2 size={19} />
              <div>
                <strong>{beginnerUi.completeTitle[language]}</strong>
                <span>{beginnerUi.completeBody[language]}</span>
              </div>
            </div>
            <div className="completion-summary">
              {completedCards.map((slot) => (
                <button
                  className={slot.id === activeSlot?.id ? 'completion-card active' : 'completion-card'}
                  key={slot.id}
                  onClick={() => inspectCard(reading.findIndex((item) => item.id === slot.id))}
                  type="button"
                >
                  <span>{slot.label[language]}</span>
                  <strong>{slot.card.names[language]}</strong>
                  <em>{slot.reversed ? ui.reversed[language] : ui.upright[language]}</em>
                </button>
              ))}
            </div>
            {plainNarrative && (
              <PlainNarrativeBlock language={language} narrative={plainNarrative} />
            )}
            <small>{beginnerUi.completeReviewHint[language]}</small>
            {currentRecord && (
              <div className="review-scheduler">
                <div>
                  <Bell size={16} />
                  <span>{engagementUi.reviewTitle[language]}</span>
                </div>
                <small>{engagementUi.reviewBody[language]}</small>
                <div className="review-choice-row">
                  <button onClick={() => scheduleReview(currentRecord.id, 1)} type="button">
                    {engagementUi.tomorrow[language]}
                  </button>
                  <button onClick={() => scheduleReview(currentRecord.id, 3)} type="button">
                    {engagementUi.threeDays[language]}
                  </button>
                  <button onClick={() => scheduleReview(currentRecord.id, 7)} type="button">
                    {engagementUi.sevenDays[language]}
                  </button>
                </div>
              </div>
            )}
          </section>
        )}
        {beginnerMode && reading.length > 0 && nextDrawIndex >= 0 && nextUnrevealedIndex < 0 && (
          <button className="draw-helper" onClick={drawCard} type="button">
            <Sparkles size={16} />
            <span>{beginnerUi.drawFromDeck[language]}</span>
            <small>{beginnerUi.drawHint[language]}</small>
          </button>
        )}

        <div className="slot-list">
          {(reading.length ? reading : spread.slots).map((slot, index) => {
            const readingSlot = 'card' in slot ? slot : null;
            const isActive = activeIndex === index;
            const isNextDraw =
              readingSlot && !readingSlot.drawn && index === nextDrawIndex && nextUnrevealedIndex < 0;
            const isNextReveal =
              readingSlot && readingSlot.drawn && !readingSlot.revealed && index === nextUnrevealedIndex;
            const isNext = isNextDraw || isNextReveal;
            return (
              <button
                className={[
                  'slot-row',
                  isActive ? 'active' : '',
                  isNext ? 'next' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                disabled={!readingSlot || (!readingSlot.drawn && !isNextDraw)}
                key={slot.id}
                onClick={() => {
                  if (readingSlot?.revealed) {
                    inspectCard(index);
                  } else if (readingSlot?.drawn) {
                    revealCard(index);
                  } else if (isNextDraw) {
                    drawCard();
                  }
                }}
                type="button"
              >
                <div className="slot-row-main">
                  <span className="slot-index">{index + 1}</span>
                  <span>{slot.label[language]}</span>
                  {readingSlot && (
                    <em>
                      {readingSlot.revealed
                        ? beginnerUi.revealedLabel[language]
                        : isNextDraw
                          ? beginnerUi.drawNext[language]
                          : readingSlot.drawn
                            ? isNextReveal
                              ? beginnerUi.revealNext[language]
                              : beginnerUi.drawnLabel[language]
                            : beginnerUi.waitingLabel[language]}
                    </em>
                  )}
                </div>
                <small>
                  {readingSlot?.revealed
                    ? readingSlot.card.names[language]
                    : readingSlot?.drawn
                      ? ui.hidden[language]
                      : readingSlot
                        ? beginnerUi.drawFromDeck[language]
                      : spread.slots[index].label[language]}
                </small>
              </button>
            );
          })}
        </div>

        <article className="card-reading">
          {activeSlot?.revealed ? (
            <>
              <p>{activeSlot.label[language]}</p>
              <h3>{activeSlot.card.names[language]}</h3>
              <span className={activeSlot.reversed ? 'orientation reversed' : 'orientation'}>
                {activeSlot.reversed ? ui.reversed[language] : ui.upright[language]}
              </span>
              {activeIndex !== null && (
                <button className="inspect-action" onClick={() => inspectCard(activeIndex)} type="button">
                  <Eye size={16} />
                  <span>{beginnerUi.inspectCard[language]}</span>
                </button>
              )}
              <p className="meaning">
                {activeSlot.reversed
                  ? activeSlot.card.shadow[language]
                  : activeSlot.card.meaning[language]}
              </p>
              {beginnerMode && (
                <div className="beginner-reading">
                  <div>
                    <strong>{beginnerUi.plainMeaning[language]}</strong>
                    <span>
                      {activePositionText} {activeMeaning}
                    </span>
                  </div>
                  <div>
                    <strong>{beginnerUi.nextMove[language]}</strong>
                    <span>{activeNextMove}</span>
                  </div>
                </div>
              )}
              <div className="keyword-cloud" aria-label={ui.keywords[language]}>
                {activeSlot.card.keywords[language].map((keyword) => (
                  <span key={keyword}>{keyword}</span>
                ))}
              </div>
              {beginnerMode && <small className="gentle-note">{beginnerUi.gentleNote[language]}</small>}
            </>
          ) : activeSlot?.drawn ? (
            <>
              <p>{activeSlot.label[language]}</p>
              <h3>{ui.hidden[language]}</h3>
              <span className="orientation">{beginnerUi.revealNext[language]}</span>
              <p className="meaning">{beginnerUi.revealHint[language]}</p>
            </>
          ) : (
            <>
              <p>{ui.deckReady[language]}</p>
              <h3>{beginnerMode ? beginnerUi.emptyTitle[language] : ui.emptyReading[language]}</h3>
              <span className="orientation">{spread.description[language]}</span>
              {beginnerMode && <p className="meaning">{beginnerUi.emptyBody[language]}</p>}
            </>
          )}
        </article>

        <section className="record-panel">
          <div className="record-panel-header">
            <History size={18} />
            <div>
              <strong>{beginnerUi.journalTitle[language]}</strong>
              <span>
                {records.length > 0
                  ? beginnerUi.journalBody[language]
                  : beginnerUi.journalEmpty[language]}
              </span>
            </div>
            <em>{isCurrentReadingSaved ? beginnerUi.journalSaved[language] : recordCountText}</em>
          </div>

          {records.length > 0 ? (
            <>
              <section className="insight-panel">
                <div className="insight-header">
                  <BarChart3 size={17} />
                  <strong>{engagementUi.insightsTitle[language]}</strong>
                </div>
                <div className="insight-grid">
                  <div>
                    <span>{engagementUi.recentReadings[language]}</span>
                    <strong>{insights.recentCount}</strong>
                  </div>
                  <div>
                    <span>{engagementUi.reversalRatio[language]}</span>
                    <strong>{insights.reversalRatio}%</strong>
                  </div>
                </div>
                <div className="insight-stack">
                  <span>{engagementUi.topCards[language]}</span>
                  <div className="keyword-cloud compact">
                    {insights.topCards.map((card) => (
                      <span key={card.label}>{card.label}</span>
                    ))}
                  </div>
                </div>
                <div className="insight-stack">
                  <span>{engagementUi.topKeywords[language]}</span>
                  <div className="keyword-cloud compact">
                    {insights.topKeywords.map((keyword) => (
                      <span key={keyword.label}>{keyword.label}</span>
                    ))}
                  </div>
                </div>
              </section>

              <div className="timeline-heading">
                <Clock3 size={16} />
                <span>{engagementUi.timelineTitle[language]}</span>
              </div>
              <div className="record-list timeline-list">
                {records.map((record, index) => {
                  const recordSpread = getRecordSpread(record);
                  const recordMode = getRecordMode(record);
                  const reviewStatus = getReviewStatus(record);
                  const previewCards = getRecordCards(record)
                    .slice(0, 3)
                    .map(({ card }) => card.names[language])
                    .join(' · ');

                  return (
                    <button
                      className={
                        record.id === selectedRecord?.id ? 'record-item active' : 'record-item'
                      }
                      key={record.id}
                      onClick={() => setSelectedRecordId(record.id)}
                      type="button"
                    >
                      <span>
                        <strong>{record.question}</strong>
                        {index === 0 && <em>{beginnerUi.latestRecord[language]}</em>}
                        {reviewStatus !== 'none' && (
                          <em className={`review-badge ${reviewStatus}`}>
                            {getReviewStatusLabel(reviewStatus, language)}
                          </em>
                        )}
                      </span>
                      <small>
                        {formatRecordDate(record.createdAt, language)} ·{' '}
                        {recordSpread.labels[language]} · {recordMode.labels[language]}
                      </small>
                      <small>{previewCards}</small>
                    </button>
                  );
                })}
              </div>

              {selectedRecord && (
                <div className="record-detail">
                  <div className="record-detail-header">
                    <span>{beginnerUi.recordDetail[language]}</span>
                    <strong>{formatRecordDate(selectedRecord.createdAt, language)}</strong>
                  </div>
                  <p>{selectedRecord.question}</p>
                  {selectedRecordNarrative && (
                    <PlainNarrativeBlock
                      language={language}
                      narrative={selectedRecordNarrative}
                    />
                  )}
                  <div className="record-action-row">
                    <button onClick={() => downloadSelectedShareCard(selectedRecord)} type="button">
                      <Share2 size={15} />
                      <span>{engagementUi.downloadShare[language]}</span>
                    </button>
                    {shareNotice && <em>{shareNotice}</em>}
                  </div>
                  <div className="reflection-box">
                    <div className="reflection-heading">
                      <MessageSquareText size={15} />
                      <span>{engagementUi.reviewTitle[language]}</span>
                      {selectedRecord.reviewDueAt && (
                        <em>{formatReviewDate(selectedRecord.reviewDueAt, language)}</em>
                      )}
                    </div>
                    <div className="review-choice-row">
                      <button onClick={() => scheduleReview(selectedRecord.id, 1)} type="button">
                        {engagementUi.tomorrow[language]}
                      </button>
                      <button onClick={() => scheduleReview(selectedRecord.id, 3)} type="button">
                        {engagementUi.threeDays[language]}
                      </button>
                      <button onClick={() => scheduleReview(selectedRecord.id, 7)} type="button">
                        {engagementUi.sevenDays[language]}
                      </button>
                    </div>
                    <textarea
                      onChange={(event) => setReviewDraft(event.target.value)}
                      placeholder={engagementUi.reviewPlaceholder[language]}
                      value={reviewDraft}
                    />
                    <button className="secondary-action" onClick={saveReviewNote} type="button">
                      <Download size={15} />
                      <span>{engagementUi.saveReview[language]}</span>
                    </button>
                  </div>
                  <div className="record-card-stack">
                    {selectedRecordCards.map(({ card, reversed, slot }) => (
                      <div className="record-card-row" key={`${selectedRecord.id}-${slot.id}-${card.id}`}>
                        <span>{slot.label[language]}</span>
                        <strong>{card.names[language]}</strong>
                        <em>{reversed ? ui.reversed[language] : ui.upright[language]}</em>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <p className="record-empty">{beginnerUi.journalEmpty[language]}</p>
          )}
        </section>
      </aside>

      {inspectedSlot?.revealed && (
        <div
          className="card-inspector-backdrop"
          onClick={() => setInspectedIndex(null)}
          role="presentation"
        >
          <button
            className="inspector-close"
            onClick={() => setInspectedIndex(null)}
            title={beginnerUi.closeInspector[language]}
            type="button"
          >
            <X size={18} />
          </button>

          <article
            aria-modal="true"
            className="card-inspector"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
          >
            <div className="inspector-card-wrap">
              <div className="inspector-card-art" style={getCardPaletteStyle(inspectedSlot)}>
                <span>{inspectedSlot.card.glyph}</span>
                <strong>{inspectedSlot.card.names[language]}</strong>
                <em>{inspectedSlot.reversed ? ui.reversed[language] : ui.upright[language]}</em>
              </div>
            </div>

            <div className="inspector-copy">
              <p>{beginnerUi.inspectorKicker[language]}</p>
              <h2>{inspectedSlot.card.names[language]}</h2>
              <span className={inspectedSlot.reversed ? 'orientation reversed' : 'orientation'}>
                {inspectedSlot.label[language]} ·{' '}
                {inspectedSlot.reversed ? ui.reversed[language] : ui.upright[language]}
              </span>
              <p className="meaning">
                {inspectedSlot.reversed
                  ? inspectedSlot.card.shadow[language]
                  : inspectedSlot.card.meaning[language]}
              </p>
              <div className="beginner-reading">
                <div>
                  <strong>{beginnerUi.plainMeaning[language]}</strong>
                  <span>
                    {getBeginnerPositionText(inspectedSlot.slotId, language)}{' '}
                    {inspectedSlot.reversed
                      ? inspectedSlot.card.shadow[language]
                      : inspectedSlot.card.meaning[language]}
                  </span>
                </div>
                <div>
                  <strong>{beginnerUi.nextMove[language]}</strong>
                  <span>
                    {beginnerActions[inspectedSlot.reversed ? 'reversed' : 'upright'][language]}
                  </span>
                </div>
              </div>
              <div className="keyword-cloud" aria-label={ui.keywords[language]}>
                {inspectedSlot.card.keywords[language].map((keyword) => (
                  <span key={keyword}>{keyword}</span>
                ))}
              </div>
              <small className="gentle-note">{beginnerUi.inspectorPrompt[language]}</small>
            </div>
          </article>
        </div>
      )}
    </main>
  );
}

function PlainNarrativeBlock({
  language,
  narrative,
}: {
  language: Locale;
  narrative: PlainReadingNarrative;
}) {
  return (
    <div className="plain-language-summary">
      <div className="plain-language-summary-heading">
        <MessageSquareText size={16} />
        <strong>{plainSummaryUi.title[language]}</strong>
      </div>

      <section className="plain-summary-section">
        <span>{plainSummaryUi.conclusion[language]}</span>
        <p>{narrative.headline}</p>
      </section>

      <section className="plain-summary-section">
        <span>{plainSummaryUi.overview[language]}</span>
        <p>{narrative.overview}</p>
      </section>

      <section className="plain-summary-section">
        <span>{plainSummaryUi.cardBreakdown[language]}</span>
        <div className="plain-summary-card-list">
          {narrative.cardBreakdown.map((item) => (
            <div className="plain-summary-card" key={`${item.slotId}-${item.cardId}`}>
              <strong>{item.title}</strong>
              <p>{item.body}</p>
              <em>{item.action}</em>
            </div>
          ))}
        </div>
      </section>

      <section className="plain-summary-section">
        <span>{plainSummaryUi.actionPlan[language]}</span>
        <p>{narrative.actionPlan}</p>
      </section>

      <section className="plain-summary-section">
        <span>{plainSummaryUi.reminder[language]}</span>
        <p>{narrative.reminder}</p>
      </section>
    </div>
  );
}

function getBeginnerPositionText(slotId: string, language: Locale) {
  const copy = beginnerPositionCopy[slotId as keyof typeof beginnerPositionCopy];
  return copy?.[language] ?? '';
}

function createReadingId() {
  if (window.crypto?.randomUUID) {
    return window.crypto.randomUUID();
  }

  return `reading-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function getDailyCardEntry(date = new Date()): DailyCardEntry {
  const dateKey = getDateKey(date);
  const seed = hashString(`arcana-kin-${dateKey}`);
  return {
    dateKey,
    cardId: tarotDeck[seed % tarotDeck.length].id,
    reversed: hashString(`${dateKey}-orientation`) % 4 === 0,
  };
}

function getDateKey(date: Date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-');
}

function hashString(value: string) {
  return Array.from(value).reduce((hash, char) => {
    const nextHash = (hash << 5) - hash + char.charCodeAt(0);
    return Math.abs(nextHash | 0);
  }, 2166136261);
}

function getFutureReviewDate(days: number) {
  const dueDate = new Date(Date.now() + days * oneDayMs);
  dueDate.setHours(9, 0, 0, 0);
  return dueDate.toISOString();
}

type ReviewStatus = 'none' | 'scheduled' | 'due' | 'reviewed';

function getReviewStatus(record: ReadingRecord): ReviewStatus {
  if (record.reviewedAt) {
    return 'reviewed';
  }

  if (!record.reviewDueAt) {
    return 'none';
  }

  return new Date(record.reviewDueAt).getTime() <= Date.now() ? 'due' : 'scheduled';
}

function getReviewStatusLabel(status: ReviewStatus, language: Locale) {
  if (status === 'due') {
    return engagementUi.dueNow[language];
  }

  if (status === 'reviewed') {
    return engagementUi.reviewed[language];
  }

  if (status === 'scheduled') {
    return engagementUi.scheduled[language];
  }

  return '';
}

function persistRecords(records: ReadingRecord[]) {
  try {
    window.localStorage.setItem(recordsStorageKey, JSON.stringify(records));
  } catch {
    // The app can still run if private browsing or storage quotas block saves.
  }
}

function isReadingRecord(record: unknown): record is ReadingRecord {
  const value = record as Partial<ReadingRecord> | null;
  return Boolean(
    value &&
      typeof value.id === 'string' &&
      typeof value.createdAt === 'string' &&
      typeof value.question === 'string' &&
      typeof value.spreadId === 'string' &&
      typeof value.modeId === 'string' &&
      (value.language === undefined || isLocale(value.language)) &&
      (value.spreadLabel === undefined || typeof value.spreadLabel === 'string') &&
      (value.spreadDescription === undefined || typeof value.spreadDescription === 'string') &&
      (value.modeLabel === undefined || typeof value.modeLabel === 'string') &&
      (value.plainSummary === undefined || isPlainReadingNarrative(value.plainSummary)) &&
      (value.reviewDueAt === undefined || typeof value.reviewDueAt === 'string') &&
      (value.reviewedAt === undefined || typeof value.reviewedAt === 'string') &&
      (value.reviewNote === undefined || typeof value.reviewNote === 'string') &&
      Array.isArray(value.cards) &&
      value.cards.every(
        (card) =>
          typeof card?.slotId === 'string' &&
          typeof card.cardId === 'string' &&
          typeof card.reversed === 'boolean' &&
          (card.slotLabel === undefined || typeof card.slotLabel === 'string') &&
          (card.cardName === undefined || typeof card.cardName === 'string') &&
          (card.orientationLabel === undefined || typeof card.orientationLabel === 'string') &&
          (card.keywords === undefined || isStringArray(card.keywords)) &&
          (card.positionText === undefined || typeof card.positionText === 'string') &&
          (card.meaning === undefined || typeof card.meaning === 'string') &&
          (card.nextMove === undefined || typeof card.nextMove === 'string'),
      ),
  );
}

function isLocale(value: unknown): value is Locale {
  return value === 'zh-TW' || value === 'en' || value === 'ja';
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

function isPlainReadingNarrative(value: unknown): value is PlainReadingNarrative {
  const narrative = value as Partial<PlainReadingNarrative> | null;
  return Boolean(
    narrative &&
      typeof narrative.headline === 'string' &&
      typeof narrative.overview === 'string' &&
      typeof narrative.actionPlan === 'string' &&
      typeof narrative.reminder === 'string' &&
      isStringArray(narrative.keywords) &&
      Array.isArray(narrative.cardBreakdown) &&
      narrative.cardBreakdown.every(
        (item) =>
          typeof item?.slotId === 'string' &&
          typeof item.cardId === 'string' &&
          typeof item.title === 'string' &&
          typeof item.body === 'string' &&
          typeof item.action === 'string',
      ),
  );
}

function getRecordSpread(record: ReadingRecord) {
  return spreads.find((spread) => spread.id === record.spreadId) ?? spreads[0];
}

function getRecordMode(record: ReadingRecord) {
  return readingModes.find((mode) => mode.id === record.modeId) ?? readingModes[0];
}

function getRecordCards(record: ReadingRecord) {
  const recordSpread = getRecordSpread(record);
  return record.cards.map((entry, index) => ({
    card: tarotDeck.find((card) => card.id === entry.cardId) ?? tarotDeck[0],
    reversed: entry.reversed,
    slot:
      recordSpread.slots.find((slot) => slot.id === entry.slotId) ??
      recordSpread.slots[index] ??
      recordSpread.slots[0],
  }));
}

function normalizeReadingRecord(record: ReadingRecord): ReadingRecord {
  const language = record.language ?? 'zh-TW';
  const recordSpread = getRecordSpread(record);
  const recordMode = getRecordMode(record);
  const readingSlots = getRecordReadingSlots({ ...record, language }, language);
  const storedCards = createStoredReadingCards(readingSlots, language);

  return {
    ...record,
    language,
    spreadLabel: record.spreadLabel ?? recordSpread.labels[language],
    spreadDescription: record.spreadDescription ?? recordSpread.description[language],
    modeLabel: record.modeLabel ?? recordMode.labels[language],
    cards: record.cards.map((card, index) => {
      const storedCard = storedCards[index];
      return {
        ...card,
        keywords: card.keywords ?? storedCard?.keywords,
        slotLabel: card.slotLabel ?? storedCard?.slotLabel,
        cardName: card.cardName ?? storedCard?.cardName,
        orientationLabel: card.orientationLabel ?? storedCard?.orientationLabel,
        positionText: card.positionText ?? storedCard?.positionText,
        meaning: card.meaning ?? storedCard?.meaning,
        nextMove: card.nextMove ?? storedCard?.nextMove,
      };
    }),
    plainSummary:
      record.plainSummary && !isStalePlainSummary(record.plainSummary)
        ? record.plainSummary
        : createPlainReadingNarrative(readingSlots, language, record.question),
  };
}

function getRecordNarrative(record: ReadingRecord, language: Locale) {
  if (record.plainSummary && !isStalePlainSummary(record.plainSummary)) {
    return record.plainSummary;
  }

  return createPlainReadingNarrative(getRecordReadingSlots(record, language), language, record.question);
}

function getRecordReadingSlots(record: ReadingRecord, language: Locale): ReadingSlot[] {
  const recordSpread = getRecordSpread(record);
  return record.cards.map((entry, index) => {
    const card = tarotDeck.find((deckCard) => deckCard.id === entry.cardId) ?? tarotDeck[0];
    const slot =
      recordSpread.slots.find((spreadSlot) => spreadSlot.id === entry.slotId) ??
      recordSpread.slots[index] ??
      recordSpread.slots[0];

    return {
      id: `${record.id}-${entry.slotId}-${entry.cardId}-${index}`,
      slotId: entry.slotId,
      label: slot.label,
      card,
      drawn: true,
      reversed: entry.reversed,
      revealed: true,
    };
  });
}

function createStoredReadingCards(slots: ReadingSlot[], language: Locale): ReadingRecordCard[] {
  return slots.map((slot) => {
    const reversed = slot.reversed;
    return {
      slotId: slot.slotId,
      cardId: slot.card.id,
      reversed,
      slotLabel: slot.label[language],
      cardName: slot.card.names[language],
      orientationLabel: reversed ? ui.reversed[language] : ui.upright[language],
      keywords: slot.card.keywords[language],
      positionText: getBeginnerPositionText(slot.slotId, language),
      meaning: reversed ? slot.card.shadow[language] : slot.card.meaning[language],
      nextMove: beginnerActions[reversed ? 'reversed' : 'upright'][language],
    };
  });
}

function createPlainReadingNarrative(
  slots: ReadingSlot[],
  language: Locale,
  question = '',
): PlainReadingNarrative {
  if (slots.length === 0) {
    return {
      headline: '',
      overview: '',
      cardBreakdown: [],
      actionPlan: '',
      reminder: '',
      keywords: [],
    };
  }

  const focusSlot = getSummaryFocusSlot(slots);
  const actionSlot = getSummaryActionSlot(slots);
  const keywords = getSummaryKeywords(slots, language);
  const keywordText = formatSummaryKeywords(keywords, language);
  const positionText = slots.map((slot) => slot.label[language]).join(getListSeparator(language));
  const reversedCount = slots.filter((slot) => slot.reversed).length;
  const tone =
    reversedCount > slots.length / 2
      ? getSummarySlowTone(language)
      : reversedCount === 0
        ? getSummaryMoveTone(language)
        : getSummaryMixedTone(language);
  const headline = createNarrativeHeadline(focusSlot, actionSlot, language);
  const actionPlan = createNarrativeActionPlan(focusSlot, actionSlot, language);

  if (language === 'en') {
    return {
      headline,
      overview: `${question ? `You asked: "${question}". ` : ''}The spread breaks the situation into ${positionText}. The clearest themes are ${keywordText}. ${tone} The main signal is ${focusSlot.card.names[language]} in ${focusSlot.label[language]}, and the practical exit is ${actionSlot.card.names[language]} in ${actionSlot.label[language]}. Read the cards as one sentence: what started this, what is active now, and what you can actually do next.`,
      cardBreakdown: slots.map((slot) => createCardNarrative(slot, language)),
      actionPlan,
      reminder: 'Use this as a decision note, not as a verdict. The useful part is what it helps you name, test, and follow up on later.',
      keywords,
    };
  }

  if (language === 'ja') {
    return {
      headline,
      overview: `${question ? `問いは「${question}」です。` : ''}この展開は状況を${positionText}に分けています。いちばん強いテーマは${keywordText}です。${tone}中心のサインは${focusSlot.label[language]}の${focusSlot.card.names[language]}で、現実の出口は${actionSlot.label[language]}の${actionSlot.card.names[language]}です。一枚ずつ別々に見るより、「何が始まりで、今どこが動き、次に何を試せるか」と読んでください。`,
      cardBreakdown: slots.map((slot) => createCardNarrative(slot, language)),
      actionPlan,
      reminder: 'これは判決ではなく、考えを整理するためのメモです。役に立つ部分は、気づいたことを言葉にし、試し、後で振り返れることです。',
      keywords,
    };
  }

  return {
    headline,
    overview: `${question ? `你問的是：「${question}」。` : ''}這個牌陣把事情拆成${positionText}。整體最明顯的主題是${keywordText}。${tone}這次的主訊號是「${focusSlot.label[language]}」的${focusSlot.card.names[language]}，真正能落地的出口是「${actionSlot.label[language]}」的${actionSlot.card.names[language]}。所以不要只看單張牌吉凶，要把它串成一句話：事情從哪裡來，現在卡在哪裡，下一步可以怎麼試。`,
    cardBreakdown: slots.map((slot) => createCardNarrative(slot, language)),
    actionPlan,
    reminder: '塔羅在這裡不是替你做決定，而是把混在一起的感受拆開。真正要帶走的是：你現在看見了什麼、哪一張牌最像你的現況、以及你下一步真的做了什麼。',
    keywords,
  };
}

function createCardNarrative(slot: ReadingSlot, language: Locale) {
  const orientation = slot.reversed ? ui.reversed[language] : ui.upright[language];
  const meaning = slot.reversed ? slot.card.shadow[language] : slot.card.meaning[language];
  const positionText = getBeginnerPositionText(slot.slotId, language);
  const nextMove = beginnerActions[slot.reversed ? 'reversed' : 'upright'][language];
  const title = `${slot.label[language]}：${slot.card.names[language]}（${orientation}）`;

  if (language === 'en') {
    return {
      slotId: slot.slotId,
      cardId: slot.card.id,
      title,
      body: `${positionText} In plain words, this card says: ${meaning}`,
      action: `Use it like this: ${nextMove}`,
    };
  }

  if (language === 'ja') {
    return {
      slotId: slot.slotId,
      cardId: slot.card.id,
      title,
      body: `${positionText} 簡単に言うと、このカードは「${meaning}」ということです。`,
      action: `使い方：${nextMove}`,
    };
  }

  return {
    slotId: slot.slotId,
    cardId: slot.card.id,
    title,
    body: `${positionText} 白話說，這張牌的意思是：${meaning}`,
    action: `你可以這樣用它：${nextMove}`,
  };
}

function createNarrativeHeadline(
  focusSlot: ReadingSlot,
  actionSlot: ReadingSlot,
  language: Locale,
) {
  const focusOrientation = getSlotOrientation(focusSlot, language);
  const actionOrientation = getSlotOrientation(actionSlot, language);
  const focusKeyword = getPrimaryKeyword(focusSlot, language);
  const actionKeyword = getPrimaryKeyword(actionSlot, language);
  const focusMeaning = getSlotMeaning(focusSlot, language);
  const actionMeaning = getSlotMeaning(actionSlot, language);

  if (language === 'en') {
    return `The clearest message comes from ${focusSlot.card.names[language]} (${focusOrientation}) in ${focusSlot.label[language]}: ${focusMeaning} The practical next step comes from ${actionSlot.card.names[language]} (${actionOrientation}) and its theme of "${actionKeyword}": ${actionMeaning}`;
  }

  if (language === 'ja') {
    return `いちばん大事なメッセージは、${focusSlot.label[language]}の${focusSlot.card.names[language]}（${focusOrientation}）です。テーマは「${focusKeyword}」で、意味は「${focusMeaning}」。次の一歩は${actionSlot.label[language]}の${actionSlot.card.names[language]}（${actionOrientation}）が示す「${actionKeyword}」を現実に移すことです。`;
  }

  return `這組牌最直接的訊息是：「${focusSlot.label[language]}」的${focusSlot.card.names[language]}（${focusOrientation}）正在點出「${focusKeyword}」這件事：${focusMeaning} 接下來真正能動的是「${actionSlot.label[language]}」的${actionSlot.card.names[language]}（${actionOrientation}），把「${actionKeyword}」落到現實：${actionMeaning}`;
}

function createNarrativeActionPlan(
  focusSlot: ReadingSlot,
  actionSlot: ReadingSlot,
  language: Locale,
) {
  const focusKeyword = getPrimaryKeyword(focusSlot, language);
  const actionKeyword = getPrimaryKeyword(actionSlot, language);

  if (language === 'en') {
    return `Today, name one real-life example of "${focusKeyword}" from your situation, then choose one 15-minute action that expresses "${actionKeyword}". Keep it concrete: send one message, write one paragraph, make one list, set one boundary, or schedule one next step. Afterward, record what actually changed.`;
  }

  if (language === 'ja') {
    return `今日はまず「${focusKeyword}」が現実のどの場面に出ているかを一つ書いてください。その後、「${actionKeyword}」を表す15分以内の行動を一つ選びます。連絡する、短く書く、リストを作る、境界線を引く、次の予定を入れる、のように具体的にしてください。終わったら実際に何が変わったかを記録します。`;
  }

  return `今天先把「${focusKeyword}」對應到一件真實發生的事，寫成一句：「我現在其實在面對____。」然後把「${actionKeyword}」變成一個 15 分鐘內能完成的動作：傳一則訊息、寫一段整理、列一張清單、劃一條界線，或安排下一個時間點。做完再記下實際變化，不要只停在想。`;
}

function getSlotOrientation(slot: ReadingSlot, language: Locale) {
  return slot.reversed ? ui.reversed[language] : ui.upright[language];
}

function getSlotMeaning(slot: ReadingSlot, language: Locale) {
  return slot.reversed ? slot.card.shadow[language] : slot.card.meaning[language];
}

function getPrimaryKeyword(slot: ReadingSlot, language: Locale) {
  return slot.card.keywords[language][0] ?? slot.card.names[language];
}

function isStalePlainSummary(narrative: PlainReadingNarrative) {
  return (
    narrative.headline.startsWith('這次不是在叫你猜結果，而是在說：先把') ||
    narrative.headline.startsWith('This is not mainly about predicting an outcome.') ||
    narrative.headline.startsWith('これは未来を当てるためだけの結果ではありません。まず')
  );
}

function getSummaryFocusSlot(slots: ReadingSlot[]) {
  const focusOrder = ['presence', 'core', 'key', 'message', 'self', 'water'];
  return (
    slots.find((slot) => focusOrder.includes(slot.slotId)) ??
    slots[Math.floor((slots.length - 1) / 2)] ??
    slots[0]
  );
}

function getSummaryActionSlot(slots: ReadingSlot[]) {
  const actionOrder = ['step', 'direction', 'integration', 'invitation', 'earth', 'key'];
  return slots.find((slot) => actionOrder.includes(slot.slotId)) ?? slots[slots.length - 1];
}

function getSummaryKeywords(slots: ReadingSlot[], language: Locale) {
  const keywordCounts = new Map<string, number>();
  slots.forEach((slot) => {
    slot.card.keywords[language].forEach((keyword) => {
      keywordCounts.set(keyword, (keywordCounts.get(keyword) ?? 0) + 1);
    });
  });

  return Array.from(keywordCounts.entries())
    .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0], language))
    .slice(0, 3)
    .map(([keyword]) => keyword);
}

function formatSummaryKeywords(keywords: string[], language: Locale) {
  const fallback = {
    'zh-TW': ['現在最卡住的地方'],
    en: ['what feels stuck right now'],
    ja: ['今つまずいていること'],
  }[language];
  const sourceKeywords = keywords.length > 0 ? keywords : fallback;

  if (language === 'en') {
    return sourceKeywords.map((keyword) => `"${keyword}"`).join(', ');
  }

  return sourceKeywords.map((keyword) => `「${keyword}」`).join('、');
}

function getListSeparator(language: Locale) {
  return language === 'en' ? ', ' : '、';
}

function getSummarySlowTone(language: Locale) {
  return {
    'zh-TW': '逆位比較多，代表現在有不少地方還卡住；先不要急著硬推，也不要急著替自己下結論。',
    en: 'Because many cards are reversed, several parts are still stuck; slow down instead of forcing a conclusion.',
    ja: '逆位置が多いので、まだ詰まっている部分があります。急いで結論を出さず、少し速度を落としてください。',
  }[language];
}

function getSummaryMixedTone(language: Locale) {
  return {
    'zh-TW': '正逆位混在，代表這件事不是完全不行，也不是一路順；可以往前走，但要邊走邊校正。',
    en: 'With both upright and reversed cards, this is neither blocked nor effortless; move forward, but adjust as you go.',
    ja: '正位置と逆位置が混ざっているので、完全に止まっているわけでも、すべて順調なわけでもありません。進みながら調整してください。',
  }[language];
}

function getSummaryMoveTone(language: Locale) {
  return {
    'zh-TW': '牌面多半順著走，代表現在不需要想太複雜；用小步驟把想法落地，比繼續猶豫更有用。',
    en: 'The cards are mostly moving with you, so keep it simple; a small grounded step is more useful than more hesitation.',
    ja: 'カードはおおむね流れに乗っています。考えすぎるより、小さな一歩で現実に移す方が役に立ちます。',
  }[language];
}

function formatRecordDate(createdAt: string, language: Locale) {
  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) {
    return createdAt;
  }

  return new Intl.DateTimeFormat(language, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

function formatReviewDate(dueAt: string, language: Locale) {
  const date = new Date(dueAt);
  if (Number.isNaN(date.getTime())) {
    return dueAt;
  }

  return new Intl.DateTimeFormat(language, {
    month: 'short',
    day: 'numeric',
  }).format(date);
}

function formatDailyDate(dateKey: string, language: Locale) {
  const date = new Date(`${dateKey}T00:00:00`);
  return new Intl.DateTimeFormat(language, {
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  }).format(date);
}

function getInsights(records: ReadingRecord[], language: Locale) {
  const now = Date.now();
  const recentRecords = records.filter((record) => {
    const createdAt = new Date(record.createdAt).getTime();
    return Number.isFinite(createdAt) && now - createdAt <= 7 * oneDayMs;
  });
  const sourceRecords = recentRecords.length > 0 ? recentRecords : records;
  const cardCounts = new Map<string, number>();
  const keywordCounts = new Map<string, number>();
  let reversedCards = 0;
  let totalCards = 0;

  sourceRecords.forEach((record) => {
    getRecordCards(record).forEach(({ card, reversed }) => {
      totalCards += 1;
      if (reversed) {
        reversedCards += 1;
      }

      cardCounts.set(card.names[language], (cardCounts.get(card.names[language]) ?? 0) + 1);
      card.keywords[language].forEach((keyword) => {
        keywordCounts.set(keyword, (keywordCounts.get(keyword) ?? 0) + 1);
      });
    });
  });

  return {
    recentCount: recentRecords.length,
    reversalRatio: totalCards === 0 ? 0 : Math.round((reversedCards / totalCards) * 100),
    topCards: getTopStats(cardCounts, 3),
    topKeywords: getTopStats(keywordCounts, 4),
  };
}

function getTopStats(stats: Map<string, number>, limit: number) {
  const items = Array.from(stats.entries())
    .sort((left, right) => right[1] - left[1])
    .slice(0, limit)
    .map(([label, count]) => ({ label, count }));

  return items.length > 0 ? items : [{ label: '—', count: 0 }];
}

function getCardPaletteStyle(slot: ReadingSlot) {
  return {
    '--card-primary': slot.card.palette[0],
    '--card-secondary': slot.card.palette[1],
    '--card-dark': slot.card.palette[2],
  } as React.CSSProperties;
}

function getCardPaletteStyleFromCard(card: { palette: [string, string, string] }) {
  return {
    '--card-primary': card.palette[0],
    '--card-secondary': card.palette[1],
    '--card-dark': card.palette[2],
  } as React.CSSProperties;
}

function downloadShareCard(record: ReadingRecord, language: Locale) {
  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 1600;
  const context = canvas.getContext('2d');

  if (!context) {
    return;
  }

  const cards = getRecordCards(record);
  const spread = getRecordSpread(record);
  const mode = getRecordMode(record);
  const narrative = getRecordNarrative(record, language);
  const gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, '#171111');
  gradient.addColorStop(0.5, '#24201b');
  gradient.addColorStop(1, '#121716');
  context.fillStyle = gradient;
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.fillStyle = 'rgba(242, 198, 109, 0.18)';
  context.beginPath();
  context.arc(950, 230, 360, 0, Math.PI * 2);
  context.fill();

  context.fillStyle = '#f2c66d';
  context.font = '700 34px "Segoe UI", "Noto Sans TC", sans-serif';
  context.fillText('Arcana Kin', 88, 105);

  context.fillStyle = '#fff7e7';
  context.font = '800 62px "Segoe UI", "Noto Sans TC", sans-serif';
  wrapCanvasText(context, record.question, 88, 205, 960, 76, 3);

  context.fillStyle = '#c7bdae';
  context.font = '700 28px "Segoe UI", "Noto Sans TC", sans-serif';
  context.fillText(
    `${formatRecordDate(record.createdAt, language)} · ${
      record.spreadLabel ?? spread.labels[language]
    } · ${record.modeLabel ?? mode.labels[language]}`,
    88,
    455,
  );

  const shareCards = cards.slice(0, 6);
  const rowCount = shareCards.length > 3 ? 2 : 1;
  const columns = Math.min(3, shareCards.length);
  const cardWidth = rowCount > 1 ? 188 : 270;
  const cardHeight = cardWidth * 1.5;
  const gap = rowCount > 1 ? 34 : 42;
  const rowGap = rowCount > 1 ? 64 : 0;
  const cardY = rowCount > 1 ? 510 : 560;

  shareCards.forEach(({ card, reversed, slot }, index) => {
    const row = Math.floor(index / columns);
    const column = index % columns;
    const cardsInRow = Math.min(columns, shareCards.length - row * columns);
    const startX = (canvas.width - cardsInRow * cardWidth - (cardsInRow - 1) * gap) / 2;
    const x = startX + column * (cardWidth + gap);
    const y = cardY + row * (cardHeight + rowGap);
    const cardGradient = context.createLinearGradient(x, y, x + cardWidth, y + cardHeight);
    cardGradient.addColorStop(0, card.palette[0]);
    cardGradient.addColorStop(0.48, card.palette[1]);
    cardGradient.addColorStop(1, card.palette[2]);

    roundRect(context, x, y, cardWidth, cardHeight, 24);
    context.fillStyle = cardGradient;
    context.fill();
    context.strokeStyle = 'rgba(255, 238, 190, 0.82)';
    context.lineWidth = 5;
    context.stroke();

    context.fillStyle = 'rgba(15, 13, 16, 0.42)';
    roundRect(context, x + 20, y + 20, cardWidth - 40, cardHeight - 40, 18);
    context.fill();

    context.fillStyle = '#fff7e7';
    context.font = `${rowCount > 1 ? 54 : 66}px "Segoe UI", "Noto Sans TC", sans-serif`;
    context.textAlign = 'center';
    context.fillText(card.glyph, x + cardWidth / 2, y + cardHeight * 0.42);
    context.font = `800 ${rowCount > 1 ? 23 : 30}px "Segoe UI", "Noto Sans TC", sans-serif`;
    wrapCanvasText(context, card.names[language], x + cardWidth / 2, y + cardHeight * 0.65, cardWidth - 44, rowCount > 1 ? 29 : 36, 2, 'center');
    context.font = `700 ${rowCount > 1 ? 18 : 22}px "Segoe UI", "Noto Sans TC", sans-serif`;
    context.fillStyle = reversed ? '#ffb0c0' : '#bdeedd';
    context.fillText(reversed ? ui.reversed[language] : ui.upright[language], x + cardWidth / 2, y + cardHeight * 0.87);

    context.textAlign = 'left';
    context.fillStyle = '#f2c66d';
    context.font = `700 ${rowCount > 1 ? 19 : 22}px "Segoe UI", "Noto Sans TC", sans-serif`;
    context.fillText(slot.label[language], x, y + cardHeight + 34);
  });

  context.fillStyle = '#fff7e7';
  context.font = '700 32px "Segoe UI", "Noto Sans TC", sans-serif';
  wrapCanvasText(
    context,
    narrative.headline
      ? `${narrative.headline} ${narrative.actionPlan}`
      : language === 'en'
        ? 'A small mirror for the next step.'
        : language === 'ja'
          ? '次の一歩のための小さな鏡。'
          : '給下一步的一面小鏡子。',
    88,
    rowCount > 1 ? 1250 : 1165,
    1000,
    48,
    4,
  );

  context.fillStyle = '#c7bdae';
  context.font = '700 24px "Segoe UI", "Noto Sans TC", sans-serif';
  context.fillText('tamyu321-source.github.io/tarot-web', 88, 1490);

  const link = document.createElement('a');
  link.download = `arcana-kin-${record.createdAt.slice(0, 10)}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}

function wrapCanvasText(
  context: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines: number,
  align: CanvasTextAlign = 'left',
) {
  const previousAlign = context.textAlign;
  context.textAlign = align;
  const words = text.includes(' ') ? text.split(' ') : Array.from(text);
  let line = '';
  let lineIndex = 0;

  for (let index = 0; index < words.length; index += 1) {
    const spacer = text.includes(' ') && line ? ' ' : '';
    const testLine = `${line}${spacer}${words[index]}`;

    if (context.measureText(testLine).width > maxWidth && line && lineIndex < maxLines - 1) {
      context.fillText(line, x, y + lineIndex * lineHeight);
      line = words[index];
      lineIndex += 1;
    } else if (context.measureText(testLine).width > maxWidth && line) {
      line = `${line}…`;
      break;
    } else {
      line = testLine;
    }
  }

  if (lineIndex < maxLines) {
    context.fillText(line, x, y + lineIndex * lineHeight);
  }

  context.textAlign = previousAlign;
}

function roundRect(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  context.beginPath();
  context.moveTo(x + radius, y);
  context.arcTo(x + width, y, x + width, y + height, radius);
  context.arcTo(x + width, y + height, x, y + height, radius);
  context.arcTo(x, y + height, x, y, radius);
  context.arcTo(x, y, x + width, y, radius);
  context.closePath();
}

export default App;
