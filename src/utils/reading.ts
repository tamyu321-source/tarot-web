import { tarotDeck } from '../data/tarot';
import type { ReadingSlot, SpreadDefinition, TarotCard } from '../types';

function randomIndex(max: number): number {
  if (window.crypto?.getRandomValues) {
    const value = new Uint32Array(1);
    window.crypto.getRandomValues(value);
    return value[0] % max;
  }

  return Math.floor(Math.random() * max);
}

function drawUniqueCards(count: number): TarotCard[] {
  const pool = [...tarotDeck];
  const cards: TarotCard[] = [];

  while (cards.length < count && pool.length > 0) {
    const index = randomIndex(pool.length);
    cards.push(pool[index]);
    pool.splice(index, 1);
  }

  return cards;
}

export function createReading(spread: SpreadDefinition): ReadingSlot[] {
  return drawUniqueCards(spread.slots.length).map((card, index) => ({
    id: `${spread.id}-${spread.slots[index].id}-${card.id}`,
    label: spread.slots[index].label,
    card,
    reversed: randomIndex(100) < 32,
    revealed: false,
  }));
}
