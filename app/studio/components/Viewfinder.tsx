'use client';

import { FilterType, FILTER_CSS } from '@/lib/config';
import styles from './Viewfinder.module.css';

interface ViewfinderProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  isReady: boolean;
  error: string | null;
  filter: FilterType;
  isCountingDown: boolean;
  countdown: number;
}

export default function Viewfinder({
  videoRef, isReady, error, filter, isCountingDown, countdown,
}: ViewfinderProps) {
  const cssFilter = FILTER_CSS[filter];
  return (
    <div className={styles.wrap}>
      {error && (
        <div className={styles.stateOverlay}>
          <div className={styles.stateIcon}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#D4537E" strokeWidth="1.5">
              <path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2"/>
              <line x1="1" y1="1" x2="23" y2="23" stroke="#D4537E"/>
            </svg>
          </div>
          <p className={styles.stateTitle}>Kamera tidak dapat diakses</p>
          <p className={styles.stateMsg}>{error}</p>
          <p className={styles.stateHint}>Beri izin kamera di browser, lalu refresh.</p>
        </div>
      )}
      {!error && !isReady && (
        <div className={styles.stateOverlay}>
          <div className={styles.loadingSpinner} />
          <p className={styles.stateMsg}>Memuat kamera...</p>
        </div>
      )}

      <video
        ref={videoRef}
        id="rg-viewfinder"
        className={styles.video}
        style={{ filter: cssFilter !== 'none' ? cssFilter : undefined, display: isReady ? 'block' : 'none' }}
        autoPlay playsInline muted
      />

      {isCountingDown && (
        <div className={styles.countdownOverlay}>
          <span key={countdown} className={styles.countdownNum}>{countdown}</span>
        </div>
      )}

      {isReady && filter !== 'Normal' && (
        <div className={styles.filterTag}>{filter}</div>
      )}
    </div>
  );
}
