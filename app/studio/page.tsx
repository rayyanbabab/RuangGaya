'use client';

import { usePhotobooth } from '@/hooks/usePhotobooth';
import { useWebcam } from '@/hooks/useWebcam';
import { TEMPLATES, FRAMES, FILTERS, TIMER_OPTIONS } from '@/lib/config';
import Viewfinder from './components/Viewfinder';
import Sidebar from './components/Sidebar';
import SlotStrip from './components/SlotStrip';
import StudioControls from './components/StudioControls';
import ResultPreview from './components/ResultPreview';
import styles from './studio.module.css';

export default function StudioPage() {
  const webcam = useWebcam();
  const booth = usePhotobooth();

  const allSlotsFilled = booth.slots.every((s) => s !== null);
  const isReviewMode = allSlotsFilled && !booth.isCountingDown;

  const handleCapture = () => {
    if (!webcam.videoRef.current || !webcam.isReady) return;
    booth.capturePhoto(webcam.videoRef.current);
  };
  const handleTimedCapture = () => {
    if (!webcam.videoRef.current || !webcam.isReady) return;
    booth.startTimedCapture(webcam.videoRef.current);
  };
  const handleAutoShoot = () => {
    if (!webcam.videoRef.current || !webcam.isReady) return;
    booth.startAutoShoot(webcam.videoRef.current);
  };

  return (
    <div className={styles.studio}>
      <header className={styles.header}>
        <a href="/" className={styles.backLink}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          <span className={styles.backLinkText}>RuangGaya</span>
        </a>

        <div className={styles.headerCenter}>
          <div className={`${styles.modePill} ${isReviewMode ? styles.reviewMode : styles.shootMode}`}>
            {isReviewMode ? 'Mode Edit' : 'Mode Kamera'}
          </div>
        </div>

        <div className={styles.headerRight}>
          <div className={`${styles.camStatus} ${webcam.isReady ? styles.camOk : webcam.error ? styles.camErr : ''}`}>
            <span className={styles.camDot} />
            <span className={styles.camStatusText}>
              {webcam.isReady ? 'Kamera aktif' : webcam.error ? 'Error' : 'Memuat...'}
            </span>
          </div>
        </div>
      </header>

      {/* ── Body ── */}
      <div className={styles.body}>
        {/* Main area */}
        <div className={styles.main}>
          {isReviewMode ? (
            /* ── Review/Edit Mode ── */
            <div className={styles.reviewArea}>
              <div className={styles.reviewHeader}>
                <span className={styles.reviewTitle}>Semua foto siap — edit sebelum download</span>
                {/* <button className={styles.backToShootBtn} onClick={booth.resetAll}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.5"/></svg>
                  Foto Ulang
                </button> */}
              </div>
              <ResultPreview
                slots={booth.slots as string[]}
                template={booth.activeTemplate}
                frame={booth.activeFrame}
                stripText={booth.stripText}
                stripTextColor={booth.stripTextColor}
                filter={booth.filter}
                stickers={booth.stickers}
                updateSticker={booth.updateSticker}
                removeSticker={booth.removeSticker}
                onReset={booth.resetAll}
              />
            </div>
          ) : (
            /* ── Shoot Mode ── */
            <>
              <Viewfinder
                videoRef={webcam.videoRef}
                isReady={webcam.isReady}
                error={webcam.error}
                filter={booth.filter}
                isCountingDown={booth.isCountingDown}
                countdown={booth.countdown}
              />

              <SlotStrip
                slots={booth.slots}
                activeSlot={booth.activeSlot}
                cols={booth.activeTemplate.cols}
                onSlotClick={booth.setActiveSlot}
              />

              <StudioControls
                isReady={webcam.isReady}
                isCountingDown={booth.isCountingDown}
                autoShoot={booth.autoShoot}
                timer={booth.timer}
                timerOptions={[...TIMER_OPTIONS]}
                allSlotsFilled={allSlotsFilled}
                onCapture={handleCapture}
                onTimedCapture={handleTimedCapture}
                onAutoShoot={handleAutoShoot}
                onTimerChange={booth.setTimer}
                onAutoShootToggle={() => booth.setAutoShoot(!booth.autoShoot)}
                onReset={booth.resetAll}
                onCancelCountdown={booth.cancelCountdown}
              />
            </>
          )}
        </div>

        {/* Sidebar — always visible */}
        <Sidebar
          templates={[...TEMPLATES]}
          frames={[...FRAMES]}
          filters={[...FILTERS]}
          activeTemplate={booth.activeTemplate}
          activeFrame={booth.activeFrame}
          activeFilter={booth.filter}
          stripText={booth.stripText}
          stripTextColor={booth.stripTextColor}
          timer={booth.timer}
          timerOptions={[...TIMER_OPTIONS]}
          autoShoot={booth.autoShoot}
          isReviewMode={isReviewMode}
          onTemplateChange={booth.setTemplate}
          onFrameChange={booth.setFrame}
          onFilterChange={booth.setFilter}
          onStripTextChange={booth.setStripText}
          onStripTextColorChange={booth.setStripTextColor}
          onTimerChange={booth.setTimer}
          onAutoShootToggle={() => booth.setAutoShoot(!booth.autoShoot)}
          addSticker={booth.addSticker}
        />
      </div>
    </div>
  );
}
