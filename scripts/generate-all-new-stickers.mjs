import { createCanvas } from 'canvas';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const overlaysDir = path.join(__dirname, '..', 'public', 'overlays');

const S = 300;

function createSticker() {
  const canvas = createCanvas(S, S);
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, S, S);
  return { canvas, ctx };
}

function save(canvas, filename) {
  const buf = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(overlaysDir, filename), buf);
  console.log(`Saved: ${filename}`);
}

// 1. Coquette Bow Pink
{
  const { canvas, ctx } = createSticker();
  ctx.save();
  ctx.translate(150, 150);

  // Left loop
  ctx.fillStyle = '#ff85a1';
  ctx.strokeStyle = '#f72585';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(-90, -100, -130, -10, -30, 20);
  ctx.bezierCurveTo(-15, 15, -5, 5, 0, 0);
  ctx.fill();
  ctx.stroke();

  // Right loop
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(90, -100, 130, -10, 30, 20);
  ctx.bezierCurveTo(15, 15, 5, 5, 0, 0);
  ctx.fill();
  ctx.stroke();

  // Tails
  ctx.fillStyle = '#ff99b0';
  ctx.beginPath();
  ctx.moveTo(-15, 10);
  ctx.bezierCurveTo(-50, 50, -70, 100, -85, 115);
  ctx.lineTo(-65, 100);
  ctx.lineTo(-40, 115);
  ctx.bezierCurveTo(-35, 70, -20, 40, -5, 15);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(15, 10);
  ctx.bezierCurveTo(50, 50, 70, 100, 85, 115);
  ctx.lineTo(65, 100);
  ctx.lineTo(40, 115);
  ctx.bezierCurveTo(35, 70, 20, 40, 5, 15);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Center knot
  ctx.fillStyle = '#f72585';
  ctx.beginPath();
  ctx.arc(0, 5, 22, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#b5179e';
  ctx.stroke();

  // Highlight
  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  ctx.beginPath();
  ctx.arc(-5, 0, 6, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
  save(canvas, 'coquette-bow-pink.png');
}

// 2. Coquette Bow Black
{
  const { canvas, ctx } = createSticker();
  ctx.save();
  ctx.translate(150, 150);

  ctx.fillStyle = '#22222a';
  ctx.strokeStyle = '#050508';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(-90, -100, -130, -10, -30, 20);
  ctx.bezierCurveTo(-15, 15, -5, 5, 0, 0);
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(90, -100, 130, -10, 30, 20);
  ctx.bezierCurveTo(15, 15, 5, 5, 0, 0);
  ctx.fill();
  ctx.stroke();

  // Tails
  ctx.fillStyle = '#33333f';
  ctx.beginPath();
  ctx.moveTo(-15, 10);
  ctx.bezierCurveTo(-50, 50, -70, 100, -85, 115);
  ctx.lineTo(-65, 100);
  ctx.lineTo(-40, 115);
  ctx.bezierCurveTo(-35, 70, -20, 40, -5, 15);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(15, 10);
  ctx.bezierCurveTo(50, 50, 70, 100, 85, 115);
  ctx.lineTo(65, 100);
  ctx.lineTo(40, 115);
  ctx.bezierCurveTo(35, 70, 20, 40, 5, 15);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Center knot
  ctx.fillStyle = '#111116';
  ctx.beginPath();
  ctx.arc(0, 5, 22, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#000000';
  ctx.stroke();

  // White highlight
  ctx.fillStyle = 'rgba(255,255,255,0.4)';
  ctx.beginPath();
  ctx.arc(-5, 0, 5, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
  save(canvas, 'coquette-bow-black.png');
}

// 3. Stamp Photo Dump
{
  const { canvas, ctx } = createSticker();
  ctx.save();
  ctx.translate(150, 150);
  ctx.rotate(-0.1);

  // Badge background
  ctx.fillStyle = '#ffe5ec';
  ctx.strokeStyle = '#fb6f92';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.roundRect(-125, -55, 250, 110, 18);
  ctx.fill();
  ctx.stroke();

  // Inner dashed border
  ctx.setLineDash([8, 6]);
  ctx.strokeStyle = '#ff8fab';
  ctx.lineWidth = 3;
  ctx.strokeRect(-115, -45, 230, 90);
  ctx.setLineDash([]);

  // Text
  ctx.fillStyle = '#c9184a';
  ctx.font = '900 28px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('PHOTO DUMP 📸', 0, -12);

  ctx.fillStyle = '#fb6f92';
  ctx.font = 'bold 15px sans-serif';
  ctx.fillText('★ KOREAN STUDIO MEMORY ★', 0, 22);

  ctx.restore();
  save(canvas, 'stamp-photodump.png');
}

// 4. Stamp Besties
{
  const { canvas, ctx } = createSticker();
  ctx.save();
  ctx.translate(150, 150);
  ctx.rotate(0.08);

  ctx.fillStyle = '#e8f0fe';
  ctx.strokeStyle = '#4361ee';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.roundRect(-120, -50, 240, 100, 25);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#7209b7';
  ctx.font = '900 32px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('BESTIES ♡', 0, -10);

  ctx.fillStyle = '#3a0ca3';
  ctx.font = 'bold 16px sans-serif';
  ctx.fillText('FOREVER & ALWAYS ✨', 0, 24);

  ctx.restore();
  save(canvas, 'stamp-besties.png');
}

// 5. Stamp 100% Cute
{
  const { canvas, ctx } = createSticker();
  ctx.save();
  ctx.translate(150, 150);

  // Circular stamp
  ctx.fillStyle = '#fff0f3';
  ctx.strokeStyle = '#ff4d6d';
  ctx.lineWidth = 7;
  ctx.beginPath();
  ctx.arc(0, 0, 115, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.setLineDash([6, 5]);
  ctx.strokeStyle = '#c9184a';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(0, 0, 100, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = '#a4133c';
  ctx.font = '900 34px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('100% CUTE', 0, -20);

  ctx.fillStyle = '#ff758f';
  ctx.font = 'bold 36px sans-serif';
  ctx.fillText('🎀 ♡ 🎀', 0, 24);

  ctx.restore();
  save(canvas, 'stamp-cutie.png');
}

// 6. Stamp Korean Frame Life Four Cuts
{
  const { canvas, ctx } = createSticker();
  ctx.save();
  ctx.translate(150, 150);

  ctx.fillStyle = '#1a1a24';
  ctx.strokeStyle = '#ffd166';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.roundRect(-130, -50, 260, 100, 14);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#ffd166';
  ctx.font = 'bold 24px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('인생네컷 • 4 CUTS', 0, -12);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 14px monospace';
  ctx.fillText('RUANGGAYA SPECIAL MEMORY', 0, 22);

  ctx.restore();
  save(canvas, 'stamp-korean-frame.png');
}

// 7. Sparkle Star Gold
{
  const { canvas, ctx } = createSticker();
  ctx.save();
  ctx.translate(150, 150);

  // 4 point big sparkle
  const grad = ctx.createRadialGradient(0, 0, 10, 0, 0, 120);
  grad.addColorStop(0, '#ffffff');
  grad.addColorStop(0.3, '#ffea00');
  grad.addColorStop(0.7, '#ffaa00');
  grad.addColorStop(1, '#ff6600');

  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.moveTo(0, -125);
  ctx.quadraticCurveTo(0, 0, 125, 0);
  ctx.quadraticCurveTo(0, 0, 0, 125);
  ctx.quadraticCurveTo(0, 0, -125, 0);
  ctx.quadraticCurveTo(0, 0, 0, -125);
  ctx.fill();

  // Little diagonal sparkles
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.moveTo(0, -45);
  ctx.quadraticCurveTo(0, 0, 45, 0);
  ctx.quadraticCurveTo(0, 0, 0, 45);
  ctx.quadraticCurveTo(0, 0, -45, 0);
  ctx.quadraticCurveTo(0, 0, 0, -45);
  ctx.fill();

  // Mini stars
  ctx.beginPath();
  ctx.arc(80, -75, 8, 0, Math.PI * 2);
  ctx.arc(-80, 75, 6, 0, Math.PI * 2);
  ctx.arc(-70, -60, 5, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
  save(canvas, 'sparkle-star-gold.png');
}

// 8. Cherry Blossom Flower
{
  const { canvas, ctx } = createSticker();
  ctx.save();
  ctx.translate(150, 150);

  // 5 petals
  for (let i = 0; i < 5; i++) {
    ctx.save();
    ctx.rotate((i * Math.PI * 2) / 5);
    ctx.fillStyle = '#ffb3c6';
    ctx.strokeStyle = '#ff758f';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(-45, -70, -30, -115, 0, -100);
    ctx.bezierCurveTo(30, -115, 45, -70, 0, 0);
    ctx.fill();
    ctx.stroke();

    // Petal notch
    ctx.beginPath();
    ctx.moveTo(-10, -105);
    ctx.lineTo(0, -90);
    ctx.lineTo(10, -105);
    ctx.strokeStyle = '#c9184a';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    ctx.restore();
  }

  // Center
  ctx.fillStyle = '#ff4d6d';
  ctx.beginPath();
  ctx.arc(0, 0, 26, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#ffd166';
  for (let j = 0; j < 8; j++) {
    const a = (j * Math.PI * 2) / 8;
    ctx.beginPath();
    ctx.arc(Math.cos(a) * 14, Math.sin(a) * 14, 4, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
  save(canvas, 'cherry-blossom.png');
}

// 9. Cute Frog Mushroom
{
  const { canvas, ctx } = createSticker();
  ctx.save();
  ctx.translate(150, 160);

  // Frog head
  ctx.fillStyle = '#70e000';
  ctx.strokeStyle = '#38b000';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.ellipse(0, 20, 95, 75, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Frog eye bulges
  ctx.beginPath();
  ctx.arc(-55, -35, 36, 0, Math.PI * 2);
  ctx.arc(55, -35, 36, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Eyes inside
  ctx.fillStyle = '#102008';
  ctx.beginPath();
  ctx.arc(-55, -35, 16, 0, Math.PI * 2);
  ctx.arc(55, -35, 16, 0, Math.PI * 2);
  ctx.fill();

  // Catchlight
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(-60, -40, 6, 0, Math.PI * 2);
  ctx.arc(50, -40, 6, 0, Math.PI * 2);
  ctx.fill();

  // Pink blush
  ctx.fillStyle = 'rgba(255, 105, 180, 0.6)';
  ctx.beginPath();
  ctx.ellipse(-55, 30, 20, 12, 0, 0, Math.PI * 2);
  ctx.ellipse(55, 30, 20, 12, 0, 0, Math.PI * 2);
  ctx.fill();

  // Smile
  ctx.strokeStyle = '#004b23';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(0, 30, 28, 0.2, Math.PI - 0.2);
  ctx.stroke();

  // Mushroom hat on top
  ctx.fillStyle = '#e63946';
  ctx.strokeStyle = '#ba181b';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(0, -75, 45, Math.PI, 0);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Mushroom white spots
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(-20, -95, 7, 0, Math.PI * 2);
  ctx.arc(15, -90, 8, 0, Math.PI * 2);
  ctx.arc(0, -110, 6, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
  save(canvas, 'cute-frog-mushroom.png');
}

// 10. Shiba Happy
{
  const { canvas, ctx } = createSticker();
  ctx.save();
  ctx.translate(150, 150);

  // Shiba face
  ctx.fillStyle = '#f4a261';
  ctx.strokeStyle = '#e76f51';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.ellipse(0, 20, 95, 80, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Ears
  ctx.beginPath();
  ctx.moveTo(-75, -20);
  ctx.lineTo(-70, -100);
  ctx.lineTo(-20, -50);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(75, -20);
  ctx.lineTo(70, -100);
  ctx.lineTo(20, -50);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // White muzzle & cheeks
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.ellipse(0, 42, 60, 45, 0, 0, Math.PI * 2);
  ctx.ellipse(-50, 28, 35, 35, 0, 0, Math.PI * 2);
  ctx.ellipse(50, 28, 35, 35, 0, 0, Math.PI * 2);
  ctx.fill();

  // Eyebrow white dots
  ctx.beginPath();
  ctx.arc(-40, -15, 10, 0, Math.PI * 2);
  ctx.arc(40, -15, 10, 0, Math.PI * 2);
  ctx.fill();

  // Happy curved eyes ^^
  ctx.strokeStyle = '#264653';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(-45, 10, 18, Math.PI, 0);
  ctx.arc(45, 10, 18, Math.PI, 0);
  ctx.stroke();

  // Black nose
  ctx.fillStyle = '#264653';
  ctx.beginPath();
  ctx.ellipse(0, 36, 12, 8, 0, 0, Math.PI * 2);
  ctx.fill();

  // Tongue
  ctx.fillStyle = '#ff6b6b';
  ctx.beginPath();
  ctx.arc(0, 56, 15, 0, Math.PI);
  ctx.fill();

  // Blush
  ctx.fillStyle = 'rgba(255, 107, 107, 0.5)';
  ctx.beginPath();
  ctx.ellipse(-65, 35, 16, 10, 0, 0, Math.PI * 2);
  ctx.ellipse(65, 35, 16, 10, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
  save(canvas, 'shiba-happy.png');
}

// 11. Cute Panda Bamboo
{
  const { canvas, ctx } = createSticker();
  ctx.save();
  ctx.translate(150, 150);

  // Black ears
  ctx.fillStyle = '#212529';
  ctx.beginPath();
  ctx.arc(-70, -60, 34, 0, Math.PI * 2);
  ctx.arc(70, -60, 34, 0, Math.PI * 2);
  ctx.fill();

  // White head
  ctx.fillStyle = '#f8f9fa';
  ctx.strokeStyle = '#212529';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.ellipse(0, 15, 95, 80, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Black eye patches
  ctx.fillStyle = '#212529';
  ctx.beginPath();
  ctx.ellipse(-42, 5, 26, 32, -0.2, 0, Math.PI * 2);
  ctx.ellipse(42, 5, 26, 32, 0.2, 0, Math.PI * 2);
  ctx.fill();

  // Cute white pupils
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(-40, 0, 10, 0, Math.PI * 2);
  ctx.arc(40, 0, 10, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#212529';
  ctx.beginPath();
  ctx.arc(-40, 0, 5, 0, Math.PI * 2);
  ctx.arc(40, 0, 5, 0, Math.PI * 2);
  ctx.fill();

  // Nose
  ctx.beginPath();
  ctx.ellipse(0, 32, 14, 9, 0, 0, Math.PI * 2);
  ctx.fill();

  // Mouth
  ctx.strokeStyle = '#212529';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(-10, 46, 10, 0, Math.PI);
  ctx.arc(10, 46, 10, 0, Math.PI);
  ctx.stroke();

  // Pink blush
  ctx.fillStyle = 'rgba(255, 143, 163, 0.55)';
  ctx.beginPath();
  ctx.arc(-65, 30, 14, 0, Math.PI * 2);
  ctx.arc(65, 30, 14, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
  save(canvas, 'cute-panda.png');
}

// 12. Cat Paw Pink
{
  const { canvas, ctx } = createSticker();
  ctx.save();
  ctx.translate(150, 150);

  // Paw base (white outline)
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#ffb3c6';
  ctx.lineWidth = 7;
  ctx.beginPath();
  ctx.ellipse(0, 25, 90, 75, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Main bean pad
  ctx.fillStyle = '#ff4d6d';
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(45, -20, 60, 45, 35, 65);
  ctx.bezierCurveTo(20, 75, -20, 75, -35, 65);
  ctx.bezierCurveTo(-60, 45, -45, -20, 0, 0);
  ctx.fill();

  // 4 toe beans
  const toes = [
    [-60, -25, 18, 24, -0.3],
    [-22, -55, 20, 26, -0.1],
    [22, -55, 20, 26, 0.1],
    [60, -25, 18, 24, 0.3],
  ];
  toes.forEach(([tx, ty, rx, ry, rot]) => {
    ctx.beginPath();
    ctx.ellipse(tx, ty, rx, ry, rot, 0, Math.PI * 2);
    ctx.fill();
  });

  // Sparkles
  ctx.fillStyle = '#ffd166';
  ctx.font = 'bold 26px sans-serif';
  ctx.fillText('✨', -95, -70);
  ctx.fillText('✨', 80, -70);

  ctx.restore();
  save(canvas, 'cat-paw-pink.png');
}

// 13. Korean Finger Heart
{
  const { canvas, ctx } = createSticker();
  ctx.save();
  ctx.translate(150, 150);

  // Floating red heart on top
  ctx.fillStyle = '#ff0054';
  ctx.strokeStyle = '#9e0059';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(0, -65);
  ctx.bezierCurveTo(-35, -110, -65, -60, 0, -20);
  ctx.bezierCurveTo(65, -60, 35, -110, 0, -65);
  ctx.fill();
  ctx.stroke();

  // Hand gesture base
  ctx.fillStyle = '#ffdfba';
  ctx.strokeStyle = '#c8956a';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.roundRect(-45, 0, 90, 110, 30);
  ctx.fill();
  ctx.stroke();

  // Crossed thumb and index
  ctx.beginPath();
  ctx.roundRect(-30, -35, 32, 70, 16);
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.roundRect(0, -35, 32, 70, 16);
  ctx.fill();
  ctx.stroke();

  // Sparkle stars around heart
  ctx.fillStyle = '#ffd166';
  ctx.font = 'bold 30px sans-serif';
  ctx.fillText('✨', -75, -80);
  ctx.fillText('✨', 55, -80);

  ctx.restore();
  save(canvas, 'heart-finger.png');
}

// 14. Pixel Heart Red
{
  const { canvas, ctx } = createSticker();
  ctx.save();
  ctx.translate(150, 150);

  const pixelMap = [
    '..XXXX..XXXX..',
    '.XXXXXX.XXXXXX.',
    'XXXXXXXXXXXXXX',
    'XXXXXXXXXXXXXX',
    'XXXXXXXXXXXXXX',
    '.XXXXXXXXXXXX.',
    '..XXXXXXXXXX..',
    '...XXXXXXXX...',
    '....XXXXXX....',
    '.....XXXX.....',
    '......XX......',
  ];
  const pxSize = 16;
  const startX = -(pixelMap[0].length * pxSize) / 2;
  const startY = -(pixelMap.length * pxSize) / 2;

  pixelMap.forEach((row, r) => {
    for (let c = 0; c < row.length; c++) {
      if (row[c] === 'X') {
        const x = startX + c * pxSize;
        const y = startY + r * pxSize;

        // Black border
        ctx.fillStyle = '#1e1e24';
        ctx.fillRect(x - 2, y - 2, pxSize + 4, pxSize + 4);

        // Gradient color
        if (r <= 2 && (c === 2 || c === 3 || c === 8 || c === 9)) {
          ctx.fillStyle = '#ffffff'; // pixel shine
        } else if (r <= 4) {
          ctx.fillStyle = '#ff3366';
        } else {
          ctx.fillStyle = '#d90429';
        }
        ctx.fillRect(x, y, pxSize, pxSize);
      }
    }
  });

  ctx.restore();
  save(canvas, 'pixel-heart.png');
}

// 15. Y2K Flame
{
  const { canvas, ctx } = createSticker();
  ctx.save();
  ctx.translate(150, 150);

  const flameGrad = ctx.createLinearGradient(0, 100, 0, -110);
  flameGrad.addColorStop(0, '#f72585');
  flameGrad.addColorStop(0.5, '#7209b7');
  flameGrad.addColorStop(1, '#4cc9f0');

  ctx.fillStyle = flameGrad;
  ctx.strokeStyle = '#3a0ca3';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(0, 105);
  ctx.bezierCurveTo(-80, 105, -100, 30, -50, -30);
  ctx.bezierCurveTo(-30, -60, -70, -90, -40, -120);
  ctx.bezierCurveTo(-15, -90, -10, -50, 0, -80);
  ctx.bezierCurveTo(15, -110, 45, -115, 45, -70);
  ctx.bezierCurveTo(75, -50, 100, 30, 0, 105);
  ctx.fill();
  ctx.stroke();

  // Inner flame
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.moveTo(0, 90);
  ctx.bezierCurveTo(-35, 90, -45, 45, -20, 0);
  ctx.bezierCurveTo(-10, -25, 10, -40, 15, -20);
  ctx.bezierCurveTo(40, 20, 35, 90, 0, 90);
  ctx.fill();

  ctx.restore();
  save(canvas, 'y2k-flame.png');
}

// 16. Fire Lit Emoji
{
  const { canvas, ctx } = createSticker();
  ctx.save();
  ctx.translate(150, 150);

  const grad = ctx.createLinearGradient(0, 110, 0, -110);
  grad.addColorStop(0, '#d90429');
  grad.addColorStop(0.5, '#f77f00');
  grad.addColorStop(1, '#ffea00');

  ctx.fillStyle = grad;
  ctx.strokeStyle = '#9d0208';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(0, 110);
  ctx.bezierCurveTo(-90, 110, -110, 20, -50, -40);
  ctx.bezierCurveTo(-20, -70, -70, -110, -30, -130);
  ctx.bezierCurveTo(10, -80, 15, -50, 25, -75);
  ctx.bezierCurveTo(40, -100, 75, -90, 50, -30);
  ctx.bezierCurveTo(100, 20, 80, 110, 0, 110);
  ctx.fill();
  ctx.stroke();

  // Inner yellow fire
  ctx.fillStyle = '#fffa65';
  ctx.beginPath();
  ctx.moveTo(0, 95);
  ctx.bezierCurveTo(-45, 95, -55, 40, -25, 0);
  ctx.bezierCurveTo(-10, -20, 5, -45, 15, -15);
  ctx.bezierCurveTo(45, 30, 45, 95, 0, 95);
  ctx.fill();

  ctx.restore();
  save(canvas, 'fire-lit.png');
}

// 17. Heart Eyes Emoji
{
  const { canvas, ctx } = createSticker();
  ctx.save();
  ctx.translate(150, 150);

  // Yellow Face
  ctx.fillStyle = '#ffbe0b';
  ctx.strokeStyle = '#fb5607';
  ctx.lineWidth = 7;
  ctx.beginPath();
  ctx.arc(0, 0, 110, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Heart Eyes
  const drawEyeHeart = (hx, hy) => {
    ctx.save();
    ctx.translate(hx, hy);
    ctx.fillStyle = '#d90429';
    ctx.strokeStyle = '#9d0208';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, 10);
    ctx.bezierCurveTo(35, -25, 45, -55, 0, -25);
    ctx.bezierCurveTo(-45, -55, -35, -25, 0, 10);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  };
  drawEyeHeart(-45, 0);
  drawEyeHeart(45, 0);

  // Big Happy Smile
  ctx.fillStyle = '#4a0e17';
  ctx.beginPath();
  ctx.arc(0, 25, 55, 0.1, Math.PI - 0.1);
  ctx.closePath();
  ctx.fill();

  // White teeth
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.roundRect(-40, 25, 80, 18, [0, 0, 10, 10]);
  ctx.fill();

  // Pink tongue
  ctx.fillStyle = '#ff5d8f';
  ctx.beginPath();
  ctx.arc(0, 65, 26, Math.PI, 0);
  ctx.fill();

  ctx.restore();
  save(canvas, 'heart-eyes.png');
}

// 18. Sunglasses Cool Emoji
{
  const { canvas, ctx } = createSticker();
  ctx.save();
  ctx.translate(150, 150);

  // Yellow Face
  ctx.fillStyle = '#ffd166';
  ctx.strokeStyle = '#f77f00';
  ctx.lineWidth = 7;
  ctx.beginPath();
  ctx.arc(0, 0, 110, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Sunglasses
  ctx.fillStyle = '#111116';
  ctx.beginPath();
  // Left lens
  ctx.roundRect(-90, -45, 80, 50, [10, 10, 30, 30]);
  // Right lens
  ctx.roundRect(10, -45, 80, 50, [10, 10, 30, 30]);
  ctx.fill();

  // Frame bridge
  ctx.strokeStyle = '#111116';
  ctx.lineWidth = 14;
  ctx.beginPath();
  ctx.moveTo(-105, -38);
  ctx.lineTo(105, -38);
  ctx.stroke();

  // White shine on glasses
  ctx.strokeStyle = 'rgba(255,255,255,0.7)';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(-75, -35); ctx.lineTo(-45, -5);
  ctx.moveTo(-60, -35); ctx.lineTo(-35, -10);
  ctx.moveTo(25, -35);  ctx.lineTo(55, -5);
  ctx.moveTo(40, -35);  ctx.lineTo(65, -10);
  ctx.stroke();

  // Smirk Smile
  ctx.strokeStyle = '#2b2d42';
  ctx.lineWidth = 7;
  ctx.beginPath();
  ctx.arc(10, 40, 42, 0.2, Math.PI - 0.7);
  ctx.stroke();

  ctx.restore();
  save(canvas, 'sunglasses-cool.png');
}

// 19. Royal Gold Crown
{
  const { canvas, ctx } = createSticker();
  ctx.save();
  ctx.translate(150, 150);

  const cGrad = ctx.createLinearGradient(0, -90, 0, 75);
  cGrad.addColorStop(0, '#fff3b0');
  cGrad.addColorStop(0.4, '#ffd166');
  cGrad.addColorStop(1, '#e09f3e');

  ctx.fillStyle = cGrad;
  ctx.strokeStyle = '#9e2a2b';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(-110, 55);
  ctx.lineTo(-120, -40);
  ctx.lineTo(-55, 10);
  ctx.lineTo(0, -85);
  ctx.lineTo(55, 10);
  ctx.lineTo(120, -40);
  ctx.lineTo(110, 55);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Bottom band
  ctx.fillStyle = '#9e2a2b';
  ctx.beginPath();
  ctx.roundRect(-110, 45, 220, 25, 8);
  ctx.fill();

  // Gems
  const gems = [
    [-80, 57, '#06d6a0'],
    [-30, 57, '#ef476f'],
    [30, 57, '#118ab2'],
    [80, 57, '#06d6a0'],
    [0, -70, '#ef476f'],
    [-110, -30, '#118ab2'],
    [110, -30, '#ef476f'],
  ];
  gems.forEach(([gx, gy, col]) => {
    ctx.fillStyle = col;
    ctx.beginPath();
    ctx.arc(gx, gy, 8, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.restore();
  save(canvas, 'crown-gold.png');
}

// 20. Speech Bubble SLAY!
{
  const { canvas, ctx } = createSticker();
  ctx.save();
  ctx.translate(150, 150);
  ctx.rotate(-0.06);

  ctx.fillStyle = '#ff007f';
  ctx.strokeStyle = '#202030';
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.roundRect(-120, -60, 240, 105, 30);
  ctx.fill();
  ctx.stroke();

  // Tail
  ctx.beginPath();
  ctx.moveTo(-40, 45);
  ctx.lineTo(-70, 95);
  ctx.lineTo(-10, 45);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#ffffff';
  ctx.font = '900 48px Impact, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('SLAY! ✨', 0, -8);

  ctx.restore();
  save(canvas, 'speech-slay.png');
}

// 21. Speech Bubble OMG!
{
  const { canvas, ctx } = createSticker();
  ctx.save();
  ctx.translate(150, 150);
  ctx.rotate(0.08);

  ctx.fillStyle = '#fee440';
  ctx.strokeStyle = '#202030';
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.roundRect(-120, -60, 240, 105, 30);
  ctx.fill();
  ctx.stroke();

  // Tail
  ctx.beginPath();
  ctx.moveTo(10, 45);
  ctx.lineTo(60, 95);
  ctx.lineTo(40, 45);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#7209b7';
  ctx.font = '900 48px Impact, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('OMG! 💖', 0, -8);

  ctx.restore();
  save(canvas, 'speech-omg.png');
}

// 22. Peace Sign Hand
{
  const { canvas, ctx } = createSticker();
  ctx.save();
  ctx.translate(150, 150);

  ctx.fillStyle = '#ffdfba';
  ctx.strokeStyle = '#c8956a';
  ctx.lineWidth = 7;

  // Palm
  ctx.beginPath();
  ctx.roundRect(-55, -10, 110, 110, 35);
  ctx.fill();
  ctx.stroke();

  // Index finger
  ctx.beginPath();
  ctx.roundRect(-45, -115, 36, 115, 18);
  ctx.fill();
  ctx.stroke();

  // Middle finger
  ctx.beginPath();
  ctx.roundRect(10, -115, 36, 115, 18);
  ctx.fill();
  ctx.stroke();

  // Folded thumb & pinky lines
  ctx.beginPath();
  ctx.arc(0, 40, 24, 0, Math.PI);
  ctx.stroke();

  // Sparkles
  ctx.fillStyle = '#f72585';
  ctx.font = 'bold 30px sans-serif';
  ctx.fillText('✌️', 65, -60);

  ctx.restore();
  save(canvas, 'peace-sign.png');
}

// 23. Rainbow Cloud
{
  const { canvas, ctx } = createSticker();
  ctx.save();
  ctx.translate(150, 150);

  // Rainbow arcs
  const colors = ['#ff595e', '#ffca3a', '#8ac926', '#1982c4', '#6a4c93'];
  colors.forEach((col, idx) => {
    ctx.strokeStyle = col;
    ctx.lineWidth = 14;
    ctx.beginPath();
    ctx.arc(0, 30, 95 - idx * 14, Math.PI, 0);
    ctx.stroke();
  });

  // Clouds on left & right
  const drawCloud = (cx, cy) => {
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#d6e4ff';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(cx, cy, 28, 0, Math.PI * 2);
    ctx.arc(cx - 24, cy + 10, 22, 0, Math.PI * 2);
    ctx.arc(cx + 24, cy + 10, 22, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Cute smiling face
    ctx.strokeStyle = '#4361ee';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(cx - 10, cy + 5, 4, 0, Math.PI);
    ctx.arc(cx + 10, cy + 5, 4, 0, Math.PI);
    ctx.stroke();
  };

  drawCloud(-75, 40);
  drawCloud(75, 40);

  ctx.restore();
  save(canvas, 'rainbow-cloud.png');
}

// 24. Hologram Cyber Star
{
  const { canvas, ctx } = createSticker();
  ctx.save();
  ctx.translate(150, 150);

  const starGrad = ctx.createLinearGradient(-100, -100, 100, 100);
  starGrad.addColorStop(0, '#00f0ff');
  starGrad.addColorStop(0.5, '#ff007f');
  starGrad.addColorStop(1, '#ffe600');

  ctx.fillStyle = starGrad;
  ctx.strokeStyle = '#180e29';
  ctx.lineWidth = 7;
  ctx.beginPath();
  // 4 pointed star
  ctx.moveTo(0, -130);
  ctx.quadraticCurveTo(0, 0, 130, 0);
  ctx.quadraticCurveTo(0, 0, 0, 130);
  ctx.quadraticCurveTo(0, 0, -130, 0);
  ctx.quadraticCurveTo(0, 0, 0, -130);
  ctx.fill();
  ctx.stroke();

  // White center diamond
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.moveTo(0, -45);
  ctx.lineTo(45, 0);
  ctx.lineTo(0, 45);
  ctx.lineTo(-45, 0);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
  save(canvas, 'y2k-cyber-star.png');
}

// 25. Yellow Ducky
{
  const { canvas, ctx } = createSticker();
  ctx.save();
  ctx.translate(150, 150);

  // Body
  ctx.fillStyle = '#ffd166';
  ctx.strokeStyle = '#f77f00';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.ellipse(-10, 30, 85, 60, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Tail
  ctx.beginPath();
  ctx.moveTo(-90, 20);
  ctx.lineTo(-120, -10);
  ctx.lineTo(-70, 40);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Head
  ctx.beginPath();
  ctx.arc(35, -25, 52, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Beak
  ctx.fillStyle = '#f77f00';
  ctx.beginPath();
  ctx.ellipse(85, -20, 24, 14, 0.1, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Eye
  ctx.fillStyle = '#222';
  ctx.beginPath();
  ctx.arc(45, -35, 10, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(42, -38, 4, 0, Math.PI * 2);
  ctx.fill();

  // Crown on duck
  ctx.fillStyle = '#ffb703';
  ctx.beginPath();
  ctx.moveTo(20, -75);
  ctx.lineTo(25, -100);
  ctx.lineTo(38, -85);
  ctx.lineTo(50, -105);
  ctx.lineTo(58, -85);
  ctx.lineTo(65, -95);
  ctx.lineTo(65, -75);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.restore();
  save(canvas, 'yellow-ducky.png');
}

console.log('All 25 new stickers generated successfully!');
