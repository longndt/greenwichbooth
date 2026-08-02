// 10 Poster Concepts — Greenwich Vietnam Photobooth
// Layout constants (same for all concepts):
//   title.font  = '800 56px "Plus Jakarta Sans"', y = 150
//   subtitle.font = '600 16px "Space Grotesk"',   y = 205
//   date.y      = 238
// Only colors / theme text / emojis differ between concepts.

export const CONCEPTS = [

  // ── 01. Lion Pride Campus ────────────────────────────────────────────────
  {
    id: 1,
    name: 'Lion Pride Campus',
    bg: {
      color: '#0C2210',
      texture: { type: 'grid', color: 'rgba(45,215,122,0.05)', step: 48 },
    },
    header: {
      bg: '#081809',
      topBar: { color: '#D4AF37', height: 8 },
      bottomBar: { colors: ['rgba(0,107,63,0.4)', '#006b3f'], height: 14 },
    },
    title: {
      text: 'GREENWICH PHOTOBOOTH',
      font: '800 56px "Plus Jakarta Sans", Arial, sans-serif',
      color: '#D4AF37',
      shadow: { color: 'rgba(0,107,63,0.7)', blur: 20 },
      y: 150,
    },
    subtitle: {
      text: '✦  DẪN ĐẦU TƯƠNG LAI  ✦',
      font: '600 16px "Space Grotesk", Arial, sans-serif',
      color: '#90C878',
      y: 205,
    },
    date: { color: 'rgba(255,255,255,0.7)', y: 238 },
    photos: {
      slotShadow: 'rgba(212,175,55,0.2)',
      slotBg: '#050e08',
      borderColor: '#D4AF37',
      borderWidth: 4,
      radius: 18,
      cornerAccent: { color: '#2DD77A', size: 32, lw: 3 },
      emojis: ['🦁', '🎓', '🌟', '💚'],
    },
    footer: {
      bg: '#081809',
      topStrip: '#D4AF37',
      borderColor: '#2DD77A',
      url: { text: 'greenwich.edu.vn', color: '#FFFFFF' },
      hashtag: { text: '✦  #GreenwichVietnam  ✦', color: '#D4AF37' },
    },
    frame: { outer: '#D4AF37', outerW: 8, inner: '#2DD77A', innerW: 2 },
  },

  // ── 02. Future Passport ─────────────────────────────────────────────────
  {
    id: 2,
    name: 'Future Passport',
    bg: {
      color: '#1a1a2e',
      texture: { type: 'dots', color: 'rgba(255,255,255,0.04)', step: 36 },
    },
    header: {
      bg: '#12122a',
      topBar: { color: '#0f7173', height: 6 },
      bottomBar: { colors: ['rgba(15,113,115,0.3)', '#0f7173'], height: 10 },
    },
    title: {
      text: 'GREENWICH PHOTOBOOTH',
      font: '800 56px "Plus Jakarta Sans", Arial, sans-serif',
      color: '#FFFFFF',
      shadow: { color: 'rgba(15,113,115,0.8)', blur: 18 },
      y: 150,
    },
    subtitle: {
      text: '── BOARDING TO YOUR FUTURE ──',
      font: '600 16px "Space Grotesk", Arial, sans-serif',
      color: '#0f7173',
      y: 205,
    },
    date: { color: 'rgba(255,255,255,0.55)', y: 238 },
    photos: {
      slotShadow: 'rgba(15,113,115,0.25)',
      slotBg: '#10102a',
      borderColor: '#0f7173',
      borderWidth: 3,
      radius: 12,
      cornerAccent: { color: '#FFFFFF', size: 24, lw: 2 },
      emojis: ['✈️', '🌍', '🎒', '📖'],
    },
    footer: {
      bg: '#12122a',
      topStrip: '#0f7173',
      borderColor: '#0f7173',
      url: { text: 'greenwich.edu.vn', color: '#FFFFFF' },
      hashtag: { text: '── #GreenwichVietnam ──', color: '#0f7173' },
    },
    frame: { outer: '#0f7173', outerW: 6, inner: 'rgba(255,255,255,0.15)', innerW: 1 },
  },

  // ── 03. Admissions Festival ─────────────────────────────────────────────
  {
    id: 3,
    name: 'Admissions Festival',
    bg: {
      color: '#0D3D38',
      texture: { type: 'confetti', color: 'rgba(255,107,53,0.12)', step: 60 },
    },
    header: {
      bg: '#071F1C',
      topBar: { color: '#FF6B35', height: 8 },
      bottomBar: { colors: ['rgba(255,107,53,0.2)', '#FF6B35'], height: 10 },
    },
    title: {
      text: 'GREENWICH PHOTOBOOTH',
      font: '800 56px "Plus Jakarta Sans", Arial, sans-serif',
      color: '#FFFFFF',
      shadow: { color: 'rgba(255,107,53,0.5)', blur: 16 },
      y: 150,
    },
    subtitle: {
      text: '🎉  OPEN DAY  🎉',
      font: '600 16px "Space Grotesk", Arial, sans-serif',
      color: '#FF6B35',
      y: 205,
    },
    date: { color: 'rgba(255,255,255,0.7)', y: 238 },
    photos: {
      slotShadow: 'rgba(255,107,53,0.2)',
      slotBg: '#071F1C',
      borderColor: '#FF6B35',
      borderWidth: 4,
      radius: 14,
      cornerAccent: { color: '#FFCB2F', size: 28, lw: 3 },
      emojis: ['🎉', '🎊', '🥳', '🎈'],
    },
    footer: {
      bg: '#071F1C',
      topStrip: '#FF6B35',
      borderColor: '#FF6B35',
      url: { text: 'greenwich.edu.vn', color: '#FFFFFF' },
      hashtag: { text: '🎉  #GreenwichVietnam  🎉', color: '#FF6B35' },
    },
    frame: { outer: '#FF6B35', outerW: 8, inner: 'rgba(255,203,47,0.4)', innerW: 2 },
  },

  // ── 04. Greenwich Champion ──────────────────────────────────────────────
  {
    id: 4,
    name: 'Greenwich Champion',
    bg: {
      color: '#000000',
      texture: { type: 'grid', color: 'rgba(107,75,160,0.08)', step: 40 },
    },
    header: {
      bg: '#000000',
      topBar: { color: '#FFD700', height: 8 },
      bottomBar: { colors: ['rgba(107,75,160,0.4)', '#6B4BA0'], height: 12 },
    },
    title: {
      text: 'GREENWICH PHOTOBOOTH',
      font: '800 56px "Plus Jakarta Sans", Arial, sans-serif',
      color: '#FFD700',
      shadow: { color: 'rgba(107,75,160,0.5)', blur: 24 },
      y: 150,
    },
    subtitle: {
      text: '✦  SAY YOUR STORY  ✦',
      font: '600 16px "Space Grotesk", Arial, sans-serif',
      color: '#FFD700',
      y: 205,
    },
    date: { color: '#FFFFFF', y: 238 },
    photos: {
      slotShadow: 'rgba(255,215,0,0.15)',
      slotBg: '#0a0a0a',
      borderColor: '#FFD700',
      borderWidth: 4,
      radius: 16,
      cornerAccent: { color: '#6B4BA0', size: 28, lw: 3 },
      emojis: ['😄', '❤️', '🥳', '✨'],
    },
    footer: {
      bg: '#000000',
      topStrip: '#FFD700',
      borderColor: '#6B4BA0',
      url: { text: 'greenwich.edu.vn', color: '#FFFFFF' },
      hashtag: { text: '✦  #GreenwichVietnam  ✦', color: '#FFD700' },
    },
    frame: { outer: '#FFD700', outerW: 8, inner: '#6B4BA0', innerW: 2 },
  },

  // ── 05. Global Student Life ─────────────────────────────────────────────
  {
    id: 5,
    name: 'Global Student Life',
    bg: {
      color: '#0F5132',
      texture: { type: 'dots', color: 'rgba(144,200,172,0.08)', step: 44 },
    },
    header: {
      bg: '#093622',
      topBar: { color: '#90C8AC', height: 6 },
      bottomBar: { colors: ['rgba(144,200,172,0.3)', '#2D6A4F'], height: 10 },
    },
    title: {
      text: 'GREENWICH PHOTOBOOTH',
      font: '800 56px "Plus Jakarta Sans", Arial, sans-serif',
      color: '#FFFFFF',
      shadow: { color: 'rgba(45,106,79,0.8)', blur: 16 },
      y: 150,
    },
    subtitle: {
      text: '🌍  GO GLOBAL  🌍',
      font: '600 16px "Space Grotesk", Arial, sans-serif',
      color: '#90C8AC',
      y: 205,
    },
    date: { color: 'rgba(255,255,255,0.65)', y: 238 },
    photos: {
      slotShadow: 'rgba(144,200,172,0.2)',
      slotBg: '#072A18',
      borderColor: '#90C8AC',
      borderWidth: 3,
      radius: 16,
      cornerAccent: { color: '#FFCB2F', size: 26, lw: 2 },
      emojis: ['🌍', '✈️', '📚', '😊'],
    },
    footer: {
      bg: '#093622',
      topStrip: '#90C8AC',
      borderColor: '#2D6A4F',
      url: { text: 'greenwich.edu.vn', color: '#FFFFFF' },
      hashtag: { text: '🌍  #GreenwichVietnam  🌍', color: '#90C8AC' },
    },
    frame: { outer: '#90C8AC', outerW: 6, inner: 'rgba(255,203,47,0.3)', innerW: 2 },
  },

  // ── 06. Tech & Creative Lab ─────────────────────────────────────────────
  {
    id: 6,
    name: 'Tech & Creative Lab',
    bg: {
      color: '#030f07',
      texture: { type: 'grid', color: 'rgba(255,107,53,0.07)', step: 32 },
    },
    header: {
      bg: '#020a04',
      topBar: { color: '#FF6B35', height: 6 },
      bottomBar: { colors: ['rgba(255,107,53,0.2)', 'rgba(255,107,53,0.5)'], height: 8 },
    },
    title: {
      text: 'GREENWICH PHOTOBOOTH',
      font: '800 56px "Plus Jakarta Sans", Arial, sans-serif',
      color: '#FF6B35',
      shadow: { color: 'rgba(255,107,53,0.7)', blur: 20 },
      y: 150,
    },
    subtitle: {
      text: '// BUILD YOUR FUTURE_',
      font: '600 16px "Space Grotesk", Arial, sans-serif',
      color: 'rgba(255,107,53,0.7)',
      y: 205,
    },
    date: { color: 'rgba(255,255,255,0.45)', y: 238 },
    photos: {
      slotShadow: 'rgba(255,107,53,0.15)',
      slotBg: '#020a04',
      borderColor: '#FF6B35',
      borderWidth: 3,
      radius: 8,
      cornerAccent: { color: '#FFD700', size: 22, lw: 2 },
      emojis: ['💻', '🚀', '⚡', '🎨'],
    },
    footer: {
      bg: '#020a04',
      topStrip: '#FF6B35',
      borderColor: 'rgba(255,107,53,0.4)',
      url: { text: 'greenwich.edu.vn', color: 'rgba(255,255,255,0.7)' },
      hashtag: { text: '>_ #GreenwichVietnam', color: '#FF6B35' },
    },
    frame: { outer: '#FF6B35', outerW: 6, inner: 'rgba(255,215,0,0.3)', innerW: 1 },
  },

  // ── 07. Lion Parade ─────────────────────────────────────────────────────
  {
    id: 7,
    name: 'Lion Parade',
    bg: {
      color: '#1B5E5E',
      texture: { type: 'confetti', color: 'rgba(255,203,47,0.1)', step: 50 },
    },
    header: {
      bg: '#0F3A3A',
      topBar: { color: '#FFCB2F', height: 8 },
      bottomBar: { colors: ['rgba(255,203,47,0.3)', '#FFCB2F'], height: 10 },
    },
    title: {
      text: 'GREENWICH PHOTOBOOTH',
      font: '800 56px "Plus Jakarta Sans", Arial, sans-serif',
      color: '#FFCB2F',
      shadow: { color: 'rgba(0,0,0,0.5)', blur: 12 },
      y: 150,
    },
    subtitle: {
      text: '🦁  NĂNG ĐỘNG · VUI NHỘN  🦁',
      font: '600 16px "Space Grotesk", Arial, sans-serif',
      color: '#FFFFFF',
      y: 205,
    },
    date: { color: 'rgba(255,255,255,0.7)', y: 238 },
    photos: {
      slotShadow: 'rgba(255,203,47,0.2)',
      slotBg: '#0F3A3A',
      borderColor: '#FFCB2F',
      borderWidth: 4,
      radius: 18,
      cornerAccent: { color: '#FFFFFF', size: 28, lw: 2 },
      emojis: ['🦁', '🎊', '🥳', '🎉'],
    },
    footer: {
      bg: '#0F3A3A',
      topStrip: '#FFCB2F',
      borderColor: '#FFCB2F',
      url: { text: 'greenwich.edu.vn', color: '#FFFFFF' },
      hashtag: { text: '🦁  #GreenwichVietnam  🦁', color: '#FFCB2F' },
    },
    frame: { outer: '#FFCB2F', outerW: 8, inner: 'rgba(255,255,255,0.2)', innerW: 2 },
  },

  // ── 08. Study Abroad Vibe ───────────────────────────────────────────────
  {
    id: 8,
    name: 'Study Abroad Vibe',
    bg: {
      color: '#F5EDD6',
      texture: { type: 'none' },
    },
    header: {
      bg: '#F5EDD6',
      topBar: { color: '#0F5132', height: 5 },
      bottomBar: { colors: ['rgba(15,81,50,0.1)', 'rgba(15,81,50,0.25)'], height: 8 },
    },
    title: {
      text: 'GREENWICH PHOTOBOOTH',
      font: '800 56px "Plus Jakarta Sans", Arial, sans-serif',
      color: '#0F5132',
      shadow: { color: 'rgba(0,0,0,0.1)', blur: 6 },
      y: 150,
    },
    subtitle: {
      text: '── Greetings from Greenwich ──',
      font: '600 16px "Space Grotesk", Arial, sans-serif',
      color: '#6B4226',
      y: 205,
    },
    date: { color: '#6B4226', y: 238 },
    photos: {
      slotShadow: 'rgba(15,81,50,0.15)',
      slotBg: '#EAE0C8',
      borderColor: '#0F5132',
      borderWidth: 3,
      radius: 12,
      cornerAccent: { color: '#FFCB2F', size: 22, lw: 2 },
      emojis: ['✈️', '🗺️', '📸', '🌸'],
    },
    footer: {
      bg: '#0F5132',
      topStrip: '#FFCB2F',
      borderColor: '#6B4226',
      url: { text: 'greenwich.edu.vn', color: '#FFFFFF' },
      hashtag: { text: '✦  #GreenwichVietnam  ✦', color: '#FFCB2F' },
    },
    frame: { outer: '#0F5132', outerW: 6, inner: '#FFCB2F', innerW: 2 },
  },

  // ── 09. Premium Minimal Brand ───────────────────────────────────────────
  {
    id: 9,
    name: 'Premium Minimal Brand',
    bg: {
      color: '#F9F6F0',
      texture: { type: 'none' },
    },
    header: {
      bg: '#F9F6F0',
      topBar: { color: '#1B5E5E', height: 4 },
      bottomBar: null,
    },
    title: {
      text: 'GREENWICH PHOTOBOOTH',
      font: '800 56px "Plus Jakarta Sans", Arial, sans-serif',
      color: '#1B5E5E',
      shadow: { color: 'transparent', blur: 0 },
      y: 150,
    },
    subtitle: {
      text: 'Premium · Minimal · Prestige',
      font: '600 16px "Space Grotesk", Arial, sans-serif',
      color: '#C9A961',
      y: 205,
    },
    date: { color: '#888', y: 238 },
    photos: {
      slotShadow: 'rgba(0,0,0,0.08)',
      slotBg: '#FFFDF9',
      borderColor: '#C9A961',
      borderWidth: 2,
      radius: 10,
      cornerAccent: { color: '#1B5E5E', size: 18, lw: 1 },
      emojis: ['✨', '💫', '🌿', '🤍'],
    },
    footer: {
      bg: '#F9F6F0',
      topStrip: '#1B5E5E',
      borderColor: '#C9A961',
      url: { text: 'greenwich.edu.vn', color: '#1B5E5E' },
      hashtag: { text: '#GreenwichVietnam', color: '#C9A961' },
    },
    frame: { outer: '#1B5E5E', outerW: 4, inner: '#C9A961', innerW: 1 },
  },

  // ── 10. Social Share Frame ──────────────────────────────────────────────
  {
    id: 10,
    name: 'Social Share Frame',
    bg: {
      color: '#F5EDD6',
      texture: { type: 'none' },
    },
    header: {
      bg: '#F5EDD6',
      topBar: { color: '#1B5E5E', height: 6 },
      bottomBar: { colors: ['rgba(27,94,94,0.15)', 'rgba(27,94,94,0.3)'], height: 8 },
    },
    title: {
      text: 'GREENWICH PHOTOBOOTH',
      font: '800 56px "Plus Jakarta Sans", Arial, sans-serif',
      color: '#1B5E5E',
      shadow: { color: 'transparent', blur: 0 },
      y: 150,
    },
    subtitle: {
      text: '📱  SHARE YOUR MOMENT  📱',
      font: '600 16px "Space Grotesk", Arial, sans-serif',
      color: '#FF6B35',
      y: 205,
    },
    date: { color: '#666', y: 238 },
    photos: {
      slotShadow: 'rgba(27,94,94,0.15)',
      slotBg: '#EAE0C8',
      borderColor: '#1B5E5E',
      borderWidth: 3,
      radius: 16,
      cornerAccent: { color: '#FF6B35', size: 24, lw: 2 },
      emojis: ['📱', '💚', '🌟', '🔗'],
    },
    footer: {
      bg: '#1B5E5E',
      topStrip: '#FF6B35',
      borderColor: '#FF6B35',
      url: { text: 'greenwich.edu.vn', color: '#FFFFFF' },
      hashtag: { text: '📱  #GreenwichVietnam  📱', color: '#FF6B35' },
    },
    frame: { outer: '#1B5E5E', outerW: 6, inner: '#FF6B35', innerW: 2 },
  },
];

export const randomConcept = () => CONCEPTS[Math.floor(Math.random() * CONCEPTS.length)];
export const getConcept   = n  => CONCEPTS[(n - 1) % CONCEPTS.length];
