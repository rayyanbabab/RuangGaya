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
            {isAllFilled ? '✨ Siap Edit' : `Pose ${activeSlot + 1} / ${slots.length}`}
          </span>
          <span className={styles.countText}>
            {filledCount}/{slots.length} foto siap
          </span>
        </div>
        <span className={styles.hintText}>
          {isAllFilled ? 'Mengarahkan ke Edit Studio...' : '💡 Tekan tombol kamera atau Spasi'}
        </span>
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
                  <span className={styles.emptyIcon}>📷</span>
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
                  <span>🔄</span>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

