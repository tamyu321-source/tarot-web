import { useMemo, useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  Circle,
  Languages,
  Library,
  Lightbulb,
  RotateCcw,
  Shuffle,
  Sparkles,
  WandSparkles,
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
  ui,
} from './data/tarot';
import { createReading } from './utils/reading';
import type { Locale, ReadingSlot } from './types';

function App() {
  const [language, setLanguage] = useState<Locale>('zh-TW');
  const [spreadId, setSpreadId] = useState(spreads[0].id);
  const [modeId, setModeId] = useState(readingModes[0].id);
  const [intention, setIntention] = useState('');
  const [reading, setReading] = useState<ReadingSlot[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [beginnerMode, setBeginnerMode] = useState(true);

  const spread = useMemo(
    () => spreads.find((item) => item.id === spreadId) ?? spreads[0],
    [spreadId],
  );
  const mode = useMemo(
    () => readingModes.find((item) => item.id === modeId) ?? readingModes[0],
    [modeId],
  );
  const revealedCount = reading.filter((slot) => slot.revealed).length;
  const activeSlot = activeIndex === null ? null : reading[activeIndex] ?? null;
  const completed = reading.length > 0 && revealedCount === reading.length;
  const hasQuestion = intention.trim().length > 0;
  const nextUnrevealedIndex = reading.findIndex((slot) => !slot.revealed);
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

  const castReading = () => {
    if (!hasQuestion) {
      setIntention(beginnerUi.defaultQuestion[language]);
    }
    setReading(createReading(spread));
    setActiveIndex(null);
  };

  const clearReading = () => {
    setReading([]);
    setActiveIndex(null);
  };

  const revealCard = (index: number) => {
    setReading((current) =>
      current.map((slot, slotIndex) =>
        slotIndex === index ? { ...slot, revealed: true } : slot,
      ),
    );
    setActiveIndex(index);
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
      return reading.length > 0 ? 'done' : hasQuestion ? 'active' : '';
    }

    if (stepId === 'read') {
      return completed ? 'done' : reading.length > 0 ? 'active' : '';
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
                : ui.activePrompt[language]}
          </span>
        </div>
        <TarotScene
          activeIndex={activeIndex}
          language={language}
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
            {revealedCount}/{reading.length || spread.slots.length}
          </span>
        </header>

        <div className="reading-context">
          <span style={{ backgroundColor: mode.accent }} />
          <strong>{mode.labels[language]}</strong>
          <p>{reading.length || hasQuestion ? readingQuestion : beginnerUi.emptyBody[language]}</p>
        </div>

        <div className="slot-list">
          {(reading.length ? reading : spread.slots).map((slot, index) => {
            const readingSlot = 'card' in slot ? slot : null;
            const isActive = activeIndex === index;
            const isNext = readingSlot && !readingSlot.revealed && index === nextUnrevealedIndex;
            return (
              <button
                className={[
                  'slot-row',
                  isActive ? 'active' : '',
                  isNext ? 'next' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                disabled={!readingSlot}
                key={slot.id}
                onClick={() => {
                  if (readingSlot?.revealed) {
                    setActiveIndex(index);
                  } else if (readingSlot) {
                    revealCard(index);
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
                        : isNext
                          ? beginnerUi.revealNext[language]
                          : beginnerUi.waitingLabel[language]}
                    </em>
                  )}
                </div>
                <small>
                  {readingSlot?.revealed
                    ? readingSlot.card.names[language]
                    : readingSlot
                      ? ui.hidden[language]
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
          ) : (
            <>
              <p>{ui.deckReady[language]}</p>
              <h3>{beginnerMode ? beginnerUi.emptyTitle[language] : ui.emptyReading[language]}</h3>
              <span className="orientation">{spread.description[language]}</span>
              {beginnerMode && <p className="meaning">{beginnerUi.emptyBody[language]}</p>}
            </>
          )}
        </article>
        {beginnerMode && completed && (
          <div className="completion-note">
            <strong>{beginnerUi.completeTitle[language]}</strong>
            <span>{beginnerUi.completeBody[language]}</span>
          </div>
        )}
      </aside>
    </main>
  );
}

function getBeginnerPositionText(slotId: string, language: Locale) {
  const copy = beginnerPositionCopy[slotId as keyof typeof beginnerPositionCopy];
  return copy?.[language] ?? '';
}

export default App;
