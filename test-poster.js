// Quick poster layout test — verify 1×4 vertical stack calculations
const W = 1080, H = 1440, BAR = 120, GAP = 12;

const ph = (H - BAR * 2 - GAP * 5) / 4;
const pw = W - GAP * 2;

console.log(`Canvas: ${W}×${H}px`);
console.log(`Photo dimensions: ${pw}×${Math.round(ph)}px`);
console.log(`Photo aspect ratio: ${(pw/ph).toFixed(2)}:1\n`);

const pos = [
  [GAP, BAR + GAP],
  [GAP, BAR + GAP * 2 + ph],
  [GAP, BAR + GAP * 3 + ph * 2],
  [GAP, BAR + GAP * 4 + ph * 3],
];

console.log('Photo positions (1×4 vertical stack):');
pos.forEach((p, i) => {
  console.log(`  Photo ${i+1}: x=${p[0]}, y=${Math.round(p[1])}`);
});

console.log(`\nBar height: ${BAR}px each (top & bottom)`);
console.log(`Total layout: ${BAR}px (top bar) + 4×${Math.round(ph)}px (photos) + 5×${GAP}px (gaps) + ${BAR}px (bottom bar) = ${BAR + ph*4 + GAP*5 + BAR}px`);

// Verify layout is tight
const totalHeight = BAR + ph*4 + GAP*5 + BAR;
console.log(`Layout verification: ${totalHeight === H ? '✓ Correct' : '✗ ERROR'} (expected ${H}, got ${totalHeight})`);
