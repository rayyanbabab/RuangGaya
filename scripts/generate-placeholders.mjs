/**
 * Script untuk membuat placeholder assets:
 * - /public/templates/tmpl-{id}.jpg  (5 template previews)
 * - /public/frames/frame-{id}.png    (4 frame placeholders)
 *
 * Run: node scripts/generate-placeholders.mjs
 */

import { createCanvas } from 'canvas';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

// Pastikan direktori ada
fs.mkdirSync(path.join(root, 'public/templates'), { recursive: true });
fs.mkdirSync(path.join(root, 'public/frames'), { recursive: true });

// ─── Helper ──────────────────────────────────────────────────
function makeTemplatePreview(id, cols, rows, label) {
  const W = 280, H = 180;
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext('2d');

  // Background
  ctx.fillStyle = '#FFF0F5';
  ctx.fillRect(0, 0, W, H);

  // Draw slot placeholders
  const pad = 14;
  const gx = 8, gy = 8;
  const slotW = Math.floor((W - pad * 2 - gx * (cols - 1)) / cols);
  const slotH = Math.floor((H - pad * 2 - 36 - gy * (rows - 1)) / rows);

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = pad + c * (slotW + gx);
      const y = pad + r * (slotH + gy);
      ctx.fillStyle = '#F4C0D1';
      roundRect(ctx, x, y, slotW, slotH, 6);
      ctx.fill();
      ctx.fillStyle = '#D4537E';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('📷', x + slotW / 2, y + slotH / 2);
    }
  }

  // Label
  ctx.fillStyle = '#D4537E';
  ctx.font = 'bold 13px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText(label, W / 2, H - 10);

  return canvas.toBuffer('image/jpeg', { quality: 0.9 });
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function makeFramePlaceholder(id, label, color) {
  const W = 640, H = 480;
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext('2d');

  // Transparent center — only draw border decoration
  ctx.clearRect(0, 0, W, H);

  const bw = 32;
  // Draw decorative border
  ctx.strokeStyle = color;
  ctx.lineWidth = bw;
  ctx.globalAlpha = 0.85;
  ctx.strokeRect(bw / 2, bw / 2, W - bw, H - bw);

  // Corner ornaments
  const corners = [
    [0, 0], [W, 0], [0, H], [W, H]
  ];
  ctx.globalAlpha = 1;
  ctx.fillStyle = color;
  for (const [cx, cy] of corners) {
    ctx.beginPath();
    ctx.arc(cx, cy, 40, 0, Math.PI * 2);
    ctx.fill();
  }

  // Small decorative dots
  ctx.fillStyle = color;
  ctx.globalAlpha = 0.6;
  for (let i = 0; i < 8; i++) {
    ctx.beginPath();
    ctx.arc(
      60 + i * 75,
      18,
      6,
      0, Math.PI * 2
    );
    ctx.fill();
    ctx.beginPath();
    ctx.arc(
      60 + i * 75,
      H - 18,
      6,
      0, Math.PI * 2
    );
    ctx.fill();
  }

  return canvas.toBuffer('image/png');
}

// ─── Generate Templates ───────────────────────────────────────
const templates = [
  { id: '2x1', cols: 1, rows: 2, label: '2×1 Strip' },
  { id: '3x1', cols: 1, rows: 3, label: '3×1 Strip' },
  { id: '4x1', cols: 1, rows: 4, label: '4×1 Strip' },
  { id: '2x2', cols: 2, rows: 2, label: '2×2 Grid' },
  { id: '2x3', cols: 2, rows: 3, label: '2×3 Grid' },
];

for (const t of templates) {
  const buf = makeTemplatePreview(t.id, t.cols, t.rows, t.label);
  const outPath = path.join(root, `public/templates/tmpl-${t.id}.jpg`);
  fs.writeFileSync(outPath, buf);
  console.log('✅ Written:', outPath);
}

// ─── Generate Frames ─────────────────────────────────────────
const frames = [
  { id: 'floral',  label: 'Floral Pink', color: '#D4537E' },
  { id: 'kawaii',  label: 'Kawaii Stars', color: '#ED93B1' },
  { id: 'simple',  label: 'Simple',       color: '#993556' },
  { id: 'retro',   label: 'Retro',        color: '#C06080' },
];

for (const f of frames) {
  const buf = makeFramePlaceholder(f.id, f.label, f.color);
  const outPath = path.join(root, `public/frames/frame-${f.id}.png`);
  fs.writeFileSync(outPath, buf);
  console.log('✅ Written:', outPath);
}

console.log('\n🎀 Placeholder assets berhasil dibuat!');
