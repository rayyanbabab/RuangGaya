/**
 * Generate placeholder stickers (16 PNG) dan frame placeholder yang lebih bagus.
 * Run: node scripts/generate-assets.mjs
 */

import { createCanvas } from 'canvas';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');


fs.mkdirSync(path.join(root, 'public/overlays'), { recursive: true });
fs.mkdirSync(path.join(root, 'public/templates'), { recursive: true });

// ─── Overlay placeholders (lebih bagus) ────────────────────────────
function makeOverlay(id, colorBorder, colorCorner, style, W, H) {
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, W, H);

  const bw = 20;

  if (style === 'corner') {
    // Corner decoration only
    const cornerSize = 70;
    const colors = [colorBorder, colorCorner];
    const corners = [[0,0], [W,0], [0,H], [W,H]];
    corners.forEach(([cx, cy], idx) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.fillStyle = colors[idx % 2];
      ctx.globalAlpha = 0.9;
      // L-shape corner
      const sx = cx === 0 ? 1 : -1;
      const sy = cy === 0 ? 1 : -1;
      ctx.fillRect(0, 0, sx * 60, sy * bw);
      ctx.fillRect(0, 0, sx * bw, sy * 60);
      // dot
      ctx.beginPath();
      ctx.arc(sx * 30, sy * 30, 8, 0, Math.PI * 2);
      ctx.fillStyle = colorCorner;
      ctx.fill();
      ctx.restore();
    });
  } else if (style === 'full-border') {
    // Full elegant border
    ctx.strokeStyle = colorBorder;
    ctx.lineWidth = bw;
    ctx.globalAlpha = 0.85;
    ctx.strokeRect(bw / 2, bw / 2, W - bw, H - bw);

    // Inner thin border
    ctx.strokeStyle = colorCorner;
    ctx.lineWidth = 3;
    ctx.globalAlpha = 0.7;
    ctx.strokeRect(bw + 6, bw + 6, W - (bw + 6) * 2, H - (bw + 6) * 2);
  } else if (style === 'floral') {
    // Dots + border
    ctx.strokeStyle = colorBorder;
    ctx.lineWidth = bw;
    ctx.globalAlpha = 0.8;
    ctx.strokeRect(bw / 2, bw / 2, W - bw, H - bw);

    ctx.fillStyle = colorCorner;
    ctx.globalAlpha = 0.9;
    const margin = bw / 2;
    const dotCount = 10;
    for (let i = 0; i < dotCount; i++) {
      const t = i / (dotCount - 1);
      // Top & bottom rows
      ctx.beginPath(); ctx.arc(margin + t * (W - bw), margin, 5, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(margin + t * (W - bw), H - margin, 5, 0, Math.PI*2); ctx.fill();
    }
    const dotCountV = 7;
    for (let i = 1; i < dotCountV - 1; i++) {
      const t = i / (dotCountV - 1);
      ctx.beginPath(); ctx.arc(margin, margin + t * (H - bw), 5, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(W - margin, margin + t * (H - bw), 5, 0, Math.PI*2); ctx.fill();
    }
  } else if (style === 'minimal') {
    // Just corner lines, very minimal
    const len = 50;
    ctx.strokeStyle = colorBorder;
    ctx.lineWidth = 4;
    ctx.globalAlpha = 0.9;
    ctx.lineCap = 'round';
    const pad = 12;
    [[pad,pad],[W-pad,pad],[pad,H-pad],[W-pad,H-pad]].forEach(([cx,cy]) => {
      const sx = cx < W/2 ? 1 : -1;
      const sy = cy < H/2 ? 1 : -1;
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + sx*len, cy); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx, cy + sy*len); ctx.stroke();
    });
  }

  return canvas.toBuffer('image/png');
}

const overlays = [
  { id: 'floral',  colorBorder: '#D4537E', colorCorner: '#ED93B1', style: 'floral' },
  { id: 'kawaii',  colorBorder: '#ED93B1', colorCorner: '#F4C0D1', style: 'corner' },
  { id: 'simple',  colorBorder: '#993556', colorCorner: '#D4537E', style: 'full-border' },
  { id: 'retro',   colorBorder: '#C06080', colorCorner: '#993556', style: 'minimal' },
];

const templatesSizes = [
  { id: '2x1', W: 480, H: 694 },
  { id: '3x1', W: 480, H: 1008 },
  { id: '4x1', W: 480, H: 1322 },
  { id: '2x2', W: 894, H: 694 },
  { id: '2x3', W: 894, H: 1008 },
];

for (const f of overlays) {
  for (const t of templatesSizes) {
    const buf = makeOverlay(f.id, f.colorBorder, f.colorCorner, f.style, t.W, t.H);
    const out = path.join(root, `public/overlays/overlay-${f.id}-${t.id}.png`);
    fs.writeFileSync(out, buf);
    console.log(`✅ Overlay: ${f.id} (${t.id}) -> ${out}`);
  }
}

// ─── Template previews ────────────────────────────────────────────
function makeTemplatePrev(id, cols, rows, label) {
  const W = 200, H = 140;
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#FFF0F5';
  ctx.fillRect(0, 0, W, H);
  const pad = 10, gx = 5, gy = 5;
  const slotW = Math.floor((W - pad*2 - gx*(cols-1)) / cols);
  const slotH = Math.floor((H - pad*2 - 28 - gy*(rows-1)) / rows);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = pad + c*(slotW+gx), y = pad + r*(slotH+gy);
      ctx.fillStyle = '#F4C0D1';
      ctx.beginPath();
      ctx.roundRect(x, y, slotW, slotH, 4);
      ctx.fill();
    }
  }
  ctx.fillStyle = '#D4537E';
  ctx.font = 'bold 11px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(label, W/2, H - 8);
  return canvas.toBuffer('image/jpeg', { quality: 0.9 });
}

const templates = [
  { id:'2x1', cols:1, rows:2, label:'2×1 Strip' },
  { id:'3x1', cols:1, rows:3, label:'3×1 Strip' },
  { id:'4x1', cols:1, rows:4, label:'4×1 Strip' },
  { id:'2x2', cols:2, rows:2, label:'2×2 Grid' },
  { id:'2x3', cols:2, rows:3, label:'2×3 Grid' },
];
for (const t of templates) {
  const buf = makeTemplatePrev(t.id, t.cols, t.rows, t.label);
  const out = path.join(root, `public/templates/tmpl-${t.id}.jpg`);
  fs.writeFileSync(out, buf);
  console.log('✅ Template:', out);
}

console.log('\n🎀 Semua placeholder asset berhasil dibuat!');
console.log('\n📌 Untuk pakai asset Photoshop kamu:');
console.log('   Overlay/Dekorasi → ganti file di public/overlays/overlay-{id}.png');
