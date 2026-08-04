// Poster themes — one shared 1080x1440 renderer in main.js, theme tokens only.

export const POSTER_THEMES = [
  {
    id: 1,
    name: 'Theme 1',
    bg: {
      color: '#F3FBF8',
      texture: { type: 'dots', color: 'rgba(10,147,150,0.08)', step: 42 },
    },
    header: {
      bg: '#F8FEFC',
      topBar: { color: '#0A9396', height: 7 },
      bottomBar: { colors: ['rgba(10,147,150,0.08)', 'rgba(255,203,47,0.22)'], height: 10 },
    },
    title: { color: '#0A5B66' },
    subtitle: { color: '#D28A2E' },
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
      bg: '#EAF8F4',
      borderColor: '#7CCBB9',
      url: { text: 'greenwich.edu.vn', color: '#0A5B66' },
      hashtag: { text: 'My Greenwich Moment', color: '#0A5B66' },
    },
    frame: { outer: '#7CCBB9', outerW: 5, inner: '#D28A2E', innerW: 2 },
  },
  {
    id: 2,
    name: 'Theme 2',
    bg: {
      color: '#FFF1E6',
      texture: { type: 'dots', color: 'rgba(255,107,74,0.18)', step: 34 },
    },
    header: {
      bg: '#FF6B4A',
      topBar: { color: '#006D77', height: 6 },
      bottomBar: { colors: ['rgba(255,209,102,0.34)', 'rgba(0,109,119,0.24)'], height: 10 },
    },
    title: { color: '#2B1B12' },
    subtitle: { color: '#006D77' },
    date: { color: '#FFFFFF' },
    photos: {
      slotShadow: 'rgba(255,107,74,0.28)',
      slotBg: '#FFFFFF',
      borderColor: '#FF6B4A',
      borderWidth: 3,
      radius: 14,
      cornerAccent: { color: '#006D77', size: 24, lw: 2 },
    },
    footer: {
      bg: '#2B1B12',
      borderColor: '#FFB703',
      url: { text: 'greenwich.edu.vn', color: '#FFFFFF' },
      hashtag: { text: 'My Greenwich Moment', color: '#FFD166' },
    },
    frame: { outer: '#FF6B4A', outerW: 6, inner: '#006D77', innerW: 2 },
  },
  {
    id: 3,
    name: 'Theme 3',
    bg: {
      color: '#050505',
      texture: { type: 'grid', color: 'rgba(245,197,66,0.11)', step: 36 },
    },
    header: {
      bg: '#121212',
      topBar: { color: '#F5C542', height: 7 },
      bottomBar: { colors: ['rgba(245,197,66,0.22)', 'rgba(255,255,255,0.10)'], height: 10 },
    },
    title: { color: '#FFF8E1' },
    subtitle: { color: '#F5C542' },
    date: { color: '#F5C542' },
    photos: {
      slotShadow: 'rgba(0,0,0,0.52)',
      slotBg: '#FFF8E1',
      borderColor: '#F5C542',
      borderWidth: 3,
      radius: 10,
      cornerAccent: { color: '#FFFFFF', size: 22, lw: 2 },
    },
    footer: {
      bg: '#050505',
      borderColor: '#F5C542',
      url: { text: 'greenwich.edu.vn', color: '#FFFFFF' },
      hashtag: { text: 'My Greenwich Moment', color: '#F5C542' },
    },
    frame: { outer: '#F5C542', outerW: 6, inner: '#FFFFFF', innerW: 2 },
  },
];
