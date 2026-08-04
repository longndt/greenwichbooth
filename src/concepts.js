// Poster themes — one shared 1080x1440 renderer in main.js, theme tokens only.

export const POSTER_THEMES = [
  {
    id: 1,
    name: 'Theme 1',
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
      bg: '#F8F3E6',
      borderColor: '#D6A72C',
      url: { text: 'greenwich.edu.vn', color: '#FFFFFF' },
      hashtag: { text: 'My Greenwich Moment', color: '#073B4C' },
    },
    frame: { outer: '#0A9396', outerW: 6, inner: '#D6A72C', innerW: 2 },
  },
  {
    id: 2,
    name: 'Theme 2',
    bg: {
      color: '#F4E7D0',
      texture: { type: 'dots', color: 'rgba(184,92,25,0.10)', step: 44 },
    },
    header: {
      bg: '#F4E7D0',
      topBar: { color: '#D28A2E', height: 6 },
      bottomBar: { colors: ['rgba(184,92,25,0.20)', 'rgba(184,92,25,0.20)'], height: 2 },
    },
    title: { color: '#006A7F' },
    subtitle: { color: '#A84A17' },
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
      bg: '#F4E7D0',
      borderColor: '#D28A2E',
      url: { text: 'greenwich.edu.vn', color: '#FFFFFF' },
      hashtag: { text: 'My Greenwich Moment', color: '#006A7F' },
    },
    frame: { outer: '#006A7F', outerW: 6, inner: '#D28A2E', innerW: 2 },
  },
  {
    id: 3,
    name: 'Theme 3',
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
      bg: '#F3FBF8',
      borderColor: '#7CCBB9',
      url: { text: 'greenwich.edu.vn', color: '#0A5B66' },
      hashtag: { text: 'My Greenwich Moment', color: '#0A5B66' },
    },
    frame: { outer: '#7CCBB9', outerW: 5, inner: '#D28A2E', innerW: 2 },
  },
];
