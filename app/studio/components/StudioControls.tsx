'use client';

import { useEffect } from 'react';
import { TimerOption } from '@/lib/config';
import styles from './StudioControls.module.css';

interface StudioControlsProps {
  isReady: boolean;
  isCountingDown: boolean;
  autoShoot: boolean;
  timer: TimerOption;
  timerOptions?: readonly number[];
  allSlotsFilled?: boolean;
  onCapture: () => void;
  onTimedCapture: () => void;
  onAutoShoot: () => void;
  onTimerChange?: (t: TimerOption) => void;
  onAutoShootToggle?: () => void;
  onReset?: () => void;
  onCancelCountdown: () => void;
}

export default function StudioControls({
  isReady,
  isCountingDown,
  autoShoot,
  timer,
  allSlotsFilled = false,
  onCapture,
  onTimedCapture,
  onAutoShoot,
  onCancelCountdown,
}: StudioControlsProps) {
  const disabled = !isReady || allSlotsFilled;

  // Spacebar keyboard shortcut for photobooth capture
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      )
        return;

      if (e.code === 'Space') {
        e.preventDefault();
        if (isCountingDown) {
          onCancelCountdown();
        } else if (!disabled) {
          if (timer > 0) {
            onTimedCapture();
          } else {
            onCapture();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCountingDown, disabled, timer, onCancelCountdown, onTimedCapture, onCapture]);

  return (
    <div className={styles.controls}>
      {isCountingDown ? (
        <button id="btn-cancel" className={styles.cancelBtn} onClick={onCancelCountdown}>
          ✕ Batalkan Countdown
        </button>
      ) : (
        <div className={styles.btnRow}>
          <button
            id="btn-capture"
            className={styles.captureBtn}
            onClick={timer > 0 ? onTimedCapture : onCapture}
            disabled={disabled}
            title="Klik atau tekan Spasi untuk ambil foto"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <circle cx="12" cy="12" r="4" />
              <path d="M20 20H4a2 2 0 01-2-2V8a2 2 0 012-2h2l2-3h8l2 3h2a2 2 0 012 2v10a2 2 0 01-2 2z" />
            </svg>
            <span>Ambil Foto</span>
            <span className={styles.spaceBadge}>Spasi</span>
          </button>

          <button
            id="btn-timer-capture"
            className={styles.timerCaptureBtn}
            onClick={onTimedCapture}
            disabled={disabled}
            title={`Foto dengan timer ${timer} detik`}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span>{timer}s</span>
          </button>

          <button
            id="btn-auto-shoot"
            className={`${styles.autoBtn} ${autoShoot ? styles.autoActive : ''}`}
            onClick={onAutoShoot}
            disabled={disabled}
            title="Ambil semua pose berturut-turut secara otomatis"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            <span>Auto</span>
          </button>
        </div>
      )}
    </div>
  );
}

