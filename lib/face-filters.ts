/**
 * RuangGaya — Face Filter Drawing Library
 * All filters are drawn with Canvas 2D API (no PNG dependencies).
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

// ─── Main dispatcher ──────────────────────────────────────────────────

export function drawFaceFilter(
  ctx: CanvasRenderingContext2D,
  landmarks: NLM[],
  w: number,
  h: number,
  filterId: FaceFilterId,
  video?: HTMLVideoElement
) {
  if (!landmarks || landmarks.length < 468) return;

  ctx.save();
  switch (filterId) {
    case 'cat':          drawCat(ctx, landmarks, w, h);         break;
    case 'dog':          drawDog(ctx, landmarks, w, h);         break;
    case 'glasses':      drawGlasses(ctx, landmarks, w, h);     break;
    case 'crown':        drawCrown(ctx, landmarks, w, h);       break;
    case 'flower-crown': drawFlowerCrown(ctx, landmarks, w, h); break;
    case 'butterfly':    drawButterfly(ctx, landmarks, w, h);   break;
    case 'clown':        drawClown(ctx, landmarks, w, h);       break;
    case 'sparkle':      drawSparkle(ctx, landmarks, w, h);     break;
    case 'beauty':       if (video) drawBeauty(ctx, landmarks, w, h, video); break;
  }
  ctx.restore();
}

// ─── 🐱 Cat Filter ───────────────────────────────────────────────────

function drawCat(ctx: CanvasRenderingContext2D, lms: NLM[], w: number, h: number) {
  const top    = px(lms, 10, w, h);   // forehead top
  const left   = px(lms, 234, w, h);  // left face edge
  const right  = px(lms, 454, w, h);  // right face edge
  const nose   = px(lms, 4, w, h);    // nose tip
  const faceW  = dist(left, right);
  const earW   = faceW * 0.22;
  const earH   = earW * 1.35;

  // Left ear
  const lEarX  = top.x - faceW * 0.26;
  const lEarY  = top.y - earH * 0.25;
  drawCatEar(ctx, lEarX, lEarY, earW, earH, false);

  // Right ear
  const rEarX  = top.x + faceW * 0.26;
  drawCatEar(ctx, rEarX, lEarY, earW, earH, true);

  // Pink nose
  ctx.beginPath();
  ctx.ellipse(nose.x, nose.y, faceW * 0.04, faceW * 0.028, 0, 0, Math.PI * 2);
  ctx.fillStyle = '#FF90C0';
  ctx.fill();

  // Whiskers left
  const wY = nose.y + faceW * 0.01;
  ctx.strokeStyle = 'rgba(255,255,255,0.85)';
  ctx.lineWidth = Math.max(1.5, faceW * 0.007);
  [[left.x + faceW * 0.05, wY - faceW * 0.03, nose.x - faceW * 0.07, wY],
   [left.x + faceW * 0.05, wY, nose.x - faceW * 0.07, wY],
   [left.x + faceW * 0.05, wY + faceW * 0.03, nose.x - faceW * 0.07, wY]].forEach(([x1, y1, x2, y2]) => {
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
  });
  // Whiskers right
  [[nose.x + faceW * 0.07, wY, right.x - faceW * 0.05, wY - faceW * 0.03],
   [nose.x + faceW * 0.07, wY, right.x - faceW * 0.05, wY],
   [nose.x + faceW * 0.07, wY, right.x - faceW * 0.05, wY + faceW * 0.03]].forEach(([x1, y1, x2, y2]) => {
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
  });
}

function drawCatEar(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  ew: number,
  eh: number,
  _flip: boolean
) {
  // Outer ear
  ctx.beginPath();
  ctx.moveTo(cx - ew / 2, cy + eh * 0.5);
  ctx.lineTo(cx, cy - eh * 0.5);
  ctx.lineTo(cx + ew / 2, cy + eh * 0.5);
  ctx.closePath();
  ctx.fillStyle = '#F5A0C0';
  ctx.fill();
  ctx.strokeStyle = '#E07090';
  ctx.lineWidth = Math.max(2, ew * 0.08);
  ctx.stroke();

  // Inner ear
  ctx.beginPath();
  ctx.moveTo(cx - ew * 0.28, cy + eh * 0.38);
  ctx.lineTo(cx, cy - eh * 0.28);
  ctx.lineTo(cx + ew * 0.28, cy + eh * 0.38);
  ctx.closePath();
  ctx.fillStyle = '#FF70A8';
  ctx.fill();
}

// ─── 🐶 Dog Filter ───────────────────────────────────────────────────

function drawDog(ctx: CanvasRenderingContext2D, lms: NLM[], w: number, h: number) {
  const top    = px(lms, 10, w, h);
  const left   = px(lms, 234, w, h);
  const right  = px(lms, 454, w, h);
  const chin   = px(lms, 152, w, h);
  const nose   = px(lms, 4, w, h);
  const mouth  = px(lms, 14, w, h);  // lower lip
  const faceW  = dist(left, right);
  const earH   = faceW * 0.7;
  const earW   = faceW * 0.3;

  // Left floppy ear
  drawDogEar(ctx, left.x - earW * 0.1, top.y + faceW * 0.05, earW, earH, false);
  // Right floppy ear
  drawDogEar(ctx, right.x - earW * 0.9, top.y + faceW * 0.05, earW, earH, true);

  // Black nose
  ctx.beginPath();
  ctx.ellipse(nose.x, nose.y, faceW * 0.07, faceW * 0.052, 0, 0, Math.PI * 2);
  ctx.fillStyle = '#222';
  ctx.fill();

  // Tongue
  const tongueX = (mouth.x + chin.x * 0.3) / 1.3;
  const tongueY = mouth.y + faceW * 0.02;
  const tongueW = faceW * 0.13;
  const tongueH = faceW * 0.2;
  ctx.beginPath();
  ctx.roundRect(tongueX - tongueW / 2, tongueY, tongueW, tongueH, tongueW / 2);
  ctx.fillStyle = '#FF6699';
  ctx.fill();
  // Center line on tongue
  ctx.beginPath();
  ctx.moveTo(tongueX, tongueY + tongueH * 0.15);
  ctx.lineTo(tongueX, tongueY + tongueH * 0.85);
  ctx.strokeStyle = '#CC3366';
  ctx.lineWidth = Math.max(1.5, faceW * 0.012);
  ctx.stroke();
}

function drawDogEar(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  ew: number,
  eh: number,
  _flip: boolean
) {
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + ew, y);
  ctx.bezierCurveTo(
    x + ew + ew * 0.3, y + eh * 0.5,
    x + ew * 0.7, y + eh,
    x + ew * 0.5, y + eh
  );
  ctx.bezierCurveTo(
    x + ew * 0.3, y + eh,
    x - ew * 0.15, y + eh * 0.5,
    x, y
  );
  ctx.fillStyle = '#C8956A';
  ctx.fill();
  ctx.strokeStyle = '#A0704A';
  ctx.lineWidth = Math.max(2, ew * 0.07);
  ctx.stroke();

  // Inner ear
  ctx.beginPath();
  ctx.moveTo(x + ew * 0.15, y + eh * 0.12);
  ctx.lineTo(x + ew * 0.82, y + eh * 0.12);
  ctx.bezierCurveTo(
    x + ew * 1.0, y + eh * 0.55,
    x + ew * 0.65, y + eh * 0.85,
    x + ew * 0.5, y + eh * 0.85
  );
  ctx.bezierCurveTo(
    x + ew * 0.35, y + eh * 0.85,
    x + ew * 0.02, y + eh * 0.55,
    x + ew * 0.15, y + eh * 0.12
  );
  ctx.fillStyle = '#E8C0A0';
  ctx.fill();
}

// ─── 👓 Glasses Filter ───────────────────────────────────────────────

function drawGlasses(ctx: CanvasRenderingContext2D, lms: NLM[], w: number, h: number) {
  const lEyeOuter  = px(lms, 33, w, h);
  const lEyeInner  = px(lms, 133, w, h);
  const rEyeInner  = px(lms, 362, w, h);
  const rEyeOuter  = px(lms, 263, w, h);
  const left       = px(lms, 234, w, h);
  const right      = px(lms, 454, w, h);

  const lCenter    = mid(lEyeOuter, lEyeInner);
  const rCenter    = mid(rEyeInner, rEyeOuter);
  const lensR      = dist(lEyeOuter, lEyeInner) * 0.75;
  const thickness  = Math.max(3, lensR * 0.12);

  ctx.strokeStyle = '#1a1a2e';
  ctx.lineWidth   = thickness;
  ctx.lineJoin    = 'round';
  ctx.lineCap     = 'round';

  // Left lens
  ctx.beginPath();
  ctx.arc(lCenter.x, lCenter.y, lensR, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(120, 200, 255, 0.18)';
  ctx.fill();
  ctx.stroke();

  // Right lens
  ctx.beginPath();
  ctx.arc(rCenter.x, rCenter.y, lensR, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Bridge
  ctx.beginPath();
  ctx.moveTo(lCenter.x + lensR, lCenter.y);
  ctx.lineTo(rCenter.x - lensR, rCenter.y);
  ctx.stroke();

  // Temple arms
  ctx.beginPath();
  ctx.moveTo(lCenter.x - lensR, lCenter.y);
  ctx.lineTo(left.x - lensR * 0.3, lCenter.y + lensR * 0.15);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(rCenter.x + lensR, rCenter.y);
  ctx.lineTo(right.x + lensR * 0.3, rCenter.y + lensR * 0.15);
  ctx.stroke();
}

// ─── 👑 Crown Filter ─────────────────────────────────────────────────

function drawCrown(ctx: CanvasRenderingContext2D, lms: NLM[], w: number, h: number) {
  const top   = px(lms, 10, w, h);
  const left  = px(lms, 234, w, h);
  const right = px(lms, 454, w, h);
  const faceW = dist(left, right);
  const cw    = faceW * 1.05;
  const ch    = faceW * 0.45;
  const cx    = top.x;
  const cy    = top.y - ch * 0.25;

  const grad = ctx.createLinearGradient(cx, cy - ch, cx, cy);
  grad.addColorStop(0, '#FFD700');
  grad.addColorStop(0.5, '#FFA500');
  grad.addColorStop(1, '#DAA520');

  ctx.fillStyle = grad;
  ctx.strokeStyle = '#B8860B';
  ctx.lineWidth = Math.max(2, faceW * 0.01);
  ctx.lineJoin = 'round';

  // Crown shape — 5 points
  ctx.beginPath();
  const baseY = cy;
  const baseL = cx - cw / 2;
  const baseR = cx + cw / 2;
  const pts = 5;
  const pointHeights = [0.9, 0.6, 1.0, 0.6, 0.9]; // relative heights per spike

  ctx.moveTo(baseL, baseY);
  for (let i = 0; i < pts; i++) {
    const x = baseL + (i / (pts - 1)) * cw;
    ctx.lineTo(x, baseY - ch * pointHeights[i]);
    if (i < pts - 1) {
      const nx = baseL + ((i + 1) / (pts - 1)) * cw;
      ctx.lineTo((x + nx) / 2, baseY - ch * 0.2);
    }
  }
  ctx.lineTo(baseR, baseY);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Gems
  [[cx, cy - ch * 1.05], [cx - cw * 0.32, cy - ch * 0.66], [cx + cw * 0.32, cy - ch * 0.66]].forEach(([gx, gy]) => {
    ctx.beginPath();
    ctx.arc(gx, gy, faceW * 0.032, 0, Math.PI * 2);
    ctx.fillStyle = '#FF3366';
    ctx.fill();
    ctx.strokeStyle = '#CC0033';
    ctx.lineWidth = Math.max(1, faceW * 0.007);
    ctx.stroke();

    // Gem shine
    ctx.beginPath();
    ctx.arc(gx - faceW * 0.01, gy - faceW * 0.01, faceW * 0.01, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,0.75)';
    ctx.fill();
  });
}

// ─── 🌸 Flower Crown Filter ──────────────────────────────────────────

function drawFlowerCrown(ctx: CanvasRenderingContext2D, lms: NLM[], w: number, h: number) {
  const top   = px(lms, 10, w, h);
  const left  = px(lms, 234, w, h);
  const right = px(lms, 454, w, h);
  const faceW = dist(left, right);
  const r     = faceW * 0.075;

  const colors: Array<[string, string]> = [
    ['#FF6EB4', '#FFD700'],
    ['#FF9DCC', '#FF6600'],
    ['#FFFFFF', '#FFD700'],
    ['#FF3399', '#FF9900'],
    ['#FFB3D9', '#FFD700'],
    ['#FF6EB4', '#FF9900'],
    ['#FFD700', '#FF3399'],
  ];

  // Spread flowers along forehead arc
  const count = 7;
  for (let i = 0; i < count; i++) {
    const t = i / (count - 1);        // 0 → 1
    const fx = left.x + t * faceW;
    const fy = top.y - faceW * 0.04 - Math.sin(t * Math.PI) * faceW * 0.08;
    const [petC, cenC] = colors[i % colors.length];
    drawFlower(ctx, fx, fy, r, petC, cenC);
  }

  // Green stem/leaves connecting flowers
  ctx.strokeStyle = '#3DA037';
  ctx.lineWidth   = Math.max(2, faceW * 0.013);
  ctx.beginPath();
  ctx.moveTo(left.x, top.y - faceW * 0.04);
  for (let i = 0; i <= 10; i++) {
    const t  = i / 10;
    const fx = left.x + t * faceW;
    const fy = top.y - faceW * 0.04 - Math.sin(t * Math.PI) * faceW * 0.08;
    i === 0 ? ctx.moveTo(fx, fy) : ctx.lineTo(fx, fy);
  }
  ctx.stroke();
}

// ─── 🦋 Butterfly Filter ─────────────────────────────────────────────

function drawButterfly(ctx: CanvasRenderingContext2D, lms: NLM[], w: number, h: number) {
  const lEyeOuter = px(lms, 33, w, h);
  const rEyeOuter = px(lms, 263, w, h);
  const nose      = px(lms, 1, w, h);   // nose bridge
  const left      = px(lms, 234, w, h);
  const right     = px(lms, 454, w, h);
  const faceW     = dist(left, right);
  const cx        = mid(lEyeOuter, rEyeOuter).x;
  const cy        = mid(lEyeOuter, rEyeOuter).y + faceW * 0.03;
  const ww        = faceW * 0.55;  // wing width
  const wh        = faceW * 0.38;  // wing height

  // Wing gradients
  const leftGrad = ctx.createRadialGradient(cx - ww * 0.45, cy, 0, cx - ww * 0.45, cy, ww * 0.9);
  leftGrad.addColorStop(0, 'rgba(140, 60, 200, 0.85)');
  leftGrad.addColorStop(0.5, 'rgba(200, 80, 160, 0.75)');
  leftGrad.addColorStop(1, 'rgba(80, 20, 150, 0.55)');

  const rightGrad = ctx.createRadialGradient(cx + ww * 0.45, cy, 0, cx + ww * 0.45, cy, ww * 0.9);
  rightGrad.addColorStop(0, 'rgba(140, 60, 200, 0.85)');
  rightGrad.addColorStop(0.5, 'rgba(200, 80, 160, 0.75)');
  rightGrad.addColorStop(1, 'rgba(80, 20, 150, 0.55)');

  // Left upper wing
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.bezierCurveTo(cx - ww * 0.15, cy - wh * 1.0, cx - ww, cy - wh * 1.1, cx - ww, cy - wh * 0.2);
  ctx.bezierCurveTo(cx - ww, cy + wh * 0.1, cx - ww * 0.4, cy + wh * 0.3, cx, cy);
  ctx.fillStyle = leftGrad;
  ctx.fill();

  // Left lower wing
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.bezierCurveTo(cx - ww * 0.4, cy + wh * 0.25, cx - ww * 0.75, cy + wh * 0.6, cx - ww * 0.45, cy + wh * 0.75);
  ctx.bezierCurveTo(cx - ww * 0.15, cy + wh * 0.9, cx - ww * 0.1, cy + wh * 0.6, cx, cy);
  ctx.fillStyle = 'rgba(160, 80, 210, 0.7)';
  ctx.fill();

  // Right upper wing
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.bezierCurveTo(cx + ww * 0.15, cy - wh * 1.0, cx + ww, cy - wh * 1.1, cx + ww, cy - wh * 0.2);
  ctx.bezierCurveTo(cx + ww, cy + wh * 0.1, cx + ww * 0.4, cy + wh * 0.3, cx, cy);
  ctx.fillStyle = rightGrad;
  ctx.fill();

  // Right lower wing
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.bezierCurveTo(cx + ww * 0.4, cy + wh * 0.25, cx + ww * 0.75, cy + wh * 0.6, cx + ww * 0.45, cy + wh * 0.75);
  ctx.bezierCurveTo(cx + ww * 0.15, cy + wh * 0.9, cx + ww * 0.1, cy + wh * 0.6, cx, cy);
  ctx.fillStyle = 'rgba(160, 80, 210, 0.7)';
  ctx.fill();

  // Wing patterns — spots
  const spots: Array<[number, number, number, string]> = [
    [cx - ww * 0.5, cy - wh * 0.45, faceW * 0.035, 'rgba(255,210,80,0.8)'],
    [cx - ww * 0.65, cy - wh * 0.1, faceW * 0.025, 'rgba(255,255,255,0.6)'],
    [cx + ww * 0.5, cy - wh * 0.45, faceW * 0.035, 'rgba(255,210,80,0.8)'],
    [cx + ww * 0.65, cy - wh * 0.1, faceW * 0.025, 'rgba(255,255,255,0.6)'],
  ];
  spots.forEach(([sx, sy, sr, sc]) => {
    ctx.beginPath();
    ctx.arc(sx, sy, sr, 0, Math.PI * 2);
    ctx.fillStyle = sc;
    ctx.fill();
  });

  // Antennae
  ctx.strokeStyle = '#5A1A8A';
  ctx.lineWidth   = Math.max(1.5, faceW * 0.009);
  ctx.beginPath();
  ctx.moveTo(cx - faceW * 0.02, cy - wh * 0.15);
  ctx.quadraticCurveTo(cx - faceW * 0.12, cy - wh * 0.9, cx - faceW * 0.18, cy - wh * 1.0);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx + faceW * 0.02, cy - wh * 0.15);
  ctx.quadraticCurveTo(cx + faceW * 0.12, cy - wh * 0.9, cx + faceW * 0.18, cy - wh * 1.0);
  ctx.stroke();
  // Antennae tips
  [[cx - faceW * 0.18, cy - wh * 1.0], [cx + faceW * 0.18, cy - wh * 1.0]].forEach(([ax, ay]) => {
    ctx.beginPath();
    ctx.arc(ax, ay, faceW * 0.018, 0, Math.PI * 2);
    ctx.fillStyle = '#9B59B6';
    ctx.fill();
  });
}

// ─── 🤡 Clown Filter ─────────────────────────────────────────────────

function drawClown(ctx: CanvasRenderingContext2D, lms: NLM[], w: number, h: number) {
  const nose   = px(lms, 4, w, h);
  const left   = px(lms, 234, w, h);
  const right  = px(lms, 454, w, h);
  const faceW  = dist(left, right);
  const r      = faceW * 0.1;

  // Shadow
  ctx.beginPath();
  ctx.arc(nose.x + r * 0.08, nose.y + r * 0.1, r, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  ctx.fill();

  // Nose body
  const nGrad = ctx.createRadialGradient(
    nose.x - r * 0.3, nose.y - r * 0.3, r * 0.05,
    nose.x, nose.y, r
  );
  nGrad.addColorStop(0, '#FF6666');
  nGrad.addColorStop(0.6, '#FF0000');
  nGrad.addColorStop(1, '#CC0000');

  ctx.beginPath();
  ctx.arc(nose.x, nose.y, r, 0, Math.PI * 2);
  ctx.fillStyle = nGrad;
  ctx.fill();

  // Shine
  ctx.beginPath();
  ctx.arc(nose.x - r * 0.28, nose.y - r * 0.28, r * 0.22, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255,255,255,0.65)';
  ctx.fill();
}

// ─── ✨ Sparkle Filter ────────────────────────────────────────────────

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

  // Sparkle positions (relative to face center)
  const sparkleData: Array<[number, number, number, string, number]> = [
    [-0.55,  -0.55, 0.035, '#FFD700', 0.0],
    [ 0.52,  -0.48, 0.028, '#FF69B4', 1.2],
    [-0.48,   0.40, 0.022, '#87CEEB', 2.4],
    [ 0.50,   0.45, 0.030, '#FFD700', 0.7],
    [-0.10,  -0.75, 0.038, '#FF69B4', 1.8],
    [ 0.10,  -0.72, 0.025, '#FFD700', 3.1],
    [-0.72,   0.05, 0.020, '#87CEEB', 0.3],
    [ 0.70,   0.02, 0.026, '#FF69B4', 2.0],
    [-0.30,   0.70, 0.022, '#FFD700', 1.5],
    [ 0.32,   0.68, 0.020, '#87CEEB', 0.9],
  ];

  sparkleData.forEach(([rx, ry, rs, color, phase]) => {
    const pulse = 0.7 + 0.3 * Math.sin(t * 2.5 + phase);
    const sx    = cx + rx * faceW;
    const sy    = cy + ry * faceH;
    const sr    = rs * faceW * pulse;
    const rot   = t * 1.2 + phase;

    ctx.fillStyle = color;
    ctx.globalAlpha = 0.7 + 0.3 * Math.sin(t * 3 + phase);
    drawStar(ctx, sx, sy, sr, sr * 0.4, 4, rot);

    // Outer glow
    ctx.globalAlpha = 0.2 * pulse;
    ctx.fillStyle = color;
    drawStar(ctx, sx, sy, sr * 1.8, sr * 0.6, 4, rot + Math.PI / 4);
    ctx.globalAlpha = 1;
  });
}

// ─── 💄 Beauty Filter ────────────────────────────────────────────────

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

  const padding = faceW * 0.12;
  const fx      = left.x  - padding;
  const fy      = top.y   - padding;
  const fw      = faceW   + padding * 2;
  const fh      = dist(top, chin) + padding * 2;

  // Off-screen canvas: extract face region from video → apply blur + brightness
  const off = document.createElement('canvas');
  off.width  = fw;
  off.height = fh;
  const offCtx = off.getContext('2d')!;

  // Scale video coords to canvas display coords
  const scaleX = w / video.videoWidth;
  const scaleY = h / video.videoHeight;

  offCtx.filter = 'blur(2.5px) brightness(1.12) saturate(0.92)';
  offCtx.drawImage(
    video,
    fx / scaleX, fy / scaleY, fw / scaleX, fh / scaleY,  // source
    0, 0, fw, fh                                           // dest
  );
  offCtx.filter = 'none';

  // Ellipse clip mask for smooth edge
  ctx.save();
  ctx.beginPath();
  ctx.ellipse(fx + fw / 2, fy + fh / 2, fw / 2, fh / 2, 0, 0, Math.PI * 2);
  ctx.clip();
  ctx.globalAlpha = 0.72;
  ctx.drawImage(off, fx, fy, fw, fh);
  ctx.globalAlpha = 1;
  ctx.restore();

  // Subtle warm glow overlay for skin brightening
  const glowGrad = ctx.createRadialGradient(
    fx + fw / 2, fy + fh / 2, fw * 0.1,
    fx + fw / 2, fy + fh / 2, Math.max(fw, fh) / 2
  );
  glowGrad.addColorStop(0, 'rgba(255, 240, 220, 0.14)');
  glowGrad.addColorStop(1, 'rgba(255, 240, 220, 0)');
  ctx.save();
  ctx.beginPath();
  ctx.ellipse(fx + fw / 2, fy + fh / 2, fw / 2, fh / 2, 0, 0, Math.PI * 2);
  ctx.clip();
  ctx.fillStyle = glowGrad;
  ctx.fillRect(fx, fy, fw, fh);
  ctx.restore();
}
