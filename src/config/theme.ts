export interface BadgePalette {
  accent: string;
  accentText: string;
  onAccent: string;
  ink: string;
  inkMuted: string;
  inkFaint: string;
  cardTop: string;
  cardBottom: string;
  cardEdge: string;
  slot: string;
  brushLine: string;
  railMetal: string;
}

export const CARD_FINISHES = {
  silver: 'silver',
  mint: 'mint',
  champagne: 'champagne',
  lavender: 'lavender',
} as const;

export type CardFinishName = (typeof CARD_FINISHES)[keyof typeof CARD_FINISHES];

export interface CardFinish {
  baseStops: string[];
  foilStops: string[];
  edge: string;
}

const SILVER_FOIL = ['#f4f6f8', '#b3bac5', '#ffffff', '#959eab', '#dde2e8'];

export const cardFinishes: Record<CardFinishName, CardFinish> = {
  [CARD_FINISHES.silver]: {
    baseStops: ['#eef0f4', '#b4bac6', '#e6e9ee', '#9ea5b3', '#d6dae2'],
    foilStops: ['#f7dd8c', '#b8862a', '#fff1c2', '#9c7020', '#e6c060'],
    edge: '#c3c8d2',
  },
  [CARD_FINISHES.mint]: {
    baseStops: ['#e6f3ee', '#bcdccf', '#e0f0e9', '#a6cdbf', '#d1e8de'],
    foilStops: SILVER_FOIL,
    edge: '#a8c8bc',
  },
  [CARD_FINISHES.champagne]: {
    baseStops: ['#fbf6f0', '#ead9c7', '#f8f1e9', '#dcc5ae', '#f1e5d8'],
    foilStops: ['#f6dcd2', '#c9917f', '#fbeae4', '#b07766', '#e7c1b4'],
    edge: '#dcc7b6',
  },
  [CARD_FINISHES.lavender]: {
    baseStops: ['#eeebf9', '#d0c7ec', '#e9e5f7', '#bbb0df', '#dbd4f1'],
    foilStops: SILVER_FOIL,
    edge: '#c0b7e0',
  },
};

export const badgePalette: BadgePalette = {
  accent: '#5138ee',
  accentText: '#5138ee',
  onAccent: '#ffffff',
  ink: '#14161c',
  inkMuted: 'rgba(20, 22, 28, 0.6)',
  inkFaint: 'rgba(20, 22, 28, 0.06)',
  cardTop: '#ffffff',
  cardBottom: '#e9ebf1',
  cardEdge: '#c3c8d2',
  slot: '#9aa0ad',
  brushLine: 'rgba(255, 255, 255, 0.45)',
  railMetal: '#8b93a3',
};
