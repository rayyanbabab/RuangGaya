import { FilterType, FILTER_CSS, Frame, TemplateId } from './config';

/**
 * Capture raw frame (no filter) — mirrored horizontally.
 * Filter applied later at export time.
 */
export function captureRawFrame(
  video: HTMLVideoElement,
  width = 1200, // Higher resolution for crisper output
  height = 900  // 4:3 ratio matches our slots
): string {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  // Calculate crop to center the video (like object-fit: cover)
  // Webcam is usually 16:9 (e.g., 1280x720), canvas is 4:3
  const videoRatio = video.videoWidth / video.videoHeight;
  const canvasRatio = width / height;

  let sx = 0, sy = 0, sw = video.videoWidth, sh = video.videoHeight;

  if (videoRatio > canvasRatio) {
    // Video is wider than canvas — crop horizontally
    sw = video.videoHeight * canvasRatio;
    sx = (video.videoWidth - sw) / 2;
  } else {
    // Video is taller than canvas — crop vertically
    sh = video.videoWidth / canvasRatio;
    sy = (video.videoHeight - sh) / 2;
  }

  // Mirror horizontally
  ctx.translate(width, 0);
  ctx.scale(-1, 1);
  ctx.drawImage(video, sx, sy, sw, sh, 0, 0, width, height);

  return canvas.toDataURL('image/jpeg', 0.95);
}

interface BuildStripOptions {
  slots: (string | null)[];
  cols: number;
  /** Template ID — used to resolve per-template overlayPath */
  templateId: TemplateId;
  frame: Frame;
  slotW?: number;
  slotH?: number;
  gap?: number;
  padding?: number;
  stripText?: string;
  stripTextColor?: string;
  filter?: FilterType;
  stickers?: import('./config').StickerItem[];
  domWidth?: number;
}

/**
 * Compose the final photo strip canvas.
 * Layer order (bottom → top):
 *   1. Frame background color (always painted first as fallback)
 *   2. Background image (bgImage), if set — covers full strip area
 *   3. Strip text footer
 */
export async function buildStripCanvas({
  slots,
  cols,
  templateId,
  frame,
  slotW = 400,
  slotH = 300,
  gap = 14,
  padding = 24, // Reduced from 40 to make the frame thinner
  stripText = '',
  stripTextColor = '#000000',
  filter = 'Normal',
  ...options
}: BuildStripOptions): Promise<HTMLCanvasElement> {
  const rows = Math.ceil(slots.length / cols);
  const footerH = stripText.trim() ? 56 : 0;
  const totalW = padding * 2 + cols * slotW + (cols - 1) * gap;
  const photoAreaH = padding * 2 + rows * slotH + (rows - 1) * gap;
  const totalH = photoAreaH + footerH;

  const canvas = document.createElement('canvas');
  canvas.width = totalW;
  canvas.height = totalH;
  const ctx = canvas.getContext('2d')!;

  // ── 1. Frame background color (fallback, always rendered) ───────
  ctx.fillStyle = frame.bgColor;
  ctx.fillRect(0, 0, totalW, totalH);

  // ── 2. Background image (wallpaper behind photos) ───────────────
  if (frame.bgImage) {
    try {
      const bgImg = await loadImage(frame.bgImage);
      // Cover: maintain aspect ratio, crop to fill
      const imgRatio = bgImg.width / bgImg.height;
      const canvasRatio = totalW / totalH;
      let sx = 0, sy = 0, sw = bgImg.width, sh = bgImg.height;
      if (imgRatio > canvasRatio) {
        sw = bgImg.height * canvasRatio;
        sx = (bgImg.width - sw) / 2;
      } else {
        sh = bgImg.width / canvasRatio;
        sy = (bgImg.height - sh) / 2;
      }
      ctx.drawImage(bgImg, sx, sy, sw, sh, 0, 0, totalW, totalH);
    } catch {
      // bgImage load failed — bgColor fallback already painted
    }
  }

  // ── 3. Photos in slots ──────────────────────────────────────────
  const cssFilter = FILTER_CSS[filter];
  // Pre-load all slot images in parallel to avoid sequential loading bottleneck
  const loadedSlots = await Promise.all(
    slots.map((src) => (src ? loadImage(src) : null))
  );

  for (let i = 0; i < slots.length; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = padding + col * (slotW + gap);
    const y = padding + row * (slotH + gap);

    if (loadedSlots[i]) {
      if (cssFilter !== 'none') ctx.filter = cssFilter;
      ctx.drawImage(loadedSlots[i]!, x, y, slotW, slotH);
      ctx.filter = 'none';
    } else {
      ctx.fillStyle = 'rgba(0,0,0,0.08)';
      ctx.fillRect(x, y, slotW, slotH);
    }
  }

  // ── 4. Stickers ─────────────────────────────────────────────────
  if (options.stickers && options.stickers.length > 0 && options.domWidth) {
    const scale = totalW / options.domWidth;
    
    // Pre-load all stickers in parallel
    const loadedStickers = await Promise.all(
      options.stickers.map(async (sticker) => {
        try {
          const img = await loadImage(sticker.src);
          return { sticker, img };
        } catch (err) {
          console.error('Failed to load sticker:', err);
          return null;
        }
      })
    );

    for (const item of loadedStickers) {
      if (!item) continue;
      const { sticker, img } = item;
      try {
        ctx.save();
        
        // Parse the transform string (e.g., "translate(100px, 100px) rotate(45deg)")
        // Since DOMMatrix is not available in Node.js, and this runs in the browser,
        // we can safely use DOMMatrix.
        const matrix = new DOMMatrix(sticker.transform);
        
        // Apply the same matrix but scaled up
        // transform matrix: a c e
        //                   b d f
        // e = tx, f = ty
        ctx.translate(matrix.e * scale, matrix.f * scale);
        
        // Extract rotation and scaling from the matrix
        const angle = Math.atan2(matrix.b, matrix.a);
        const scaleX = Math.sqrt(matrix.a * matrix.a + matrix.b * matrix.b);
        const scaleY = Math.sqrt(matrix.c * matrix.c + matrix.d * matrix.d);
        
        ctx.rotate(angle);
        ctx.scale(scaleX, scaleY);
        
        // The sticker width/height is also scaled
        ctx.drawImage(img, 0, 0, sticker.width * scale, sticker.height * scale);
        ctx.restore();
      } catch (err) {
        console.error('Failed to render sticker:', err);
      }
    }
  }

  // ── 5. Strip text footer ────────────────────────────────────────
  if (stripText.trim()) {
    const fy = photoAreaH;
    ctx.fillStyle = stripTextColor;
    ctx.font = `bold 22px "Nunito", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    // Shift up slightly (-6px) so it doesn't look too low
    ctx.fillText(stripText, totalW / 2, fy + footerH / 2 - 6);
  }

  return canvas;
}

/** Simple luminance-based dark color check */
function isColorDark(hex: string): boolean {
  const c = hex.replace('#', '');
  if (c.length < 6) return false;
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 < 128;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
}
