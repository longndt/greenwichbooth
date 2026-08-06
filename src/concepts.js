// Poster themes: token data only; renderer lives in src/poster/render.js.

export const POSTER_THEMES = [
  {
    id: 1,
    name: 'mẫu A',
    bg: {
      color: '#F7F2E9',
      texture: { type: 'grid', color: 'rgba(10,91,102,0.06)', step: 34 },
    },
    header: {
      bg: '#F7F2E9',
      topBar: { color: '#D6A72C', height: 7 },
      bottomBar: { colors: ['rgba(10,91,102,0.08)', 'rgba(10,91,102,0.28)'], height: 2 },
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
      slotShadow: 'rgba(10,91,102,0.16)',
      slotBg: '#FFFDF6',
      borderColor: '#D6A72C',
      borderWidth: 3,
      radius: 10,
      cornerAccent: { color: '#0A5B66', size: 22, lw: 2 },
    },
    footer: {
      bg: '#082733',
      borderColor: '#86C8B7',
      glow: 'rgba(10,91,102,0.18)',
      hashtag: { text: 'Greenwich moment', color: '#0A5B66' },
      script: { family: '"Cormorant Garamond", serif', color: '#B85C19', italic: true },
    },
    frame: { outer: 'transparent', outerW: 0, inner: '#D6A72C', innerW: 2 },
  },
  {
    id: 2,
    name: 'mẫu B',
    bg: {
      color: '#0B1320',
      texture: { type: 'dots', color: 'rgba(255,255,255,0.06)', step: 44 },
    },
    header: {
      bg: '#0B1320',
      topBar: { color: '#F5C542', height: 7 },
      bottomBar: { colors: ['rgba(124,203,185,0.18)', 'rgba(245,197,66,0.28)'], height: 3 },
    },
    title: { color: '#F8F3E6' },
    subtitle: { color: '#7CCBB9' },
    event: { color: '#F5C542' },
    text: {
      school: 'GREENWICH VIETNAM',
      subtitle: 'Change Starts Here',
      footer: 'Greenwich moment',
    },
    meta: { color: '#D7E8E4' },
    date: { color: '#F8F3E6' },
    photos: {
      slotShadow: 'rgba(245,197,66,0.14)',
      slotBg: '#111B2D',
      borderColor: '#7CCBB9',
      borderWidth: 3,
      radius: 22,
      cornerAccent: { color: '#F5C542', size: 32, lw: 3 },
    },
    footer: {
      bg: '#050B14',
      borderColor: '#F5C542',
      glow: 'rgba(245,197,66,0.16)',
      hashtag: { text: 'Greenwich moment', color: '#F8F3E6' },
      script: { family: '"Cormorant Garamond", serif', color: '#F5C542', italic: true },
    },
    frame: { outer: 'rgba(245,197,66,0.18)', outerW: 0, inner: '#F5C542', innerW: 2 },
  },
];
