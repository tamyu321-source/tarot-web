import { useEffect, useMemo, useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  Circle,
  Eye,
  History,
  Languages,
  Library,
  Lightbulb,
  RotateCcw,
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
const maxStoredRecords = 12;

interface ReadingRecord {
  id: string;
  createdAt: string;
  question: string;
  spreadId: string;
  modeId: string;
  cards: Array<{
    slotId: string;
    cardId: string;
    reversed: boolean;
  }>;
}

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
  const recordCountText = beginnerUi.recordCount[language].replace('{count}', String(records.length));
  const isCurrentReadingSaved = completed && savedReadingId === readingSessionId;

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
        .slice(0, maxStoredRecords);
      setRecords(normalizedRecords);
      setSelectedRecordId(normalizedRecords[0]?.id ?? null);
    } catch {
      setRecords([]);
    }
  }, []);

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
      cards: reading.map((slot) => ({
        slotId: slot.slotId,
        cardId: slot.card.id,
        reversed: slot.reversed,
      })),
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
    mode.id,
    reading,
    readingQuestion,
    readingSessionId,
    savedReadingId,
    spread.id,
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
            <small>{beginnerUi.completeReviewHint[language]}</small>
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
              <div className="record-list">
                {records.slice(0, 4).map((record, index) => {
                  const recordSpread = getRecordSpread(record);
                  const recordMode = getRecordMode(record);
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
      Array.isArray(value.cards) &&
      value.cards.every(
        (card) =>
          typeof card?.slotId === 'string' &&
          typeof card.cardId === 'string' &&
          typeof card.reversed === 'boolean',
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

function getCardPaletteStyle(slot: ReadingSlot) {
  return {
    '--card-primary': slot.card.palette[0],
    '--card-secondary': slot.card.palette[1],
    '--card-dark': slot.card.palette[2],
  } as React.CSSProperties;
}

export default App;
