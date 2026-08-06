// Poster themes: token data only; renderer lives in src/poster/render.js.

export const POSTER_THEMES = [
  {
    id: 1,
    name: 'màu 1',
    bg: {
      color: '#EAF7F0',
      texture: { type: 'grid', color: 'rgba(0,127,95,0.10)', step: 34 },
    },
    header: {
      bg: '#EAF7F0',
      topBar: { color: '#00A676', height: 7 },
      bottomBar: { colors: ['rgba(0,127,95,0.10)', 'rgba(0,127,95,0.30)'], height: 2 },
    },
    title: { color: '#0A5B66' },
    subtitle: { color: '#9C6120' },
    event: { color: '#B85C19' },
    text: {
      school: 'GREENWICH VIETNAM',
      subtitle: 'Change Starts Here',
      footer: 'Greenwich moment',
    },
    meta: { color: '#375B63' },
    date: { color: '#8A5B1E' },
    photos: {
      slotShadow: 'rgba(0,127,95,0.18)',
      slotBg: '#FFFDF6',
      borderColor: '#00A676',
      borderWidth: 3,
      radius: 10,
      cornerAccent: { color: '#007F5F', size: 22, lw: 2 },
    },
    footer: {
      bg: '#082733',
      borderColor: '#86C8B7',
      glow: 'rgba(0,127,95,0.18)',
      hashtag: { text: 'Greenwich moment', color: '#0A5B66' },
      script: { family: '"Cormorant Garamond", serif', color: '#B85C19', italic: true },
    },
    frame: { outer: 'transparent', outerW: 0, inner: '#00A676', innerW: 2 },
  },
  {
    id: 2,
    name: 'màu 2',
    bg: {
      color: '#EAF1FF',
      texture: { type: 'grid', color: 'rgba(42,107,255,0.12)', step: 34 },
    },
    header: {
      bg: '#EAF1FF',
      topBar: { color: '#2A6BFF', height: 7 },
      bottomBar: { colors: ['rgba(42,107,255,0.10)', 'rgba(42,107,255,0.30)'], height: 2 },
    },
    title: { color: '#184E5D' },
    subtitle: { color: '#A15C28' },
    event: { color: '#2A6BFF' },
    text: {
      school: 'GREENWICH VIETNAM',
      subtitle: 'Change Starts Here',
      footer: 'Greenwich moment',
    },
    meta: { color: '#43646B' },
    date: { color: '#A15C28' },
    photos: {
      slotShadow: 'rgba(42,107,255,0.16)',
      slotBg: '#FFFBFF',
      borderColor: '#2A6BFF',
      borderWidth: 3,
      radius: 10,
      cornerAccent: { color: '#123C9C', size: 22, lw: 2 },
    },
    footer: {
      bg: '#082733',
      borderColor: '#7CCBB9',
      glow: 'rgba(42,107,255,0.12)',
      hashtag: { text: 'Greenwich moment', color: '#184E5D' },
      script: { family: '"Cormorant Garamond", serif', color: '#A15C28', italic: true },
    },
    frame: { outer: 'transparent', outerW: 0, inner: '#2A6BFF', innerW: 2 },
  },
];
