/**
 * Theme definitions for per-game visual styling.
 *
 * Each game screen uses a distinct theme (colors, fonts, spacing)
 * that is resolved from the current route segment.
 */

export interface Theme {
  colors: {
    background: string;
    card: string;
    cardAlt?: string;
    text: string;
    textMuted: string;
    accent: string;
    accentLight?: string;
    border?: string;
    parchment?: string;
  };
  fonts: {
    body: string;
    heading: string;
  };
  spacing: {
    sectionMargin: number;
    cardPadding: number;
    containerPadding: number;
  };
}

export const homeTheme: Theme = {
  colors: {
    background: '#1a1a2e',
    card: '#2a2a4e',
    text: '#e0e0e0',
    textMuted: '#a0a0b0',
    accent: '#6c63ff',
  },
  fonts: { body: 'System', heading: 'System' },
  spacing: { sectionMargin: 24, cardPadding: 20, containerPadding: 16 },
};

export const cobTheme: Theme = {
  colors: {
    background: '#1a0f0a',
    card: '#faf3e6',
    cardAlt: '#fff9ee',
    text: '#3b2a1a',
    textMuted: '#8a7a60',
    accent: '#c9a84c',
    accentLight: '#f0d68a',
    border: '#d4c4a0',
    parchment: '#faf3e6',
  },
  fonts: { body: 'Crimson Text', heading: 'Cinzel' },
  spacing: { sectionMargin: 30, cardPadding: 20, containerPadding: 20 },
};

export const quacksTheme: Theme = {
  colors: {
    background: '#1a0e2e',
    card: '#2a1745',
    cardAlt: '#341d54',
    text: '#e8dcc8',
    textMuted: '#a89bb5',
    accent: '#d4a843',
    accentLight: '#f0d68a',
    border: '#4a2d6e',
    parchment: '#f5e6c8',
  },
  fonts: { body: 'System', heading: 'Georgia' },
  spacing: { sectionMargin: 24, cardPadding: 16, containerPadding: 16 },
};

/** Maps route segments to their corresponding theme. */
export const themeMap: Record<string, Theme> = {
  '': homeTheme,
  'castles-of-burgundy': cobTheme,
  'quacks': quacksTheme,
};
