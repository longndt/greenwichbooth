// Poster themes: token data only; renderer lives in src/poster/render.js.

export const POSTER_THEMES = [
  {
    id: 1,
    name: 'màu 1',
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
    name: 'màu 2',
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
      slotBg: '#FFFBFF',
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
];
