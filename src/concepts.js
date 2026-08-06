// Poster themes — one shared 1080x1440 renderer in main.js, theme tokens only.

export const POSTER_THEMES = [
  {
    id: 1,
    name: 'màu A',
    bg: {
      color: '#F8F3E6',
      texture: { type: 'grid', color: 'rgba(10,147,150,0.07)', step: 36 },
    },
    header: {
      bg: '#F8F3E6',
      topBar: { color: '#D6A72C', height: 7 },
      bottomBar: { colors: ['rgba(10,147,150,0.10)', 'rgba(10,147,150,0.32)'], height: 2 },
    },
    title: { color: '#073B4C' },
    subtitle: { color: '#B85C19' },
    date: { color: '#375B63' },
    photos: {
      slotShadow: 'rgba(10,147,150,0.18)',
      slotBg: '#FFFDF6',
      borderColor: '#D6A72C',
      borderWidth: 3,
      radius: 10,
      cornerAccent: { color: '#0A9396', size: 22, lw: 2 },
    },
    footer: {
      bg: '#082733',
      borderColor: '#86C8B7',
      glow: 'rgba(10,147,150,0.22)',
      url: { text: 'greenwich.edu.vn', color: '#94D2BD' },
      hashtag: { text: 'My Greenwich Moment', color: '#F7FFFE' },
    },
    frame: { outer: 'transparent', outerW: 0, inner: '#D6A72C', innerW: 2 },
  },
  {
    id: 2,
    name: 'màu B',
    bg: {
      color: '#F3FBF8',
      texture: { type: 'dots', color: 'rgba(10,147,150,0.08)', step: 42 },
    },
    header: {
      bg: '#F3FBF8',
      topBar: { color: '#0A9396', height: 7 },
      bottomBar: { colors: ['rgba(10,147,150,0.08)', 'rgba(255,203,47,0.22)'], height: 2 },
    },
    title: { color: '#0A5B66' },
    subtitle: { color: '#C7751A' },
    date: { color: '#0A5B66' },
    photos: {
      slotShadow: 'rgba(10,91,102,0.14)',
      slotBg: '#FFFFFF',
      borderColor: '#7CCBB9',
      borderWidth: 3,
      radius: 18,
      cornerAccent: { color: '#D28A2E', size: 30, lw: 3 },
    },
    footer: {
      bg: '#050505',
      borderColor: '#F5C542',
      glow: 'rgba(124,203,185,0.18)',
      url: { text: 'greenwich.edu.vn', color: '#EAF7FF' },
      hashtag: { text: 'My Greenwich Moment', color: '#F7FFFE' },
    },
    frame: { outer: 'transparent', outerW: 0, inner: '#D28A2E', innerW: 2 },
  },
];
