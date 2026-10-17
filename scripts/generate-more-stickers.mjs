import { createCanvas } from 'canvas';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const overlaysDir = path.join(__dirname, '..', 'public', 'overlays');

const STICKER_SIZE = 300;

function createStickerCanvas() {
  const canvas = createCanvas(STICKER_SIZE, STICKER_SIZE);
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, STICKER_SIZE, STICKER_SIZE);
  return { canvas, ctx };
}

function saveSticker(canvas, filename) {
  const buf = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(overlaysDir, filename), buf);
  console.log(`Saved sticker: ${filename}`);
}

// 1. Cars Lightning Bolt 95
{
  const { canvas, ctx } = createStickerCanvas();
  ctx.save();
  ctx.translate(150, 150);

  // Big Thunder
  ctx.fillStyle = '#facc15';
  ctx.strokeStyle = '#ca8a04';
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.moveTo(30, -110);
  ctx.lineTo(-40, 0);
  ctx.lineTo(20, -5);
  ctx.lineTo(-50, 110);
  ctx.lineTo(70, -10);
  ctx.lineTo(10, -5);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Red text 95
  ctx.fillStyle = '#dc2626';
  ctx.font = '900 50px Impact, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('95', -5, 20);

  ctx.restore();
  saveSticker(canvas, 'cars-95.png');
}

// 2. Capybara with Orange
{
  const { canvas, ctx } = createStickerCanvas();
  ctx.save();
  ctx.translate(150, 160);

  // Head
  ctx.fillStyle = '#b45309';
  ctx.strokeStyle = '#78350f';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.roundRect(-70, -70, 140, 120, 30);
  ctx.fill();
  ctx.stroke();

  // Snout
  ctx.fillStyle = '#92400e';
  ctx.beginPath();
  ctx.roundRect(-55, -5, 110, 50, 20);
  ctx.fill();

  // Chill slit eyes
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(-45, -30); ctx.lineTo(-20, -30);
  ctx.moveTo(20, -30); ctx.lineTo(45, -30);
  ctx.stroke();

  // Ears
  ctx.fillStyle = '#78350f';
  ctx.beginPath(); ctx.arc(-72, -50, 15, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(72, -50, 15, 0, Math.PI * 2); ctx.fill();

  // Orange on top
  ctx.fillStyle = '#f97316';
  ctx.strokeStyle = '#c2410c';
  ctx.lineWidth = 5;
  ctx.beginPath(); ctx.arc(0, -95, 30, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#16a34a';
  ctx.beginPath(); ctx.ellipse(0, -130, 8, 16, 0.4, 0, Math.PI * 2); ctx.fill();

  ctx.restore();

  ctx.fillStyle = '#78350f';
  ctx.font = '900 24px Impact, sans-serif';
  ctx.fillText('OK I PULL UP', 85, 35);

  saveSticker(canvas, 'capybara.png');
}

// 3. Chill Guy
{
  const { canvas, ctx } = createStickerCanvas();
  ctx.save();
  ctx.translate(150, 150);

  // Dog head
  ctx.fillStyle = '#fef3c7';
  ctx.strokeStyle = '#78350f';
  ctx.lineWidth = 6;
  ctx.beginPath(); ctx.ellipse(0, -45, 60, 48, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

  // Ear
  ctx.fillStyle = '#d97706';
  ctx.beginPath(); ctx.ellipse(-55, -30, 20, 35, -0.2, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

  // Eyes (happy curves)
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(-22, -45, 12, 1.1 * Math.PI, 1.9 * Math.PI);
  ctx.arc(22, -45, 12, 1.1 * Math.PI, 1.9 * Math.PI);
  ctx.stroke();

  // Smile
  ctx.beginPath();
  ctx.arc(0, -25, 20, 0.1 * Math.PI, 0.9 * Math.PI);
  ctx.stroke();

  // Brown sweater
  ctx.fillStyle = '#92400e';
  ctx.beginPath();
  ctx.roundRect(-65, 0, 130, 120, [30, 30, 10, 10]);
  ctx.fill(); ctx.stroke();

  // Collar
  ctx.fillStyle = '#b45309';
  ctx.beginPath();
  ctx.roundRect(-45, -10, 90, 25, 10);
  ctx.fill(); ctx.stroke();

  ctx.restore();

  ctx.fillStyle = '#78350f';
  ctx.font = 'bold 22px "Comic Sans MS", cursive';
  ctx.fillText('just a chill guy ☕', 60, 30);

  saveSticker(canvas, 'chill-guy.png');
}

// 4. Moai GigaChad
{
  const { canvas, ctx } = createStickerCanvas();
  ctx.save();
  ctx.translate(150, 150);

  // Moai head
  ctx.fillStyle = '#64748b';
  ctx.strokeStyle = '#00f0ff';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(-50, -100);
  ctx.lineTo(20, -100);
  ctx.lineTo(20, -50);
  ctx.lineTo(55, -30);
  ctx.lineTo(25, 10);
  ctx.lineTo(25, 80);
  ctx.lineTo(-50, 80);
  ctx.closePath();
  ctx.fill(); ctx.stroke();

  // Brow
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(-45, -70, 55, 15);

  // Sunglasses
  ctx.fillStyle = '#000000';
  ctx.strokeStyle = '#00f0ff';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.roundRect(-55, -60, 45, 24, 6);
  ctx.roundRect(0, -60, 45, 24, 6);
  ctx.fill(); ctx.stroke();

  // Big lips
  ctx.fillStyle = '#334155';
  ctx.fillRect(-25, 40, 40, 12);

  ctx.restore();

  ctx.fillStyle = '#00f0ff';
  ctx.font = '900 24px Impact, sans-serif';
  ctx.fillText('MEWING 🗿', 95, 30);

  saveSticker(canvas, 'moai-gigachad.png');
}

// 5. Finding Nemo Clownfish
{
  const { canvas, ctx } = createStickerCanvas();
  ctx.save();
  ctx.translate(150, 150);

  // Orange Fish Body
  ctx.fillStyle = '#f97316';
  ctx.strokeStyle = '#c2410c';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.ellipse(0, 0, 95, 60, 0, 0, Math.PI * 2);
  ctx.fill(); ctx.stroke();

  // Tail
  ctx.beginPath();
  ctx.moveTo(-85, 0); ctx.lineTo(-135, -45); ctx.lineTo(-135, 45); ctx.closePath();
  ctx.fill(); ctx.stroke();

  // White stripes
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.ellipse(-30, 0, 18, 58, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(30, 0, 18, 55, 0, 0, Math.PI * 2);
  ctx.fill();

  // Big Eye
  ctx.beginPath(); ctx.arc(55, -15, 20, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#0f172a';
  ctx.beginPath(); ctx.arc(60, -15, 10, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.beginPath(); ctx.arc(57, -19, 4, 0, Math.PI * 2); ctx.fill();

  ctx.restore();

  ctx.fillStyle = '#0284c7';
  ctx.font = '900 22px "Comic Sans MS", cursive';
  ctx.fillText('NEMO 🐠', 110, 40);

  saveSticker(canvas, 'nemo-fish.png');
}

// 6. Smudge Confused Salad Cat
{
  const { canvas, ctx } = createStickerCanvas();
  ctx.save();
  ctx.translate(150, 150);

  // White cat head
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 6;
  ctx.beginPath(); ctx.ellipse(0, -20, 80, 60, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

  // Ears
  ctx.beginPath();
  ctx.moveTo(-65, -55); ctx.lineTo(-85, -115); ctx.lineTo(-20, -70); ctx.closePath();
  ctx.fill(); ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(65, -55); ctx.lineTo(85, -115); ctx.lineTo(20, -70); ctx.closePath();
  ctx.fill(); ctx.stroke();

  // Confused squint eyes
  ctx.lineWidth = 7;
  ctx.beginPath();
  ctx.moveTo(-45, -30); ctx.lineTo(-15, -24);
  ctx.moveTo(15, -24); ctx.lineTo(45, -30);
  ctx.stroke();

  // Plate with salad below
  ctx.fillStyle = '#ffffff';
  ctx.lineWidth = 5;
  ctx.beginPath(); ctx.ellipse(0, 55, 90, 25, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#22c55e';
  ctx.beginPath(); ctx.arc(-25, 50, 18, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(20, 48, 22, 0, Math.PI * 2); ctx.fill();

  ctx.restore();

  ctx.fillStyle = '#ef4444';
  ctx.font = '900 24px Impact, sans-serif';
  ctx.fillText('WHY U YELLING? 🥗', 70, 35);

  saveSticker(canvas, 'smudge-cat.png');
}

console.log('All additional stickers generated successfully!');
