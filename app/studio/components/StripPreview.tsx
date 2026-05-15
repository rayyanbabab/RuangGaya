'use client';

import { useRef } from 'react';

import { Template, FilterType, FILTER_CSS, Frame, StickerItem } from '@/lib/config';
import StickerLayer from './StickerLayer';
import styles from './StripPreview.module.css';

interface StripPreviewProps {
  slots: (string | null)[];
  template: Template;
  frame: Frame;
  filter: FilterType;
  stripText?: string;
  stripTextColor?: string;
  stickers?: StickerItem[];
  updateSticker?: (id: string, updates: Partial<StickerItem>) => void;
  removeSticker?: (id: string) => void;
}

export default function StripPreview({
  slots,
  template,
  frame,
  filter,
  stripText,
  stripTextColor = '#000000',
  stickers,
  updateSticker,
  removeSticker,
}: StripPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const cssFilter = FILTER_CSS[filter];

  // Default text color
  const computedStripTextColor = stripTextColor;

  // Auto-detect empty cell colors
  const isDark = isColorDark(frame.bgColor);
  const emptyCellColor = isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.3)';

  const slotW = 400;
  const slotH = 300;
  const gap = 14;
  const padding = 24; // Reduced from 40
  const cols = template.cols;
  const rows = Math.ceil(template.slots / cols);
  
  const photoAreaW = padding * 2 + cols * slotW + (cols - 1) * gap;
  const photoAreaH = padding * 2 + rows * slotH + (rows - 1) * gap;
  const footerH = stripText && stripText.trim() ? 56 : 0;
  const totalW = photoAreaW;
  const totalH = photoAreaH + footerH;

  // Calculate padding and gap as percentages of container width
  const padPct = (padding / photoAreaW) * 100;
  const gapPct = (gap / photoAreaW) * 100;

  return (
    <div
      ref={containerRef}
      className={styles.previewContainer}
      style={{
        aspectRatio: `${totalW} / ${totalH}`,
        ...(frame.bgImage
          ? {
              backgroundImage: `url(${frame.bgImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }
          : { background: frame.bgColor })
      }}
      id="strip-preview-area"
    >
      <div className={styles.contentArea}>
      {/* 1. Photo grid */}
      <div
        className={styles.photoGrid}
        style={{ 
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          padding: `${padPct}%`,
          gap: `${gapPct}%`,
        }}
      >
        {slots.map((src, i) =>
          src ? (
            <div
              key={i}
              className={styles.photoCell}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={`Foto ${i + 1}`}
                className={styles.photoImg}
                style={{ filter: cssFilter !== 'none' ? cssFilter : undefined }}
              />
            </div>
          ) : (
            <div
              key={i}
              className={styles.emptyCell}
              style={{ borderColor: emptyCellColor, color: emptyCellColor }}
            >
              <span className={styles.emptyCellNum}>{i + 1}</span>
            </div>
          )
        )}
      </div>

      {/* 2. Stickers */}
      {stickers && updateSticker && removeSticker && (
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', overflow: 'hidden' }}>
          <div style={{ position: 'relative', width: '100%', height: '100%', pointerEvents: 'auto' }}>
             <StickerLayer stickers={stickers} updateSticker={updateSticker} removeSticker={removeSticker} />
          </div>
        </div>
      )}
      </div>

      {/* 4. Strip Text Footer */}
      {stripText && stripText.trim() && (
        <div 
          className={styles.stripTextFooter}
          style={{ 
            position: 'absolute',
            top: `${(photoAreaH / totalH) * 100}%`,
            left: 0,
            width: '100%',
            height: `${(footerH / totalH) * 100}%`,
            padding: 0,
            margin: 0,
            boxSizing: 'border-box',
            pointerEvents: 'none'
          }}
        >
          <div style={{
            position: 'absolute',
            top: `${( (footerH / 2 - 6) / footerH ) * 100}%`,
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: computedStripTextColor,
            fontFamily: '"Nunito", sans-serif',
            fontWeight: 'bold',
            fontSize: `${(22 / totalW) * 100}cqi`,
            whiteSpace: 'nowrap',
            lineHeight: 1
          }}>
            {stripText}
          </div>
        </div>
      )}
    </div>
  );
}

function isColorDark(hex: string): boolean {
  const c = hex.replace('#', '');
  if (c.length < 6) return false;
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 < 128;
}
