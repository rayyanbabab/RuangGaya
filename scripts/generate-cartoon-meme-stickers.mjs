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

// 1. Mickey Ears
{
  const { canvas, ctx } = createStickerCanvas();
  // Ears
  ctx.fillStyle = '#1e1b4b';
  ctx.beginPath();
  ctx.arc(80, 95, 60, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(220, 95, 60, 0, Math.PI * 2);
  ctx.fill();
  // Head
  ctx.beginPath();
  ctx.arc(150, 185, 80, 0, Math.PI * 2);
  ctx.fill();
  // Bow (Red with white polka dots)
  ctx.fillStyle = '#ef4444';
  ctx.beginPath();
  ctx.ellipse(110, 130, 35, 20, -0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(190, 130, 35, 20, 0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(150, 130, 16, 0, Math.PI * 2);
  ctx.fill();
  // Bow dots
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(100, 125, 5, 0, Math.PI * 2);
  ctx.arc(120, 135, 4, 0, Math.PI * 2);
  ctx.arc(180, 135, 4, 0, Math.PI * 2);
  ctx.arc(200, 125, 5, 0, Math.PI * 2);
  ctx.fill();
  // Sparkle
  ctx.fillStyle = '#facc15';
  ctx.font = 'bold 28px sans-serif';
  ctx.fillText('✨', 225, 60);

  saveSticker(canvas, 'mickey-ears.png');
}

// 2. Sheriff Woody Star
{
  const { canvas, ctx } = createStickerCanvas();
  const cx = 150, cy = 150, outer = 110, inner = 45;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.fillStyle = '#eab308';
  ctx.strokeStyle = '#854d0e';
  ctx.lineWidth = 6;
  ctx.beginPath();
  const points = 6;
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const a = (i * Math.PI) / points - Math.PI / 2;
    const x = r * Math.cos(a);
    const y = r * Math.sin(a);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Balls on tips
  for (let i = 0; i < points; i++) {
    const a = (i * 2 * Math.PI) / points - Math.PI / 2;
    ctx.beginPath();
    ctx.arc(outer * Math.cos(a), outer * Math.sin(a), 14, 0, Math.PI * 2);
    ctx.fillStyle = '#ca8a04';
    ctx.fill();
    ctx.stroke();
  }

  // Center circle
  ctx.beginPath();
  ctx.arc(0, 0, 48, 0, Math.PI * 2);
  ctx.fillStyle = '#fef08a';
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#854d0e';
  ctx.font = 'bold 15px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('SHERIFF', 0, 0);
  ctx.restore();

  saveSticker(canvas, 'woody-star.png');
}

// 3. Pixar Luxo Ball
{
  const { canvas, ctx } = createStickerCanvas();
  ctx.save();
  ctx.translate(150, 150);
  // Yellow circle
  ctx.beginPath();
  ctx.arc(0, 0, 120, 0, Math.PI * 2);
  ctx.fillStyle = '#facc15';
  ctx.fill();
  ctx.strokeStyle = '#ca8a04';
  ctx.lineWidth = 6;
  ctx.stroke();
  ctx.clip();

  // Blue stripe
  ctx.fillStyle = '#2563eb';
  ctx.beginPath();
  ctx.ellipse(0, 0, 130, 45, 0, 0, Math.PI * 2);
  ctx.fill();

  // Red star
  ctx.fillStyle = '#ef4444';
  ctx.beginPath();
  const starPts = 5;
  for (let i = 0; i < starPts * 2; i++) {
    const r = i % 2 === 0 ? 55 : 22;
    const a = (i * Math.PI) / starPts - Math.PI / 2;
    const x = r * Math.cos(a);
    const y = r * Math.sin(a);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  saveSticker(canvas, 'pixar-ball.png');
}

// 4. Toy Story Little Green Alien
{
  const { canvas, ctx } = createStickerCanvas();
  ctx.save();
  ctx.translate(150, 160);

  // Antenna
  ctx.strokeStyle = '#4d7c0f';
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.moveTo(0, -60);
  ctx.lineTo(0, -110);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(0, -115, 14, 0, Math.PI * 2);
  ctx.fillStyle = '#84cc16';
  ctx.fill();
  ctx.stroke();

  // Head
  ctx.beginPath();
  ctx.ellipse(0, 0, 110, 75, 0, 0, Math.PI * 2);
  ctx.fillStyle = '#84cc16';
  ctx.fill();
  ctx.stroke();

  // Three Eyes
  const eyePositions = [-50, 0, 50];
  eyePositions.forEach((ex, i) => {
    const ey = i === 1 ? -15 : -8;
    const r = i === 1 ? 24 : 20;
    ctx.beginPath();
    ctx.arc(ex, ey, r, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.strokeStyle = '#4d7c0f';
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(ex, ey, r * 0.45, 0, Math.PI * 2);
    ctx.fillStyle = '#1e293b';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(ex - 3, ey - 3, 3, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
  });

  // Smile
  ctx.beginPath();
  ctx.arc(0, 20, 35, 0.2 * Math.PI, 0.8 * Math.PI);
  ctx.strokeStyle = '#4d7c0f';
  ctx.lineWidth = 6;
  ctx.stroke();

  ctx.restore();
  saveSticker(canvas, 'alien-toystory.png');
}

// 5. Meme "This Is Fine" Coffee Cup & Fire
{
  const { canvas, ctx } = createStickerCanvas();
  // Fire behind cup
  ctx.fillStyle = '#f97316';
  ctx.beginPath();
  ctx.arc(100, 100, 50, 0, Math.PI * 2);
  ctx.arc(200, 90, 60, 0, Math.PI * 2);
  ctx.arc(150, 60, 50, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#facc15';
  ctx.beginPath();
  ctx.arc(120, 110, 35, 0, Math.PI * 2);
  ctx.arc(180, 105, 40, 0, Math.PI * 2);
  ctx.fill();

  // Coffee Cup
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.roundRect(75, 120, 130, 130, [8, 8, 30, 30]);
  ctx.fill();
  ctx.stroke();

  // Cup Handle
  ctx.beginPath();
  ctx.arc(205, 180, 30, -Math.PI / 2, Math.PI / 2);
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 8;
  ctx.stroke();

  // Text on Cup
  ctx.fillStyle = '#dc2626';
  ctx.font = '900 18px Impact, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('THIS IS FINE', 140, 190);

  // Steaming smoke
  ctx.strokeStyle = '#64748b';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(110, 110); ctx.quadraticCurveTo(125, 90, 110, 70);
  ctx.moveTo(145, 110); ctx.quadraticCurveTo(160, 90, 145, 70);
  ctx.stroke();

  saveSticker(canvas, 'this-is-fine-cup.png');
}

// 6. Meme Doge Much Wow
{
  const { canvas, ctx } = createStickerCanvas();
  ctx.save();
  ctx.translate(150, 150);

  // Head
  ctx.beginPath();
  ctx.ellipse(0, 0, 95, 80, 0, 0, Math.PI * 2);
  ctx.fillStyle = '#d97706';
  ctx.fill();
  ctx.strokeStyle = '#78350f';
  ctx.lineWidth = 6;
  ctx.stroke();

  // Ears
  ctx.fillStyle = '#b45309';
  ctx.beginPath();
  ctx.moveTo(-60, -45); ctx.lineTo(-85, -110); ctx.lineTo(-25, -70); ctx.closePath();
  ctx.fill(); ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(60, -45); ctx.lineTo(85, -110); ctx.lineTo(25, -70); ctx.closePath();
  ctx.fill(); ctx.stroke();

  // White Muzzle
  ctx.fillStyle = '#fffbeb';
  ctx.beginPath();
  ctx.ellipse(0, 25, 55, 42, 0, 0, Math.PI * 2);
  ctx.fill(); ctx.stroke();

  // Nose
  ctx.fillStyle = '#1e293b';
  ctx.beginPath();
  ctx.ellipse(0, 10, 18, 12, 0, 0, Math.PI * 2);
  ctx.fill();

  // Eyes
  ctx.beginPath(); ctx.ellipse(-38, -12, 14, 20, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(38, -12, 14, 20, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.beginPath(); ctx.arc(-34, -16, 6, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(42, -16, 6, 0, Math.PI * 2); ctx.fill();

  ctx.restore();

  // Text
  ctx.fillStyle = '#ec4899';
  ctx.font = 'bold 26px "Comic Sans MS", cursive';
  ctx.fillText('much wow', 15, 50);

  saveSticker(canvas, 'doge-face.png');
}

// 7. Meme Confused "Huh?" Cat
{
  const { canvas, ctx } = createStickerCanvas();
  ctx.save();
  ctx.translate(150, 160);

  // Cat Head
  ctx.beginPath();
  ctx.ellipse(0, 0, 100, 75, 0, 0, Math.PI * 2);
  ctx.fillStyle = '#f8fafc';
  ctx.fill();
  ctx.strokeStyle = '#475569';
  ctx.lineWidth = 6;
  ctx.stroke();

  // Cat Ears
  ctx.fillStyle = '#e2e8f0';
  ctx.beginPath();
  ctx.moveTo(-65, -45); ctx.lineTo(-85, -105); ctx.lineTo(-20, -65); ctx.closePath();
  ctx.fill(); ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(65, -45); ctx.lineTo(85, -105); ctx.lineTo(20, -65); ctx.closePath();
  ctx.fill(); ctx.stroke();

  // Round Eyes Wide Open
  ctx.fillStyle = '#1e293b';
  ctx.beginPath(); ctx.arc(-38, -10, 22, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(38, -10, 22, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.beginPath(); ctx.arc(-32, -15, 8, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(44, -15, 8, 0, Math.PI * 2); ctx.fill();

  // Iconic Open O Mouth in Utter Confusion
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.ellipse(0, 32, 22, 28, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ef4444';
  ctx.beginPath();
  ctx.ellipse(0, 42, 12, 10, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();

  // Question Marks
  ctx.fillStyle = '#7c3aed';
  ctx.font = '900 48px Impact, sans-serif';
  ctx.fillText('HUH?', 170, 65);

  saveSticker(canvas, 'huh-cat.png');
}

// 8. Sad Hamster Gwenchana
{
  const { canvas, ctx } = createStickerCanvas();
  ctx.save();
  ctx.translate(150, 160);

  // Ears
  ctx.fillStyle = '#fed7aa';
  ctx.strokeStyle = '#c2410c';
  ctx.lineWidth = 5;
  ctx.beginPath(); ctx.arc(-60, -60, 35, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.arc(60, -60, 35, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#fda4af';
  ctx.beginPath(); ctx.arc(-60, -60, 20, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(60, -60, 20, 0, Math.PI * 2); ctx.fill();

  // Head
  ctx.fillStyle = '#ffedd5';
  ctx.beginPath();
  ctx.ellipse(0, 0, 95, 80, 0, 0, Math.PI * 2);
  ctx.fill(); ctx.stroke();

  // Big Glossy Anime Crying Eyes
  ctx.fillStyle = '#0f172a';
  ctx.beginPath(); ctx.ellipse(-38, -10, 32, 36, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(38, -10, 32, 36, 0, 0, Math.PI * 2); ctx.fill();
  // Reflections
  ctx.fillStyle = '#ffffff';
  ctx.beginPath(); ctx.arc(-46, -24, 15, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(30, -24, 15, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(-26, 4, 7, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(50, 4, 7, 0, Math.PI * 2); ctx.fill();

  // Pink Bow on Ear
  ctx.fillStyle = '#f43f5e';
  ctx.beginPath(); ctx.ellipse(-75, -80, 20, 12, -0.3, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(-45, -80, 20, 12, 0.3, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(-60, -80, 8, 0, Math.PI * 2); ctx.fill();

  // Tiny Mouth & Teardrop
  ctx.fillStyle = '#38bdf8';
  ctx.beginPath();
  ctx.moveTo(38, 25);
  ctx.quadraticCurveTo(55, 55, 38, 65);
  ctx.quadraticCurveTo(20, 55, 38, 25);
  ctx.fill();

  ctx.restore();

  ctx.fillStyle = '#db2777';
  ctx.font = 'bold 20px "Comic Sans MS", cursive';
  ctx.fillText('gwenchana 🥺', 20, 40);

  saveSticker(canvas, 'sad-hamster.png');
}

// 9. Bombastic Side Eye
{
  const { canvas, ctx } = createStickerCanvas();
  // Speech bubble
  ctx.fillStyle = '#000000';
  ctx.beginPath();
  ctx.roundRect(10, 10, 280, 80, 20);
  ctx.fill();

  ctx.fillStyle = '#facc15';
  ctx.font = '900 24px Impact, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('BOMBASTIC SIDE EYE', 150, 46);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 15px sans-serif';
  ctx.fillText('CRIMINAL OFFENSIVE 💅', 150, 72);

  // Dramatic Eyes
  const drawEye = (x, y) => {
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.ellipse(x, y, 50, 32, 0, 0, Math.PI * 2);
    ctx.fill(); ctx.stroke();
    // Pupil looking hard left
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(x - 22, y, 22, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(x - 26, y - 6, 7, 0, Math.PI * 2);
    ctx.fill();
    // Eyebrow
    ctx.beginPath();
    ctx.moveTo(x - 45, y - 35);
    ctx.quadraticCurveTo(x, y - 50, x + 45, y - 30);
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 8;
    ctx.stroke();
  };

  drawEye(85, 180);
  drawEye(215, 180);

  saveSticker(canvas, 'bombastic-side-eye.png');
}

// 10. Skull "I'm Dead"
{
  const { canvas, ctx } = createStickerCanvas();
  ctx.save();
  ctx.translate(150, 140);

  // Skull
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#00f0ff';
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.arc(0, -10, 75, 0, Math.PI * 2);
  ctx.fill(); ctx.stroke();

  ctx.beginPath();
  ctx.roundRect(-42, 45, 84, 45, 12);
  ctx.fill(); ctx.stroke();

  // Eye Sockets
  ctx.fillStyle = '#0f172a';
  ctx.beginPath(); ctx.arc(-28, -8, 22, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(28, -8, 22, 0, Math.PI * 2); ctx.fill();

  // Nose
  ctx.beginPath();
  ctx.moveTo(0, 18); ctx.lineTo(-10, 38); ctx.lineTo(10, 38); ctx.closePath();
  ctx.fill();

  // Teeth lines
  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(-18, 55); ctx.lineTo(-18, 80);
  ctx.moveTo(0, 55); ctx.lineTo(0, 80);
  ctx.moveTo(18, 55); ctx.lineTo(18, 80);
  ctx.stroke();

  ctx.restore();

  // Text
  ctx.fillStyle = '#ec4899';
  ctx.font = '900 32px Impact, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText("I'M DEAD 💀", 150, 275);

  saveSticker(canvas, 'skull-dead.png');
}

console.log('All cartoon & meme stickers generated successfully!');
