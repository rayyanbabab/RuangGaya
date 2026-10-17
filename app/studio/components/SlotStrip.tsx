'use client';

import styles from './SlotStrip.module.css';

interface SlotStripProps {
  slots: (string | null)[];
  activeSlot: number;
  cols?: number;
  onSlotClick: (i: number) => void;
}

export default function SlotStrip({ slots, activeSlot, onSlotClick }: SlotStripProps) {
  const filledCount = slots.filter(Boolean).length;
  const isAllFilled = filledCount === slots.length;

  return (
    <div className={styles.wrapper}>
      <div className={styles.headerRow}>
        <div className={styles.label}>
          <span className={styles.poseBadge}>
            {isAllFilled ? 'Foto Lengkap' : `Pose ${activeSlot + 1} / ${slots.length}`}
          </span>
          <span className={styles.countText}>
            {filledCount}/{slots.length} foto siap
          </span>
        </div>
        <div className={styles.hintText}>
          {isAllFilled ? (
            <span>Mengarahkan ke Edit Studio...</span>
          ) : (
            <>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="16" x2="12" y2="12"/>
                <line x1="12" y1="8" x2="12.01" y2="8"/>
              </svg>
              <span>Tekan tombol kamera atau Spasi</span>
            </>
          )}
        </div>
      </div>

      <div
        className={styles.dock}
        style={{
          gridTemplateColumns: `repeat(${slots.length}, 1fr)`,
          maxWidth: `${Math.min(slots.length * 95, 520)}px`,
        }}
      >
        {slots.map((slot, i) => {
          const isActive = i === activeSlot;
          const isFilled = !!slot;

          return (
            <button
              key={i}
              id={`slot-${i}`}
              type="button"
              className={`${styles.slot} ${isActive ? styles.active : ''} ${isFilled ? styles.filled : ''}`}
              onClick={() => onSlotClick(i)}
              title={slot ? `Pose ${i + 1} (Klik untuk foto ulang)` : `Slot Pose ${i + 1}`}
              aria-label={`Slot ${i + 1}`}
            >
              {slot ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={slot} alt={`Pose ${i + 1}`} className={styles.thumbnail} />
              ) : (
                <div className={styles.empty}>
                  <span className={styles.emptyNum}>{i + 1}</span>
                  <span className={styles.emptyIcon}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/>
                      <circle cx="12" cy="13" r="3"/>
                    </svg>
                  </span>
                </div>
              )}

              {/* Status Indicator Badge */}
              <div className={styles.slotBadge}>
                {isFilled ? '✓' : `${i + 1}`}
              </div>

              {isActive && !isFilled && (
                <div className={styles.activeTag}>Pose Ini</div>
              )}

              {isFilled && (
                <div className={styles.retakeOverlay}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 2v6h-6M3 12a9 9 0 0 1 15-6.7L21 8M3 22v-6h6M21 12a9 9 0 0 1-15 6.7L3 16"/>
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
