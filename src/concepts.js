// Poster themes — one shared 1080x1440 renderer in main.js, theme tokens only.

export const POSTER_THEMES = [
  {
    id: 1,
    name: 'Open Day',
    bg: {
      color: '#DDEFF5',
      texture: { type: 'confetti', color: 'rgba(0,75,99,0.08)', step: 42 },
    },
    header: {
      bg: '#EAF7FF',
      topBar: { color: '#005F73', height: 8 },
      bottomBar: { colors: ['rgba(0,95,115,0.12)', '#94D2BD'], height: 10 },
    },
    title: { color: '#004B63' },
    subtitle: { color: '#B85C19' },
    date: { color: '#004B63' },
    photos: {
      slotShadow: 'rgba(0,75,99,0.18)',
      slotBg: '#F6FBFD',
      borderColor: '#007C92',
      borderWidth: 3,
      radius: 18,
      cornerAccent: { color: '#FFCB2F', size: 34, lw: 3 },
    },
    footer: {
      bg: '#E8F4FA',
      borderColor: '#007C92',
      url: { text: 'greenwich.edu.vn', color: '#004B63' },
      hashtag: { text: '#GreenwichVietnam', color: '#B85C19' },
    },
    frame: { outer: '#005F73', outerW: 6, inner: '#FFCB2F', innerW: 2 },
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
      color: '#061923',
      texture: { type: 'grid', color: 'rgba(255,203,47,0.06)', step: 36 },
    },
    header: {
      bg: '#082533',
      topBar: { color: '#FFCB2F', height: 7 },
      bottomBar: { colors: ['rgba(255,203,47,0.10)', 'rgba(10,147,150,0.32)'], height: 10 },
    },
    title: { color: '#F8FCFF' },
    subtitle: { color: '#FFCB2F' },
    date: { color: '#D8F3F8' },
    photos: {
      slotShadow: 'rgba(255,203,47,0.18)',
      slotBg: '#0B2A3A',
      borderColor: '#FFCB2F',
      borderWidth: 3,
      radius: 10,
      cornerAccent: { color: '#0A9396', size: 22, lw: 2 },
    },
    footer: {
      bg: '#04121A',
      borderColor: '#FFCB2F',
      url: { text: 'greenwich.edu.vn', color: '#FFFFFF' },
      hashtag: { text: '#GreenwichVietnam', color: '#FFCB2F' },
    },
    frame: { outer: '#FFCB2F', outerW: 6, inner: '#0A9396', innerW: 2 },
  },
];
