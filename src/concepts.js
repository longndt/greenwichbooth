// Poster themes — one shared 1080x1440 renderer in main.js, theme tokens only.

export const POSTER_THEMES = [
  {
    id: 1,
    name: 'Open Day',
    bg: {
      color: '#0D3542',
      texture: { type: 'dots', color: 'rgba(255,203,47,0.08)', step: 42 },
    },
    header: {
      bg: '#123F4C',
      topBar: { color: '#FFCB2F', height: 7 },
      bottomBar: { colors: ['rgba(255,203,47,0.10)', 'rgba(148,210,189,0.32)'], height: 10 },
    },
    title: { color: '#F4FBF8' },
    subtitle: { color: '#FFCB2F' },
    date: { color: '#F4FBF8' },
    photos: {
      slotShadow: 'rgba(0,0,0,0.32)',
      slotBg: '#D8E8E5',
      borderColor: '#86C8B7',
      borderWidth: 3,
      radius: 18,
      cornerAccent: { color: '#FFCB2F', size: 30, lw: 3 },
    },
    footer: {
      bg: '#082733',
      borderColor: '#86C8B7',
      url: { text: 'greenwich.edu.vn', color: '#FFFFFF' },
      hashtag: { text: '#GreenwichVietnam', color: '#FFCB2F' },
    },
    frame: { outer: '#86C8B7', outerW: 5, inner: '#FFCB2F', innerW: 2 },
  },
  {
    id: 2,
    name: 'Student Life',
    bg: {
      color: '#F4E7D0',
      texture: { type: 'dots', color: 'rgba(184,92,25,0.10)', step: 44 },
    },
    header: {
      bg: '#F7EEDC',
      topBar: { color: '#D28A2E', height: 6 },
      bottomBar: { colors: ['rgba(184,92,25,0.12)', 'rgba(210,138,46,0.28)'], height: 10 },
    },
    title: { color: '#006A7F' },
    subtitle: { color: '#B85C19' },
    date: { color: '#7A4A21' },
    photos: {
      slotShadow: 'rgba(122,74,33,0.18)',
      slotBg: '#FFF8EA',
      borderColor: '#D28A2E',
      borderWidth: 3,
      radius: 14,
      cornerAccent: { color: '#006A7F', size: 24, lw: 2 },
    },
    footer: {
      bg: '#006A7F',
      borderColor: '#D28A2E',
      url: { text: 'greenwich.edu.vn', color: '#FFFFFF' },
      hashtag: { text: '#GreenwichVietnam', color: '#FFD88A' },
    },
    frame: { outer: '#006A7F', outerW: 6, inner: '#D28A2E', innerW: 2 },
  },
  {
    id: 3,
    name: 'Graduation Day',
    bg: {
      color: '#F8F3E6',
      texture: { type: 'grid', color: 'rgba(10,147,150,0.07)', step: 36 },
    },
    header: {
      bg: '#FFF9EC',
      topBar: { color: '#D6A72C', height: 7 },
      bottomBar: { colors: ['rgba(10,147,150,0.10)', 'rgba(10,147,150,0.32)'], height: 10 },
    },
    title: { color: '#073B4C' },
    subtitle: { color: '#0A9396' },
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
      bg: '#073B4C',
      borderColor: '#D6A72C',
      url: { text: 'greenwich.edu.vn', color: '#FFFFFF' },
      hashtag: { text: '#GreenwichVietnam', color: '#FFD166' },
    },
    frame: { outer: '#0A9396', outerW: 6, inner: '#D6A72C', innerW: 2 },
  },
];
