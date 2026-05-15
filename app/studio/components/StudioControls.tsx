'use client';

import { TimerOption } from '@/lib/config';
import styles from './StudioControls.module.css';

interface StudioControlsProps {
  isReady: boolean;
  isCountingDown: boolean;
  autoShoot: boolean;
  timer: TimerOption;
  timerOptions: number[];
  allSlotsFilled: boolean;
  onCapture: () => void;
  onTimedCapture: () => void;
  onAutoShoot: () => void;
  onTimerChange: (t: TimerOption) => void;
  onAutoShootToggle: () => void;
  onReset: () => void;
  onCancelCountdown: () => void;
}

export default function StudioControls({
  isReady, isCountingDown, autoShoot, timer,
  allSlotsFilled, onCapture, onTimedCapture, onAutoShoot,
  onCancelCountdown,
}: StudioControlsProps) {
  const disabled = !isReady || allSlotsFilled;

  return (
    <div className={styles.controls}>
      {isCountingDown ? (
        <button id="btn-cancel" className={styles.cancelBtn} onClick={onCancelCountdown}>
          Batalkan
        </button>
      ) : (
        <div className={styles.btnRow}>
          <button
            id="btn-capture"
            className={styles.captureBtn}
            onClick={onCapture}
            disabled={disabled}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="4"/><path d="M20 20H4a2 2 0 01-2-2V8a2 2 0 012-2h2l2-3h8l2 3h2a2 2 0 012 2v10a2 2 0 01-2 2z"/>
            </svg>
            Ambil Foto
          </button>

          <button
            id="btn-timer-capture"
            className={styles.timerCaptureBtn}
            onClick={onTimedCapture}
            disabled={disabled}
            title={`Foto dengan timer ${timer} detik`}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
            {timer}s
          </button>

          <button
            id="btn-auto-shoot"
            className={styles.autoBtn}
            onClick={onAutoShoot}
            disabled={disabled}
            title="Isi semua slot otomatis"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
            Auto
          </button>
        </div>
      )}

      <p className={styles.statusText}>
        {!isReady
          ? 'Menunggu kamera...'
          : isCountingDown
          ? 'Bersiap-siap...'
          : allSlotsFilled
          ? 'Semua slot terisi — lihat hasil di atas'
          : 'Klik Ambil Foto atau gunakan timer'}
      </p>
    </div>
  );
}
