'use client';

import styles from './SlotStrip.module.css';

interface SlotStripProps {
  slots: (string | null)[];
  activeSlot: number;
  cols: number;
  onSlotClick: (i: number) => void;
}

export default function SlotStrip({ slots, activeSlot, cols, onSlotClick }: SlotStripProps) {
  return (
    <div className={styles.wrapper}>
      <p className={styles.label}>
        Slot foto — {slots.filter(Boolean).length}/{slots.length} terisi
      </p>
      <div
        className={styles.grid}
        style={{ gridTemplateColumns: `repeat(${Math.min(cols === 1 ? slots.length : cols, 6)}, 1fr)` }}
      >
        {slots.map((slot, i) => (
          <button
            key={i}
            id={`slot-${i}`}
            className={`${styles.slot} ${i === activeSlot ? styles.active : ''} ${slot ? styles.filled : ''}`}
            onClick={() => onSlotClick(i)}
            title={slot ? 'Klik untuk ambil ulang' : `Slot ${i + 1}`}
            aria-label={slot ? `Slot ${i + 1} — klik untuk ambil ulang` : `Slot ${i + 1} kosong`}
          >
            {slot ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={slot} alt={`Foto slot ${i + 1}`} className={styles.thumbnail} />
            ) : (
              <div className={styles.empty}>
                <span className={styles.emptyNum}>{i + 1}</span>
                <span className={styles.emptyIcon}>📷</span>
              </div>
            )}
            {i === activeSlot && <div className={styles.activePulse} />}
            {slot && (
              <div className={styles.retakeOverlay}>
                <span>🔄</span>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
