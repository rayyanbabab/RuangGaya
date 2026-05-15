'use client';

import { useState, useEffect } from 'react';
import Moveable from 'react-moveable';
import { StickerItem } from '@/lib/config';

interface StickerLayerProps {
  stickers: StickerItem[];
  updateSticker: (id: string, updates: Partial<StickerItem>) => void;
  removeSticker: (id: string) => void;
}

export default function StickerLayer({ stickers, updateSticker, removeSticker }: StickerLayerProps) {
  const [target, setTarget] = useState<HTMLElement | null>(null);

  // Unset target when clicking outside
  useEffect(() => {
    const handleWindowClick = (e: MouseEvent) => {
      // If clicking outside any sticker or moveable control, deselect
      const t = e.target as HTMLElement;
      if (!t.closest('.rg-sticker') && !t.closest('.moveable-control-box')) {
        setTarget(null);
      }
    };
    window.addEventListener('mousedown', handleWindowClick);
    return () => window.removeEventListener('mousedown', handleWindowClick);
  }, []);

  return (
    <>
      {stickers.map((s) => (
        <div
          key={s.id}
          id={s.id}
          className="rg-sticker"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: `${s.width}px`,
            height: `${s.height}px`,
            transform: s.transform,
            transformOrigin: '0 0',
            cursor: 'move',
            zIndex: target?.id === s.id ? 100 : 10,
          }}
          onMouseDown={(e) => {
            setTarget(e.currentTarget);
          }}
        >
          {/* Delete Button (only visible when selected) */}
          {target?.id === s.id && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeSticker(s.id);
                setTarget(null);
              }}
              style={{
                position: 'absolute',
                top: '-12px',
                right: '-12px',
                background: '#ff4444',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '24px',
                height: '24px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 101,
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
              }}
              title="Hapus Stiker"
            >
              ×
            </button>
          )}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={s.src} alt="sticker" style={{ width: '100%', height: '100%', display: 'block', pointerEvents: 'none' }} />
        </div>
      ))}

      {target && (
        <Moveable
          target={target}
          draggable={true}
          resizable={true}
          rotatable={true}
          keepRatio={true} // stickers usually want to keep aspect ratio
          renderDirections={['nw', 'ne', 'sw', 'se']}
          onDrag={(e) => {
            e.target.style.transform = e.transform;
          }}
          onDragEnd={(e) => {
            if (e.target) {
              updateSticker(e.target.id, { transform: e.target.style.transform });
            }
          }}
          onResize={(e) => {
            e.target.style.width = `${e.width}px`;
            e.target.style.height = `${e.height}px`;
            e.target.style.transform = e.drag.transform;
          }}
          onResizeEnd={(e) => {
            if (e.target) {
              updateSticker(e.target.id, {
                width: parseFloat(e.target.style.width),
                height: parseFloat(e.target.style.height),
                transform: e.target.style.transform,
              });
            }
          }}
          onRotate={(e) => {
            e.target.style.transform = e.drag.transform;
          }}
          onRotateEnd={(e) => {
            if (e.target) {
              updateSticker(e.target.id, { transform: e.target.style.transform });
            }
          }}
        />
      )}
    </>
  );
}
