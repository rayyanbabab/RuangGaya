/**
 * RuangGaya — Face Filter Drawing Library
 * All filters are drawn with Canvas 2D API (no external PNG dependencies).
 * Landmarks are MediaPipe FaceLandmarker normalized coords (0–1).
 */

import type { FaceFilterId } from './config';

export interface NLM { x: number; y: number; z?: number }

// ─── Helpers ──────────────────────────────────────────────────────────

/** Convert normalized landmark to pixel coords */
function px(lms: NLM[], idx: number, w: number, h: number) {
  const l = lms[idx];
  return { x: l.x * w, y: l.y * h };
}

/** Midpoint of two landmarks */
function mid(a: { x: number; y: number }, b: { x: number; y: number }) {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
}

/** Distance between two points */
function dist(a: { x: number; y: number }, b: { x: number; y: number }) {
  return Math.hypot(b.x - a.x, b.y - a.y);
}

/** Calculate head roll / tilt angle (radians) using eye landmarks */
function getHeadAngle(lms: NLM[], w: number, h: number): number {
  const lEye = px(lms, 33, w, h);
  const rEye = px(lms, 263, w, h);
  return Math.atan2(rEye.y - lEye.y, rEye.x - lEye.x);
}

/** Draw a filled star shape */
function drawStar(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  outerR: number,
  innerR: number,
  points: number,
  rotation = 0
) {
  ctx.beginPath();
  for (let i = 0; i < points * 2; i++) {
    const angle = (i * Math.PI) / points + rotation;
    const r = i % 2 === 0 ? outerR : innerR;
    const x = cx + Math.cos(angle) * r;
    const y = cy + Math.sin(angle) * r;
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fill();
}

/** Draw a heart shape */
function drawHeart(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  size: number,
  color: string
) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(0, size * 0.3);
  ctx.bezierCurveTo(-size * 0.6, -size * 0.5, -size, size * 0.2, 0, size);
  ctx.bezierCurveTo(size, size * 0.2, size * 0.6, -size * 0.5, 0, size * 0.3);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

/** Draw a single flower */
function drawFlower(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number,
  petalColor: string,
  centerColor: string
) {
  ctx.save();
  for (let i = 0; i < 6; i++) {
    const angle = (i * Math.PI * 2) / 6;
    ctx.beginPath();
    ctx.arc(
      cx + Math.cos(angle) * r * 0.7,
      cy + Math.sin(angle) * r * 0.7,
      r * 0.55,
      0,
      Math.PI * 2
    );
    ctx.fillStyle = petalColor;
    ctx.fill();
  }
  ctx.beginPath();
  ctx.arc(cx, cy, r * 0.4, 0, Math.PI * 2);
  ctx.fillStyle = centerColor;
  ctx.fill();
  ctx.restore();
}

// ─── Main Dispatcher ──────────────────────────────────────────────────

export function drawFaceFilter(
  ctx: CanvasRenderingContext2D,
  landmarks: NLM[],
  w: number,
  h: number,
  filterId: FaceFilterId,
  video?: HTMLVideoElement
) {
  if (!landmarks || landmarks.length < 468) return;

  // Align landmarks with video element rendered via object-fit: cover
  let lms = landmarks;
  if (video && video.videoWidth > 0 && video.videoHeight > 0) {
    const vw = video.videoWidth;
    const vh = video.videoHeight;
    const videoRatio = vw / vh;
    const canvasRatio = w / h;

    let renderedW = w;
    let renderedH = h;
    let offsetX = 0;
    let offsetY = 0;

    if (videoRatio > canvasRatio) {
      const s = h / vh;
      renderedW = vw * s;
      offsetX = (w - renderedW) / 2;
    } else {
      const s = w / vw;
      renderedH = vh * s;
      offsetY = (h - renderedH) / 2;
    }

    lms = landmarks.map((l) => ({
      x: (offsetX + l.x * renderedW) / w,
      y: (offsetY + l.y * renderedH) / h,
      z: l.z,
    }));
  }

  ctx.save();
  switch (filterId) {
    case 'cat':           drawCat(ctx, lms, w, h);          break;
    case 'dog':           drawDog(ctx, lms, w, h);          break;
    case 'glasses':       drawGlasses(ctx, lms, w, h);      break;
    case 'crown':         drawCrown(ctx, lms, w, h);        break;
    case 'flower-crown':  drawFlowerCrown(ctx, lms, w, h);  break;
    case 'butterfly':     drawButterfly(ctx, lms, w, h);    break;
    case 'clown':         drawClown(ctx, lms, w, h);        break;
    case 'sparkle':       drawSparkle(ctx, lms, w, h);      break;
    case 'beauty':        if (video) drawBeauty(ctx, lms, w, h, video); break;
    case 'devil':         drawDevil(ctx, lms, w, h);        break;
    case 'angel':         drawAngel(ctx, lms, w, h);        break;
    case 'bunny':         drawBunny(ctx, lms, w, h);        break;
    case 'pixel-glasses': drawPixelGlasses(ctx, lms, w, h); break;
    case 'heart-blush':   drawHeartBlush(ctx, lms, w, h);   break;
    case 'cyber-visor':   drawCyberVisor(ctx, lms, w, h);   break;
    case 'mustache':      drawMustache(ctx, lms, w, h);     break;
    case 'star-eyes':     drawStarEyes(ctx, lms, w, h);     break;
    case 'flower-blush':  drawFlowerBlush(ctx, lms, w, h);  break;
  }
  ctx.restore();
}

// ─── 🐱 1. Cat Filter ─────────────────────────────────────────────────

function drawCat(ctx: CanvasRenderingContext2D, lms: NLM[], w: number, h: number) {
  const top    = px(lms, 10, w, h);
  const left   = px(lms, 234, w, h);
  const right  = px(lms, 454, w, h);
  const nose   = px(lms, 4, w, h);
  const faceW  = dist(left, right);
  const angle  = getHeadAngle(lms, w, h);

  const earW   = faceW * 0.24;
  const earH   = earW * 1.4;

  // Draw tilted ears anchored at forehead top
  ctx.save();
  ctx.translate(top.x, top.y);
  ctx.rotate(angle);

  // Left ear
  drawCatEar(ctx, -faceW * 0.28, -earH * 0.35, earW, earH);
  // Right ear
  drawCatEar(ctx, faceW * 0.28, -earH * 0.35, earW, earH);
  ctx.restore();

  // Nose and whiskers anchored at nose with tilt
  ctx.save();
  ctx.translate(nose.x, nose.y);
  ctx.rotate(angle);

  // Pink nose
  ctx.beginPath();
  ctx.ellipse(0, 0, faceW * 0.045, faceW * 0.032, 0, 0, Math.PI * 2);
  ctx.fillStyle = '#FF85A1';
  ctx.fill();

  // Whiskers left
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.lineWidth = Math.max(2, faceW * 0.012);
  ctx.lineCap = 'round';
  [
    [-faceW * 0.06, -faceW * 0.02, -faceW * 0.45, -faceW * 0.08],
    [-faceW * 0.06, 0,             -faceW * 0.48, 0],
    [-faceW * 0.06, faceW * 0.02,  -faceW * 0.45, faceW * 0.08],
  ].forEach(([x1, y1, x2, y2]) => {
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
  });

  // Whiskers right
  [
    [faceW * 0.06, -faceW * 0.02, faceW * 0.45, -faceW * 0.08],
    [faceW * 0.06, 0,            faceW * 0.48, 0],
    [faceW * 0.06, faceW * 0.02, faceW * 0.45, faceW * 0.08],
  ].forEach(([x1, y1, x2, y2]) => {
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
  });

  ctx.restore();
}

function drawCatEar(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  ew: number,
  eh: number
) {
  // Outer ear
  ctx.beginPath();
  ctx.moveTo(cx - ew / 2, cy + eh * 0.5);
  ctx.lineTo(cx, cy - eh * 0.5);
  ctx.lineTo(cx + ew / 2, cy + eh * 0.5);
  ctx.closePath();
  ctx.fillStyle = '#FFAFCC';
  ctx.fill();
  ctx.strokeStyle = '#FB6F92';
  ctx.lineWidth = Math.max(2.5, ew * 0.09);
  ctx.stroke();

  // Inner ear
  ctx.beginPath();
  ctx.moveTo(cx - ew * 0.28, cy + eh * 0.38);
  ctx.lineTo(cx, cy - eh * 0.28);
  ctx.lineTo(cx + ew * 0.28, cy + eh * 0.38);
  ctx.closePath();
  ctx.fillStyle = '#FF477E';
  ctx.fill();
}

// ─── 🐶 2. Dog Filter ─────────────────────────────────────────────────

function drawDog(ctx: CanvasRenderingContext2D, lms: NLM[], w: number, h: number) {
  const top    = px(lms, 10, w, h);
  const left   = px(lms, 234, w, h);
  const right  = px(lms, 454, w, h);
  const nose   = px(lms, 4, w, h);
  const mouth  = px(lms, 14, w, h);
  const faceW  = dist(left, right);
  const angle  = getHeadAngle(lms, w, h);

  const earW   = faceW * 0.32;
  const earH   = faceW * 0.75;

  // Floppy ears anchored with head angle
  ctx.save();
  ctx.translate(top.x, top.y);
  ctx.rotate(angle);

  // Left floppy ear
  drawDogEar(ctx, -faceW * 0.55, earH * 0.05, earW, earH);
  // Right floppy ear
  drawDogEar(ctx, faceW * 0.23, earH * 0.05, earW, earH);
  ctx.restore();

  // Dog nose
  ctx.save();
  ctx.translate(nose.x, nose.y);
  ctx.rotate(angle);
  ctx.beginPath();
  ctx.ellipse(0, 0, faceW * 0.075, faceW * 0.055, 0, 0, Math.PI * 2);
  ctx.fillStyle = '#1e1e24';
  ctx.fill();
  // Nose shine
  ctx.beginPath();
  ctx.arc(-faceW * 0.02, -faceW * 0.015, faceW * 0.016, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  ctx.fill();
  ctx.restore();

  // Cute dog tongue sticking out
  ctx.save();
  ctx.translate(mouth.x, mouth.y);
  ctx.rotate(angle);
  const tongueW = faceW * 0.16;
  const tongueH = faceW * 0.24;
  ctx.beginPath();
  ctx.roundRect(-tongueW / 2, faceW * 0.02, tongueW, tongueH, tongueW / 2);
  ctx.fillStyle = '#FF5D8F';
  ctx.fill();
  ctx.strokeStyle = '#D90429';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Tongue crease
  ctx.beginPath();
  ctx.moveTo(0, faceW * 0.04);
  ctx.lineTo(0, faceW * 0.02 + tongueH * 0.7);
  ctx.strokeStyle = '#C9184A';
  ctx.lineWidth = Math.max(1.5, faceW * 0.012);
  ctx.stroke();
  ctx.restore();
}

function drawDogEar(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  ew: number,
  eh: number
) {
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + ew, y);
  ctx.bezierCurveTo(x + ew * 1.3, y + eh * 0.5, x + ew * 0.7, y + eh, x + ew * 0.5, y + eh);
  ctx.bezierCurveTo(x + ew * 0.3, y + eh, x - ew * 0.2, y + eh * 0.5, x, y);
  ctx.fillStyle = '#C8956A';
  ctx.fill();
  ctx.strokeStyle = '#99582A';
  ctx.lineWidth = Math.max(2, ew * 0.07);
  ctx.stroke();

  // Inner ear
  ctx.beginPath();
  ctx.moveTo(x + ew * 0.2, y + eh * 0.15);
  ctx.lineTo(x + ew * 0.8, y + eh * 0.15);
  ctx.bezierCurveTo(x + ew * 0.95, y + eh * 0.55, x + ew * 0.65, y + eh * 0.85, x + ew * 0.5, y + eh * 0.85);
  ctx.bezierCurveTo(x + ew * 0.35, y + eh * 0.85, x + ew * 0.05, y + eh * 0.55, x + ew * 0.2, y + eh * 0.15);
  ctx.fillStyle = '#E8C0A0';
  ctx.fill();
}

// ─── 👓 3. Glasses Filter ─────────────────────────────────────────────

function drawGlasses(ctx: CanvasRenderingContext2D, lms: NLM[], w: number, h: number) {
  const lEye = px(lms, 33, w, h);
  const rEye = px(lms, 263, w, h);
  const midEye = mid(lEye, rEye);
  const eyeDist = dist(lEye, rEye);
  const angle = getHeadAngle(lms, w, h);

  const lensR = eyeDist * 0.42;
  const thickness = Math.max(3.5, lensR * 0.12);

  ctx.save();
  ctx.translate(midEye.x, midEye.y);
  ctx.rotate(angle);

  ctx.strokeStyle = '#181824';
  ctx.lineWidth = thickness;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  // Left lens
  ctx.beginPath();
  ctx.arc(-eyeDist / 2, 0, lensR, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(120, 210, 255, 0.22)';
  ctx.fill();
  ctx.stroke();

  // Left lens shine
  ctx.strokeStyle = 'rgba(255,255,255,0.6)';
  ctx.lineWidth = thickness * 0.6;
  ctx.beginPath();
  ctx.arc(-eyeDist / 2, 0, lensR * 0.72, -Math.PI * 0.8, -Math.PI * 0.3);
  ctx.stroke();

  // Right lens
  ctx.strokeStyle = '#181824';
  ctx.lineWidth = thickness;
  ctx.beginPath();
  ctx.arc(eyeDist / 2, 0, lensR, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(120, 210, 255, 0.22)';
  ctx.fill();
  ctx.stroke();

  // Right lens shine
  ctx.strokeStyle = 'rgba(255,255,255,0.6)';
  ctx.lineWidth = thickness * 0.6;
  ctx.beginPath();
  ctx.arc(eyeDist / 2, 0, lensR * 0.72, -Math.PI * 0.8, -Math.PI * 0.3);
  ctx.stroke();

  // Bridge
  ctx.strokeStyle = '#181824';
  ctx.lineWidth = thickness;
  ctx.beginPath();
  ctx.arc(0, -lensR * 0.2, eyeDist * 0.22, 0.2, Math.PI - 0.2, true);
  ctx.stroke();

  // Left temple arm
  ctx.beginPath();
  ctx.moveTo(-eyeDist / 2 - lensR, 0);
  ctx.lineTo(-eyeDist * 0.95, -lensR * 0.2);
  ctx.stroke();

  // Right temple arm
  ctx.beginPath();
  ctx.moveTo(eyeDist / 2 + lensR, 0);
  ctx.lineTo(eyeDist * 0.95, -lensR * 0.2);
  ctx.stroke();

  ctx.restore();
}

// ─── 👑 4. Crown Filter ───────────────────────────────────────────────

function drawCrown(ctx: CanvasRenderingContext2D, lms: NLM[], w: number, h: number) {
  const top   = px(lms, 10, w, h);
  const left  = px(lms, 234, w, h);
  const right = px(lms, 454, w, h);
  const faceW = dist(left, right);
  const angle = getHeadAngle(lms, w, h);

  const cw = faceW * 1.05;
  const ch = faceW * 0.48;

  ctx.save();
  ctx.translate(top.x, top.y);
  ctx.rotate(angle);

  const grad = ctx.createLinearGradient(0, -ch, 0, 0);
  grad.addColorStop(0, '#FFF3B0');
  grad.addColorStop(0.4, '#FFD166');
  grad.addColorStop(1, '#B8860B');

  ctx.fillStyle = grad;
  ctx.strokeStyle = '#9E2A2B';
  ctx.lineWidth = Math.max(2.5, faceW * 0.012);
  ctx.lineJoin = 'round';

  // 5 point crown
  ctx.beginPath();
  const baseY = -ch * 0.15;
  const baseL = -cw / 2;
  const baseR = cw / 2;
  const pts = 5;
  const pointHeights = [0.85, 0.55, 1.0, 0.55, 0.85];

  ctx.moveTo(baseL, baseY);
  for (let i = 0; i < pts; i++) {
    const x = baseL + (i / (pts - 1)) * cw;
    ctx.lineTo(x, baseY - ch * pointHeights[i]);
    if (i < pts - 1) {
      const nx = baseL + ((i + 1) / (pts - 1)) * cw;
      ctx.lineTo((x + nx) / 2, baseY - ch * 0.22);
    }
  }
  ctx.lineTo(baseR, baseY);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Bottom gold band
  ctx.fillStyle = '#9E2A2B';
  ctx.beginPath();
  ctx.roundRect(baseL, baseY, cw, ch * 0.18, 6);
  ctx.fill();

  // Gemstones on peaks & band
  const gemPositions: Array<[number, number, string]> = [
    [0, baseY - ch * 1.0, '#FF0054'],
    [-cw * 0.25, baseY - ch * 0.55, '#06D6A0'],
    [cw * 0.25, baseY - ch * 0.55, '#06D6A0'],
    [-cw * 0.5, baseY - ch * 0.85, '#118AB2'],
    [cw * 0.5, baseY - ch * 0.85, '#118AB2'],
    [0, baseY + ch * 0.09, '#FFD166'],
    [-cw * 0.3, baseY + ch * 0.09, '#FF0054'],
    [cw * 0.3, baseY + ch * 0.09, '#FF0054'],
  ];

  gemPositions.forEach(([gx, gy, col]) => {
    ctx.beginPath();
    ctx.arc(gx, gy, faceW * 0.035, 0, Math.PI * 2);
    ctx.fillStyle = col;
    ctx.fill();
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  });

  ctx.restore();
}

// ─── 🌸 5. Flower Crown Filter ────────────────────────────────────────

function drawFlowerCrown(ctx: CanvasRenderingContext2D, lms: NLM[], w: number, h: number) {
  const top   = px(lms, 10, w, h);
  const left  = px(lms, 234, w, h);
  const right = px(lms, 454, w, h);
  const faceW = dist(left, right);
  const angle = getHeadAngle(lms, w, h);
  const r     = faceW * 0.075;

  ctx.save();
  ctx.translate(top.x, top.y);
  ctx.rotate(angle);

  // Green leafy vine curve
  ctx.strokeStyle = '#38B000';
  ctx.lineWidth   = Math.max(3, faceW * 0.015);
  ctx.beginPath();
  ctx.moveTo(-faceW * 0.5, 0);
  ctx.quadraticCurveTo(0, -faceW * 0.15, faceW * 0.5, 0);
  ctx.stroke();

  const colors: Array<[string, string]> = [
    ['#FF85A1', '#FFEA00'],
    ['#FFFFFF', '#FFB703'],
    ['#F72585', '#FFEA00'],
    ['#FFB3C6', '#FF5D8F'],
    ['#7209B7', '#FFEA00'],
    ['#FFFFFF', '#FFB703'],
    ['#FF85A1', '#FFEA00'],
  ];

  const count = 7;
  for (let i = 0; i < count; i++) {
    const t = i / (count - 1);
    const fx = -faceW * 0.48 + t * faceW * 0.96;
    const fy = -Math.sin(t * Math.PI) * faceW * 0.12;
    const [petC, cenC] = colors[i % colors.length];
    drawFlower(ctx, fx, fy, r, petC, cenC);
  }

  ctx.restore();
}

// ─── 🦋 6. Butterfly Filter ───────────────────────────────────────────

function drawButterfly(ctx: CanvasRenderingContext2D, lms: NLM[], w: number, h: number) {
  const nose  = px(lms, 1, w, h);
  const left  = px(lms, 234, w, h);
  const right = px(lms, 454, w, h);
  const faceW = dist(left, right);
  const angle = getHeadAngle(lms, w, h);

  const ww = faceW * 0.58;
  const wh = faceW * 0.42;

  ctx.save();
  ctx.translate(nose.x, nose.y);
  ctx.rotate(angle);

  // Left wings
  const leftGrad = ctx.createRadialGradient(-ww * 0.5, 0, 0, -ww * 0.5, 0, ww * 0.9);
  leftGrad.addColorStop(0, 'rgba(247, 37, 133, 0.85)');
  leftGrad.addColorStop(0.6, 'rgba(114, 9, 183, 0.75)');
  leftGrad.addColorStop(1, 'rgba(58, 12, 163, 0.55)');

  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(-ww * 0.15, -wh, -ww, -wh * 1.1, -ww, -wh * 0.2);
  ctx.bezierCurveTo(-ww, wh * 0.1, -ww * 0.4, wh * 0.3, 0, 0);
  ctx.fillStyle = leftGrad;
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(-ww * 0.4, wh * 0.25, -ww * 0.75, wh * 0.6, -ww * 0.45, wh * 0.8);
  ctx.bezierCurveTo(-ww * 0.15, wh * 0.9, -ww * 0.1, wh * 0.6, 0, 0);
  ctx.fillStyle = 'rgba(160, 80, 210, 0.7)';
  ctx.fill();

  // Right wings
  const rightGrad = ctx.createRadialGradient(ww * 0.5, 0, 0, ww * 0.5, 0, ww * 0.9);
  rightGrad.addColorStop(0, 'rgba(247, 37, 133, 0.85)');
  rightGrad.addColorStop(0.6, 'rgba(114, 9, 183, 0.75)');
  rightGrad.addColorStop(1, 'rgba(58, 12, 163, 0.55)');

  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(ww * 0.15, -wh, ww, -wh * 1.1, ww, -wh * 0.2);
  ctx.bezierCurveTo(ww, wh * 0.1, ww * 0.4, wh * 0.3, 0, 0);
  ctx.fillStyle = rightGrad;
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(ww * 0.4, wh * 0.25, ww * 0.75, wh * 0.6, ww * 0.45, wh * 0.8);
  ctx.bezierCurveTo(ww * 0.15, wh * 0.9, ww * 0.1, wh * 0.6, 0, 0);
  ctx.fillStyle = 'rgba(160, 80, 210, 0.7)';
  ctx.fill();

  // Antennae
  ctx.strokeStyle = '#3A0CA3';
  ctx.lineWidth   = Math.max(2, faceW * 0.01);
  ctx.beginPath();
  ctx.moveTo(-faceW * 0.02, -wh * 0.1);
  ctx.quadraticCurveTo(-faceW * 0.15, -wh * 0.8, -faceW * 0.2, -wh * 0.95);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(faceW * 0.02, -wh * 0.1);
  ctx.quadraticCurveTo(faceW * 0.15, -wh * 0.8, faceW * 0.2, -wh * 0.95);
  ctx.stroke();

  // Antenna tips
  ctx.fillStyle = '#FFD166';
  ctx.beginPath();
  ctx.arc(-faceW * 0.2, -wh * 0.95, faceW * 0.02, 0, Math.PI * 2);
  ctx.arc(faceW * 0.2, -wh * 0.95, faceW * 0.02, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

// ─── 🤡 7. Clown Filter ───────────────────────────────────────────────

function drawClown(ctx: CanvasRenderingContext2D, lms: NLM[], w: number, h: number) {
  const nose   = px(lms, 4, w, h);
  const left   = px(lms, 234, w, h);
  const right  = px(lms, 454, w, h);
  const mouth  = px(lms, 14, w, h);
  const faceW  = dist(left, right);
  const r      = faceW * 0.11;

  // Red spherical clown nose
  const nGrad = ctx.createRadialGradient(
    nose.x - r * 0.3, nose.y - r * 0.3, r * 0.05,
    nose.x, nose.y, r
  );
  nGrad.addColorStop(0, '#FF85A1');
  nGrad.addColorStop(0.5, '#D90429');
  nGrad.addColorStop(1, '#7F0909');

  ctx.beginPath();
  ctx.arc(nose.x, nose.y, r, 0, Math.PI * 2);
  ctx.fillStyle = nGrad;
  ctx.fill();

  // Shine spot
  ctx.beginPath();
  ctx.arc(nose.x - r * 0.3, nose.y - r * 0.3, r * 0.25, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255,255,255,0.75)';
  ctx.fill();

  // Cute cheek triangles
  const lCheek = px(lms, 117, w, h);
  const rCheek = px(lms, 346, w, h);
  ctx.fillStyle = 'rgba(255, 77, 109, 0.6)';
  ctx.beginPath();
  ctx.arc(lCheek.x, lCheek.y, faceW * 0.07, 0, Math.PI * 2);
  ctx.arc(rCheek.x, rCheek.y, faceW * 0.07, 0, Math.PI * 2);
  ctx.fill();

  // Clown smile arcs
  ctx.strokeStyle = '#D90429';
  ctx.lineWidth = Math.max(3, faceW * 0.015);
  ctx.beginPath();
  ctx.arc(mouth.x, mouth.y - faceW * 0.02, faceW * 0.22, 0.2, Math.PI - 0.2);
  ctx.stroke();
}

// ─── ✨ 8. Sparkle Filter ─────────────────────────────────────────────

function drawSparkle(ctx: CanvasRenderingContext2D, lms: NLM[], w: number, h: number) {
  const left  = px(lms, 234, w, h);
  const right = px(lms, 454, w, h);
  const top   = px(lms, 10, w, h);
  const chin  = px(lms, 152, w, h);
  const faceW = dist(left, right);
  const faceH = dist(top, chin);
  const cx    = (left.x + right.x) / 2;
  const cy    = (top.y + chin.y) / 2;
  const t     = Date.now() / 1000;

  const sparkleData: Array<[number, number, number, string, number]> = [
    [-0.55, -0.55, 0.04, '#FFD700', 0.0],
    [ 0.52, -0.48, 0.035, '#FF69B4', 1.2],
    [-0.48,  0.40, 0.028, '#00F0FF', 2.4],
    [ 0.50,  0.45, 0.035, '#FFD700', 0.7],
    [-0.10, -0.75, 0.042, '#FF69B4', 1.8],
    [ 0.10, -0.72, 0.030, '#FFD700', 3.1],
    [-0.72,  0.05, 0.025, '#00F0FF', 0.3],
    [ 0.70,  0.02, 0.032, '#FF69B4', 2.0],
    [-0.30,  0.70, 0.028, '#FFD700', 1.5],
    [ 0.32,  0.68, 0.026, '#00F0FF', 0.9],
  ];

  sparkleData.forEach(([rx, ry, rs, color, phase]) => {
    const pulse = 0.7 + 0.3 * Math.sin(t * 3.5 + phase);
    const sx    = cx + rx * faceW;
    const sy    = cy + ry * faceH;
    const sr    = rs * faceW * pulse;
    const rot   = t * 1.5 + phase;

    ctx.fillStyle = color;
    ctx.globalAlpha = 0.8 + 0.2 * Math.sin(t * 4 + phase);
    drawStar(ctx, sx, sy, sr, sr * 0.35, 4, rot);

    // Glowing aura
    ctx.globalAlpha = 0.25 * pulse;
    drawStar(ctx, sx, sy, sr * 1.9, sr * 0.55, 4, rot + Math.PI / 4);
    ctx.globalAlpha = 1;
  });
}

// ─── 💄 9. Beauty Filter ─────────────────────────────────────────────

let offscreenCanvas: HTMLCanvasElement | null = null;

function drawBeauty(
  ctx: CanvasRenderingContext2D,
  lms: NLM[],
  w: number,
  h: number,
  video: HTMLVideoElement
) {
  const left  = px(lms, 234, w, h);
  const right = px(lms, 454, w, h);
  const top   = px(lms, 10, w, h);
  const chin  = px(lms, 152, w, h);
  const faceW = dist(left, right);

  const padding = faceW * 0.14;
  const fx      = Math.max(0, left.x - padding);
  const fy      = Math.max(0, top.y - padding);
  const fw      = Math.min(w - fx, faceW + padding * 2);
  const fh      = Math.min(h - fy, dist(top, chin) + padding * 2);

  if (fw <= 0 || fh <= 0) return;

  if (!offscreenCanvas) offscreenCanvas = document.createElement('canvas');
  const targetW = Math.ceil(fw);
  const targetH = Math.ceil(fh);
  if (offscreenCanvas.width !== targetW || offscreenCanvas.height !== targetH) {
    offscreenCanvas.width  = targetW;
    offscreenCanvas.height = targetH;
  }
  const offCtx = offscreenCanvas.getContext('2d');
  if (!offCtx) return;

  const vw = video.videoWidth || w;
  const vh = video.videoHeight || h;
  const videoRatio = vw / vh;
  const canvasRatio = w / h;

  let sx = 0, sy = 0, sw = vw, sh = vh;
  if (videoRatio > canvasRatio) {
    sw = vh * canvasRatio;
    sx = (vw - sw) / 2;
  } else {
    sh = vw / canvasRatio;
    sy = (vh - sh) / 2;
  }

  const srcX = sx + (fx / w) * sw;
  const srcY = sy + (fy / h) * sh;
  const srcW = (fw / w) * sw;
  const srcH = (fh / h) * sh;

  offCtx.clearRect(0, 0, fw, fh);
  offCtx.filter = 'blur(2.8px) brightness(1.14) saturate(0.94)';
  offCtx.drawImage(video, srcX, srcY, srcW, srcH, 0, 0, fw, fh);
  offCtx.filter = 'none';

  // Smooth ellipse clip
  ctx.save();
  ctx.beginPath();
  ctx.ellipse(fx + fw / 2, fy + fh / 2, fw / 2, fh / 2, 0, 0, Math.PI * 2);
  ctx.clip();
  ctx.globalAlpha = 0.75;
  ctx.drawImage(offscreenCanvas, fx, fy, fw, fh);
  ctx.globalAlpha = 1;

  // Gentle peach glow
  const glow = ctx.createRadialGradient(
    fx + fw / 2, fy + fh / 2, fw * 0.1,
    fx + fw / 2, fy + fh / 2, Math.max(fw, fh) / 2
  );
  glow.addColorStop(0, 'rgba(255, 230, 220, 0.18)');
  glow.addColorStop(1, 'rgba(255, 230, 220, 0)');
  ctx.fillStyle = glow;
  ctx.fillRect(fx, fy, fw, fh);
  ctx.restore();
}

// ─── 😈 10. Devil Horns Filter ────────────────────────────────────────

function drawDevil(ctx: CanvasRenderingContext2D, lms: NLM[], w: number, h: number) {
  const top   = px(lms, 10, w, h);
  const left  = px(lms, 234, w, h);
  const right = px(lms, 454, w, h);
  const faceW = dist(left, right);
  const angle = getHeadAngle(lms, w, h);

  ctx.save();
  ctx.translate(top.x, top.y);
  ctx.rotate(angle);

  const hornW = faceW * 0.18;
  const hornH = faceW * 0.52;

  // Draw Horn Function
  const renderHorn = (dir: 1 | -1) => {
    ctx.save();
    ctx.scale(dir, 1);

    const grad = ctx.createLinearGradient(faceW * 0.22, 0, faceW * 0.45, -hornH);
    grad.addColorStop(0, '#7F0909');
    grad.addColorStop(0.5, '#D90429');
    grad.addColorStop(1, '#FF5400');

    ctx.fillStyle = grad;
    ctx.strokeStyle = '#4A0E17';
    ctx.lineWidth = Math.max(2.5, faceW * 0.012);
    ctx.beginPath();
    ctx.moveTo(faceW * 0.18, 0);
    ctx.bezierCurveTo(faceW * 0.22, -hornH * 0.5, faceW * 0.35, -hornH * 0.85, faceW * 0.48, -hornH);
    ctx.bezierCurveTo(faceW * 0.38, -hornH * 0.6, faceW * 0.3, -hornH * 0.2, faceW * 0.32, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Horn highlight shine
    ctx.strokeStyle = 'rgba(255, 200, 100, 0.8)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(faceW * 0.26, -hornH * 0.1);
    ctx.bezierCurveTo(faceW * 0.3, -hornH * 0.5, faceW * 0.4, -hornH * 0.8, faceW * 0.45, -hornH * 0.95);
    ctx.stroke();

    ctx.restore();
  };

  renderHorn(1);
  renderHorn(-1);

  ctx.restore();

  // Dark red blush on cheeks
  const lCheek = px(lms, 117, w, h);
  const rCheek = px(lms, 346, w, h);
  ctx.fillStyle = 'rgba(217, 4, 41, 0.45)';
  ctx.beginPath();
  ctx.arc(lCheek.x, lCheek.y, faceW * 0.08, 0, Math.PI * 2);
  ctx.arc(rCheek.x, rCheek.y, faceW * 0.08, 0, Math.PI * 2);
  ctx.fill();
}

// ─── 😇 11. Angel Halo Filter ─────────────────────────────────────────

function drawAngel(ctx: CanvasRenderingContext2D, lms: NLM[], w: number, h: number) {
  const top   = px(lms, 10, w, h);
  const left  = px(lms, 234, w, h);
  const right = px(lms, 454, w, h);
  const faceW = dist(left, right);
  const angle = getHeadAngle(lms, w, h);
  const t     = Date.now() / 1000;

  ctx.save();
  ctx.translate(top.x, top.y);
  ctx.rotate(angle);

  // Floating bob animation
  const bobY = -faceW * 0.42 + Math.sin(t * 3) * 6;
  const haloW = faceW * 0.46;
  const haloH = faceW * 0.15;

  // Outer golden glow
  ctx.strokeStyle = 'rgba(255, 215, 0, 0.4)';
  ctx.lineWidth = faceW * 0.08;
  ctx.beginPath();
  ctx.ellipse(0, bobY, haloW, haloH, 0, 0, Math.PI * 2);
  ctx.stroke();

  // Inner golden ring
  const haloGrad = ctx.createLinearGradient(-haloW, bobY, haloW, bobY);
  haloGrad.addColorStop(0, '#FFE066');
  haloGrad.addColorStop(0.5, '#FFF9DB');
  haloGrad.addColorStop(1, '#FAB005');

  ctx.strokeStyle = haloGrad;
  ctx.lineWidth = Math.max(5, faceW * 0.035);
  ctx.beginPath();
  ctx.ellipse(0, bobY, haloW, haloH, 0, 0, Math.PI * 2);
  ctx.stroke();

  // Halo glint stars
  ctx.fillStyle = '#FFFFFF';
  drawStar(ctx, -haloW * 0.8, bobY - 4, faceW * 0.04, faceW * 0.015, 4, t * 2);
  drawStar(ctx, haloW * 0.7, bobY - 2, faceW * 0.035, faceW * 0.012, 4, -t * 2);

  ctx.restore();

  // Golden shimmer on cheeks
  const lCheek = px(lms, 117, w, h);
  const rCheek = px(lms, 346, w, h);
  ctx.fillStyle = 'rgba(255, 230, 109, 0.4)';
  ctx.beginPath();
  ctx.arc(lCheek.x, lCheek.y, faceW * 0.07, 0, Math.PI * 2);
  ctx.arc(rCheek.x, rCheek.y, faceW * 0.07, 0, Math.PI * 2);
  ctx.fill();
}

// ─── 🐰 12. Bunny Ears Filter ─────────────────────────────────────────

function drawBunny(ctx: CanvasRenderingContext2D, lms: NLM[], w: number, h: number) {
  const top   = px(lms, 10, w, h);
  const left  = px(lms, 234, w, h);
  const right = px(lms, 454, w, h);
  const nose  = px(lms, 4, w, h);
  const mouth = px(lms, 13, w, h);
  const faceW = dist(left, right);
  const angle = getHeadAngle(lms, w, h);

  const earW = faceW * 0.28;
  const earH = faceW * 0.95;

  ctx.save();
  ctx.translate(top.x, top.y);
  ctx.rotate(angle);

  // Left ear (straight tall)
  drawSingleBunnyEar(ctx, -faceW * 0.28, -earH * 0.4, earW, earH, 0);
  // Right ear (slightly bent floppy tip)
  drawSingleBunnyEar(ctx, faceW * 0.28, -earH * 0.4, earW, earH, 0.15);

  ctx.restore();

  // Pink nose & teeth
  ctx.save();
  ctx.translate(nose.x, nose.y);
  ctx.rotate(angle);
  drawHeart(ctx, 0, -faceW * 0.01, faceW * 0.045, '#FF85A1');
  ctx.restore();

  // Cute front teeth
  ctx.save();
  ctx.translate(mouth.x, mouth.y);
  ctx.rotate(angle);
  ctx.fillStyle = '#FFFFFF';
  ctx.strokeStyle = '#D8D8D8';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.roundRect(-faceW * 0.035, 0, faceW * 0.032, faceW * 0.042, [0, 0, 3, 3]);
  ctx.roundRect(faceW * 0.003, 0, faceW * 0.032, faceW * 0.042, [0, 0, 3, 3]);
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

function drawSingleBunnyEar(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  ew: number,
  eh: number,
  rot: number
) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(rot);

  // Outer white ear
  ctx.fillStyle = '#FFFFFF';
  ctx.strokeStyle = '#FFB3C6';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.ellipse(0, 0, ew * 0.5, eh * 0.5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Inner pink ear
  ctx.fillStyle = '#FF85A1';
  ctx.beginPath();
  ctx.ellipse(0, 0, ew * 0.28, eh * 0.38, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

// ─── 😎 13. Pixel Sunglasses (Thug Life) ──────────────────────────────

function drawPixelGlasses(ctx: CanvasRenderingContext2D, lms: NLM[], w: number, h: number) {
  const lEye = px(lms, 33, w, h);
  const rEye = px(lms, 263, w, h);
  const midEye = mid(lEye, rEye);
  const eyeDist = dist(lEye, rEye);
  const angle = getHeadAngle(lms, w, h);

  ctx.save();
  ctx.translate(midEye.x, midEye.y);
  ctx.rotate(angle);

  const pxSize = Math.max(4, Math.round(eyeDist * 0.07));
  const grid = [
    'XXXXXXXXXXXXXX.XXXXXXXXXXXXXX',
    'XXXXXXXXXXXXXX.XXXXXXXXXXXXXX',
    'XXXXWWXXXXXXXX.XXXXWWXXXXXXXX',
    'XXXXWWXXXXXXXX.XXXXWWXXXXXXXX',
    '.XXXXXXXXXXXX...XXXXXXXXXXXX.',
    '..XXXXXXXXXX.....XXXXXXXXXX..',
  ];

  const totalCols = grid[0].length;
  const startX = -(totalCols * pxSize) / 2;
  const startY = -(grid.length * pxSize) / 2;

  grid.forEach((row, r) => {
    for (let c = 0; c < row.length; c++) {
      const char = row[c];
      if (char === 'X') {
        ctx.fillStyle = '#111116';
        ctx.fillRect(startX + c * pxSize, startY + r * pxSize, pxSize, pxSize);
      } else if (char === 'W') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(startX + c * pxSize, startY + r * pxSize, pxSize, pxSize);
      }
    }
  });

  ctx.restore();
}

// ─── 💕 14. Heart Blush Filter ────────────────────────────────────────

function drawHeartBlush(ctx: CanvasRenderingContext2D, lms: NLM[], w: number, h: number) {
  const lCheek = px(lms, 117, w, h);
  const rCheek = px(lms, 346, w, h);
  const nose   = px(lms, 4, w, h);
  const left   = px(lms, 234, w, h);
  const right  = px(lms, 454, w, h);
  const faceW  = dist(left, right);
  const t      = Date.now() / 1000;

  // Soft cheeks heart blush
  drawHeart(ctx, lCheek.x, lCheek.y - faceW * 0.03, faceW * 0.12, 'rgba(255, 77, 109, 0.65)');
  drawHeart(ctx, rCheek.x, rCheek.y - faceW * 0.03, faceW * 0.12, 'rgba(255, 77, 109, 0.65)');

  // Little nose heart
  drawHeart(ctx, nose.x, nose.y, faceW * 0.045, '#FF4D6D');

  // Floating floating mini hearts
  const floatingHearts = [
    [lCheek.x - faceW * 0.15, lCheek.y - faceW * 0.25, 0.05, 0],
    [rCheek.x + faceW * 0.15, rCheek.y - faceW * 0.28, 0.045, 1.2],
    [lCheek.x - faceW * 0.05, lCheek.y - faceW * 0.45, 0.038, 2.4],
    [rCheek.x + faceW * 0.05, rCheek.y - faceW * 0.42, 0.042, 3.1],
  ];

  floatingHearts.forEach(([hx, hy, scale, phase]) => {
    const floatY = hy + Math.sin(t * 2 + phase) * 8;
    drawHeart(ctx, hx, floatY, faceW * scale, '#FF758F');
  });
}

// ─── 🤖 15. Cyber Visor Filter ────────────────────────────────────────

function drawCyberVisor(ctx: CanvasRenderingContext2D, lms: NLM[], w: number, h: number) {
  const lEye = px(lms, 33, w, h);
  const rEye = px(lms, 263, w, h);
  const midEye = mid(lEye, rEye);
  const eyeDist = dist(lEye, rEye);
  const angle = getHeadAngle(lms, w, h);
  const t = Date.now() / 1000;

  ctx.save();
  ctx.translate(midEye.x, midEye.y);
  ctx.rotate(angle);

  const vw = eyeDist * 1.9;
  const vh = eyeDist * 0.46;

  // Semi-transparent cyber visor body
  const visorGrad = ctx.createLinearGradient(-vw / 2, 0, vw / 2, 0);
  visorGrad.addColorStop(0, 'rgba(0, 240, 255, 0.65)');
  visorGrad.addColorStop(0.5, 'rgba(247, 37, 133, 0.65)');
  visorGrad.addColorStop(1, 'rgba(0, 240, 255, 0.65)');

  ctx.fillStyle = visorGrad;
  ctx.strokeStyle = '#00F0FF';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(-vw / 2, -vh / 2, vw, vh, [8, 8, 16, 16]);
  ctx.fill();
  ctx.stroke();

  // Tech scan lines
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.lineWidth = 1.5;
  const scanY = -vh / 2 + ((t * 60) % vh);
  ctx.beginPath();
  ctx.moveTo(-vw / 2 + 10, scanY);
  ctx.lineTo(vw / 2 - 10, scanY);
  ctx.stroke();

  // HUD brackets on sides
  ctx.strokeStyle = '#FFE600';
  ctx.lineWidth = 2.5;
  // Left bracket
  ctx.beginPath();
  ctx.moveTo(-vw / 2 + 18, -vh / 3);
  ctx.lineTo(-vw / 2 + 6, -vh / 3);
  ctx.lineTo(-vw / 2 + 6, vh / 3);
  ctx.lineTo(-vw / 2 + 18, vh / 3);
  ctx.stroke();

  // Right bracket
  ctx.beginPath();
  ctx.moveTo(vw / 2 - 18, -vh / 3);
  ctx.lineTo(vw / 2 - 6, -vh / 3);
  ctx.lineTo(vw / 2 - 6, vh / 3);
  ctx.lineTo(vw / 2 - 18, vh / 3);
  ctx.stroke();

  ctx.restore();
}

// ─── 🥸 16. Gentleman Mustache Filter ─────────────────────────────────

function drawMustache(ctx: CanvasRenderingContext2D, lms: NLM[], w: number, h: number) {
  const nose  = px(lms, 4, w, h);
  const left  = px(lms, 234, w, h);
  const right = px(lms, 454, w, h);
  const rEye  = px(lms, 263, w, h);
  const faceW = dist(left, right);
  const angle = getHeadAngle(lms, w, h);

  // Handlebar mustache anchored right below nose
  ctx.save();
  ctx.translate(nose.x, nose.y + faceW * 0.08);
  ctx.rotate(angle);

  const mw = faceW * 0.32;
  const mh = faceW * 0.12;

  ctx.fillStyle = '#212529';
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 2;

  // Left curly mustache
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(-mw * 0.4, -mh * 0.2, -mw * 0.8, mh * 0.4, -mw, -mh * 0.3);
  ctx.bezierCurveTo(-mw * 0.8, -mh * 0.6, -mw * 0.6, mh * 0.8, 0, mh * 0.6);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Right curly mustache
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(mw * 0.4, -mh * 0.2, mw * 0.8, mh * 0.4, mw, -mh * 0.3);
  ctx.bezierCurveTo(mw * 0.8, -mh * 0.6, mw * 0.6, mh * 0.8, 0, mh * 0.6);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.restore();

  // Golden monocle over right eye
  ctx.save();
  ctx.translate(rEye.x, rEye.y);
  ctx.rotate(angle);
  const monoR = faceW * 0.12;
  ctx.strokeStyle = '#FFD166';
  ctx.lineWidth = Math.max(3, faceW * 0.012);
  ctx.beginPath();
  ctx.arc(0, 0, monoR, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255, 230, 100, 0.15)';
  ctx.fill();
  ctx.stroke();

  // Monocle hanging chain
  ctx.strokeStyle = '#E09F3E';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(monoR, 0);
  ctx.quadraticCurveTo(monoR + faceW * 0.06, faceW * 0.2, monoR - faceW * 0.02, faceW * 0.35);
  ctx.stroke();
  ctx.restore();
}

// ─── 🤩 17. Star Eyes Filter ──────────────────────────────────────────

function drawStarEyes(ctx: CanvasRenderingContext2D, lms: NLM[], w: number, h: number) {
  const lEye = px(lms, 33, w, h);
  const rEye = px(lms, 263, w, h);
  const left = px(lms, 234, w, h);
  const right = px(lms, 454, w, h);
  const faceW = dist(left, right);
  const t = Date.now() / 1000;

  // Rotating golden sparkling stars directly over pupils
  const starR = faceW * 0.09;

  ctx.fillStyle = '#FFD166';
  drawStar(ctx, lEye.x, lEye.y, starR, starR * 0.35, 5, t * 2);
  drawStar(ctx, rEye.x, rEye.y, starR, starR * 0.35, 5, -t * 2);

  // Center white star glint
  ctx.fillStyle = '#FFFFFF';
  drawStar(ctx, lEye.x, lEye.y, starR * 0.4, starR * 0.15, 4, 0);
  drawStar(ctx, rEye.x, rEye.y, starR * 0.4, starR * 0.15, 4, 0);

  // Star freckles on cheeks
  const lCheek = px(lms, 117, w, h);
  const rCheek = px(lms, 346, w, h);
  const freckles = [
    [lCheek.x - 15, lCheek.y - 10, 6, '#FF758F'],
    [lCheek.x + 10, lCheek.y,      5, '#FFD166'],
    [lCheek.x - 5,  lCheek.y + 12, 4, '#00F0FF'],
    [rCheek.x + 15, rCheek.y - 10, 6, '#FF758F'],
    [rCheek.x - 10, rCheek.y,      5, '#FFD166'],
    [rCheek.x + 5,  rCheek.y + 12, 4, '#00F0FF'],
  ];

  freckles.forEach(([fx, fy, size, col]) => {
    ctx.fillStyle = col as string;
    drawStar(ctx, fx as number, fy as number, size as number, (size as number) * 0.35, 4, 0.4);
  });
}

// ─── 🌼 18. Daisy Flower Blush Filter ─────────────────────────────────

function drawFlowerBlush(ctx: CanvasRenderingContext2D, lms: NLM[], w: number, h: number) {
  const lCheek = px(lms, 117, w, h);
  const rCheek = px(lms, 346, w, h);
  const nose   = px(lms, 4, w, h);
  const left   = px(lms, 234, w, h);
  const right  = px(lms, 454, w, h);
  const faceW  = dist(left, right);

  // Soft peach blush on cheeks and bridge
  ctx.fillStyle = 'rgba(255, 138, 128, 0.45)';
  ctx.beginPath();
  ctx.arc(lCheek.x, lCheek.y, faceW * 0.09, 0, Math.PI * 2);
  ctx.arc(rCheek.x, rCheek.y, faceW * 0.09, 0, Math.PI * 2);
  ctx.arc(nose.x, nose.y, faceW * 0.06, 0, Math.PI * 2);
  ctx.fill();

  // Cute little daisies
  const flowerR = faceW * 0.045;
  drawFlower(ctx, lCheek.x, lCheek.y, flowerR, '#FFFFFF', '#FFD166');
  drawFlower(ctx, rCheek.x, rCheek.y, flowerR, '#FFFFFF', '#FFD166');
  drawFlower(ctx, nose.x, nose.y, flowerR * 0.8, '#FFFFFF', '#FFD166');

  // Mini accent daisies
  drawFlower(ctx, lCheek.x + faceW * 0.06, lCheek.y - faceW * 0.04, flowerR * 0.6, '#FFF0F5', '#FFB703');
  drawFlower(ctx, rCheek.x - faceW * 0.06, rCheek.y - faceW * 0.04, flowerR * 0.6, '#FFF0F5', '#FFB703');
}
