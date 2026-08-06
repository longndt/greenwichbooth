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
      color: '#101B2A',
      texture: { type: 'dots', color: 'rgba(255,255,255,0.045)', step: 44 },
    },
    header: {
      bg: '#101B2A',
      topBar: { color: '#E7B845', height: 6 },
      bottomBar: { colors: ['rgba(125,206,190,0.10)', 'rgba(231,184,69,0.16)'], height: 0 },
      panel: false,
    },
    title: { color: '#F4F0E6' },
    subtitle: { color: '#8DD6C7' },
    event: { color: '#E7B845' },
    text: {
      school: 'GREENWICH VIETNAM',
      subtitle: 'Change Starts Here',
      footer: 'Greenwich moment',
    },
    meta: { color: '#D7E8E4' },
    date: { color: '#F8F3E6' },
    photos: {
      slotShadow: 'rgba(125,206,190,0.18)',
      slotBg: '#172437',
      borderColor: '#8DD6C7',
      borderWidth: 3,
      radius: 16,
      cornerAccent: { color: '#E7B845', size: 28, lw: 3 },
    },
    footer: {
      bg: 'transparent',
      borderColor: 'transparent',
      glow: 'rgba(125,206,190,0.12)',
      panel: false,
      hashtag: { text: 'Greenwich moment', color: '#F4F0E6' },
      script: { family: '"Cormorant Garamond", serif', color: '#E7B845', italic: true },
    },
    frame: { outer: 'rgba(231,184,69,0.14)', outerW: 0, inner: '#E7B845', innerW: 2 },
  },
];
