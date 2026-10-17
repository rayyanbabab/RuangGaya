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

  // Unset target when clicking outside (both mouse and touch support)
  useEffect(() => {
    const handleOutside = (e: MouseEvent | TouchEvent) => {
      const t = e.target as HTMLElement;
      if (!t.closest('.rg-sticker') && !t.closest('.moveable-control-box')) {
        setTarget(null);
      }
    };
    window.addEventListener('mousedown', handleOutside);
    window.addEventListener('touchstart', handleOutside);
    return () => {
      window.removeEventListener('mousedown', handleOutside);
      window.removeEventListener('touchstart', handleOutside);
    };
  }, []);

  return (
    <>
      {stickers.map((s) => {
        const isSelected = target?.id === s.id;
        return (
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
              touchAction: 'none',
              zIndex: isSelected ? 100 : 10,
              outline: isSelected ? '2px dashed var(--rg-purple, #8E36FF)' : 'none',
              outlineOffset: '4px',
              borderRadius: '8px',
            }}
            onMouseDown={(e) => {
              setTarget(e.currentTarget);
            }}
            onTouchStart={(e) => {
              setTarget(e.currentTarget);
            }}
          >
            {/* Quick Action Bar (visible when sticker is selected) */}
            {isSelected && (
              <div
                style={{
                  position: 'absolute',
                  top: '-36px',
                  right: '-8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  zIndex: 101,
                  background: 'rgba(32, 32, 48, 0.85)',
                  backdropFilter: 'blur(6px)',
                  padding: '3px 6px',
                  borderRadius: '20px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
                }}
              >
                {/* Reset button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    updateSticker(s.id, {
                      width: 140,
                      height: 140,
                      transform: 'translate(100px, 100px) rotate(0deg)',
                    });
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#ffffff',
                    cursor: 'pointer',
                    fontSize: '11px',
                    padding: '2px 4px',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  title="Reset Posisi Stiker"
                >
                  ↺
                </button>

                {/* Delete Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeSticker(s.id);
                    setTarget(null);
                  }}
                  style={{
                    background: '#ff4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    lineHeight: 1,
                  }}
                  title="Hapus Stiker"
                >
                  ×
                </button>
              </div>
            )}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={s.src}
              alt="sticker"
              style={{
                width: '100%',
                height: '100%',
                display: 'block',
                pointerEvents: 'none',
                userSelect: 'none',
              }}
            />
          </div>
        );
      })}

      {target && (
        <Moveable
          target={target}
          draggable={true}
          resizable={true}
          rotatable={true}
          pinchable={true}
          keepRatio={true}
          renderDirections={['nw', 'ne', 'sw', 'se']}
          origin={false}
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
