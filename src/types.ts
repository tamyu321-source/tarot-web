export type Locale = 'zh-TW' | 'en' | 'ja';

export type Localized<T> = Record<Locale, T>;

export interface TarotCard {
  id: string;
  arcana: 'major' | 'minor';
  suit?: 'wands' | 'cups' | 'swords' | 'pentacles';
  rank?: string;
  glyph: string;
  names: Localized<string>;
  keywords: Localized<string[]>;
  meaning: Localized<string>;
  shadow: Localized<string>;
  palette: [string, string, string];
}

export interface SpreadSlot {
  id: string;
  label: Localized<string>;
  x: number;
  z: number;
  rotation: number;
}

export interface SpreadDefinition {
  id: string;
  labels: Localized<string>;
  description: Localized<string>;
  slots: SpreadSlot[];
}

export interface ReadingSlot {
  id: string;
  slotId: string;
  label: Localized<string>;
  card: TarotCard;
  drawn: boolean;
  reversed: boolean;
  revealed: boolean;
}

export interface ReadingMode {
  id: string;
  labels: Localized<string>;
  accent: string;
}
