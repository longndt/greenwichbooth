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
      color: '#E7F4F0',
      texture: { type: 'grid', color: 'rgba(24,78,93,0.075)', step: 34 },
    },
    header: {
      bg: '#E7F4F0',
      topBar: { color: '#8F5CC8', height: 7 },
      bottomBar: { colors: ['rgba(24,78,93,0.08)', 'rgba(143,92,200,0.18)'], height: 2 },
    },
    title: { color: '#184E5D' },
    subtitle: { color: '#A15C28' },
    event: { color: '#8F5CC8' },
    text: {
      school: 'GREENWICH VIETNAM',
      subtitle: 'Change Starts Here',
      footer: 'Greenwich moment',
    },
    meta: { color: '#43646B' },
    date: { color: '#A15C28' },
    photos: {
      slotShadow: 'rgba(168,103,29,0.14)',
      slotBg: '#FAFFFD',
      borderColor: '#8F5CC8',
      borderWidth: 3,
      radius: 10,
      cornerAccent: { color: '#184E5D', size: 22, lw: 2 },
    },
    footer: {
      bg: '#082733',
      borderColor: '#7CCBB9',
      glow: 'rgba(143,92,200,0.12)',
      hashtag: { text: 'Greenwich moment', color: '#184E5D' },
      script: { family: '"Cormorant Garamond", serif', color: '#A15C28', italic: true },
    },
    frame: { outer: 'transparent', outerW: 0, inner: '#8F5CC8', innerW: 2 },
  },
];
