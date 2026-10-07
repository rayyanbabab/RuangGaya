'use client';

import { Suspense, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { usePhotobooth } from '@/hooks/usePhotobooth';
import { useWebcam } from '@/hooks/useWebcam';
import {
  TEMPLATES,
  FRAMES,
  FILTERS,
  TIMER_OPTIONS,
  getTemplateById,
  getFrameById,
} from '@/lib/config';
import Viewfinder, { type ViewfinderHandle } from './components/Viewfinder';
import Sidebar from './components/Sidebar';
import SlotStrip from './components/SlotStrip';
import StudioControls from './components/StudioControls';
import ResultPreview from './components/ResultPreview';
import EditStudio from './components/EditStudio';
import styles from './studio.module.css';

function StudioContent() {
  const webcam = useWebcam();
  const booth = usePhotobooth();
  const searchParams = useSearchParams();

  // Ref to Viewfinder so we can grab the face-filter canvas at capture time
  const viewfinderRef = useRef<ViewfinderHandle>(null);

  // Sync template and frame from URL query params (e.g. from /template-selection)
  useEffect(() => {
    const tmplParam = searchParams.get('template');
    const frameParam = searchParams.get('frame');

    if (tmplParam) {
      const foundTmpl = getTemplateById(tmplParam);
      if (foundTmpl && foundTmpl.id !== booth.activeTemplate.id) {
        booth.setTemplate(foundTmpl);
      }
    }

    if (frameParam) {
      const foundFrame = getFrameById(frameParam);
      if (foundFrame && foundFrame.id !== booth.activeFrame.id) {
        booth.setFrame(foundFrame);
      }
    }
  }, [searchParams]);

  const allSlotsFilled = booth.slots.every((s) => s !== null);
  const isReviewMode = allSlotsFilled && !booth.isCountingDown;

  /** Get current face-filter canvas from the viewfinder overlay */
  const getFaceCanvas = () => viewfinderRef.current?.getFaceFilterCanvas() ?? null;

  const handleCapture = () => {
    if (!webcam.videoRef.current || !webcam.isReady) return;
    booth.capturePhoto(webcam.videoRef.current, getFaceCanvas());
  };
  const handleTimedCapture = () => {
    if (!webcam.videoRef.current || !webcam.isReady) return;
    // Pass live getter so shutter gets face canvas at countdown end
    booth.startTimedCapture(webcam.videoRef.current, getFaceCanvas);
  };
  const handleAutoShoot = () => {
    if (!webcam.videoRef.current || !webcam.isReady) return;
    // Pass live getter so every auto-shot gets fresh face canvas
    booth.startAutoShoot(webcam.videoRef.current, getFaceCanvas);
  };

  return (
    <div className={styles.studio}>
      {/* ── Studio Header ── */}
      <header className={styles.header}>
        <a href="/" className={styles.backLink} aria-label="Kembali ke beranda">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          <span className={styles.backLinkText}>RuangGaya</span>
        </a>

        <div className={styles.headerCenter}>
          <div className={`${styles.modePill} ${isReviewMode ? styles.reviewMode : styles.shootMode}`}>
            {isReviewMode ? '✨ Edit Studio' : '📸 Mode Kamera'}
          </div>
        </div>

        <div className={styles.headerRight}>
          {isReviewMode ? (
            <div className={styles.camStatus} style={{ background: 'var(--rg-purple-light)', borderColor: 'var(--rg-purple-border)' }}>
              <span className={styles.camDot} style={{ background: 'var(--rg-purple)', boxShadow: '0 0 6px rgba(142,54,255,0.6)' }} />
              <span className={styles.camStatusText} style={{ color: 'var(--rg-purple)' }}>
                {booth.slots.length} Foto Siap
              </span>
            </div>
          ) : (
            <div className={`${styles.camStatus} ${webcam.isReady ? styles.camOk : webcam.error ? styles.camErr : ''}`}>
              <span className={styles.camDot} />
              <span className={styles.camStatusText}>
                {webcam.isReady ? 'Kamera aktif' : webcam.error ? 'Error' : 'Memuat...'}
              </span>
            </div>
          )}
        </div>
      </header>

      {/* ── Body ── */}
      {isReviewMode ? (
        /* ── Full Jepreto-Style Edit Studio Mode ── */
        <EditStudio
          slots={booth.slots as string[]}
          template={booth.activeTemplate}
          frame={booth.activeFrame}
          filter={booth.filter}
          stripText={booth.stripText}
          stripTextColor={booth.stripTextColor}
          stripTextFont={booth.stripTextFont}
          stripTextSize={booth.stripTextSize}
          stripTextPosition={booth.stripTextPosition}
          stickers={booth.stickers}
          templates={[...TEMPLATES]}
          frames={[...FRAMES]}
          filters={[...FILTERS]}
          onTemplateChange={booth.setTemplate}
          onFrameChange={booth.setFrame}
          onFilterChange={booth.setFilter}
          onStripTextChange={booth.setStripText}
          onStripTextColorChange={booth.setStripTextColor}
          onStripTextFontChange={booth.setStripTextFont}
          onStripTextSizeChange={booth.setStripTextSize}
          onStripTextPositionChange={booth.setStripTextPosition}
          addSticker={booth.addSticker}
          updateSticker={booth.updateSticker}
          removeSticker={booth.removeSticker}
          clearStickers={booth.clearStickers}
          onReset={booth.resetAll}
        />
      ) : (
        /* ── Shoot Mode ── */
        <div className={styles.body}>
          {/* Main area */}
          <div className={styles.main}>
            <Viewfinder
              ref={viewfinderRef}
              videoRef={webcam.videoRef}
              isReady={webcam.isReady}
              error={webcam.error}
              filter={booth.filter}
              isCountingDown={booth.isCountingDown}
              countdown={booth.countdown}
              isFlashing={booth.isFlashing}
              faceFilter={booth.faceFilter}
            />

            <StudioControls
              isReady={webcam.isReady}
              isCountingDown={booth.isCountingDown}
              autoShoot={booth.autoShoot}
              timer={booth.timer}
              onCapture={handleCapture}
              onTimedCapture={handleTimedCapture}
              onAutoShoot={handleAutoShoot}
              onCancelCountdown={booth.cancelCountdown}
            />

            <SlotStrip
              slots={booth.slots}
              activeSlot={booth.activeSlot}
              cols={booth.activeTemplate.cols}
              onSlotClick={booth.setActiveSlot}
            />
          </div>

          {/* Sidebar Controls */}
          <Sidebar
            templates={[...TEMPLATES]}
            frames={[...FRAMES]}
            filters={[...FILTERS]}
            activeTemplate={booth.activeTemplate}
            activeFrame={booth.activeFrame}
            activeFilter={booth.filter}
            stripText={booth.stripText}
            stripTextColor={booth.stripTextColor}
            stripTextFont={booth.stripTextFont}
            stripTextSize={booth.stripTextSize}
            stripTextPosition={booth.stripTextPosition}
            faceFilter={booth.faceFilter}
            timer={booth.timer}
            timerOptions={[...TIMER_OPTIONS]}
            autoShoot={booth.autoShoot}
            isReviewMode={isReviewMode}
            onTemplateChange={booth.setTemplate}
            onFrameChange={booth.setFrame}
            onFilterChange={booth.setFilter}
            onStripTextChange={booth.setStripText}
            onStripTextColorChange={booth.setStripTextColor}
            onStripTextFontChange={booth.setStripTextFont}
            onStripTextSizeChange={booth.setStripTextSize}
            onStripTextPositionChange={booth.setStripTextPosition}
            onFaceFilterChange={booth.setFaceFilter}
            onTimerChange={booth.setTimer}
            onAutoShootToggle={() => booth.setAutoShoot(!booth.autoShoot)}
            addSticker={booth.addSticker}
            stickerCount={booth.stickers.length}
            onClearStickers={booth.clearStickers}
          />
        </div>
      )}
    </div>
  );
}

export default function StudioPage() {
  return (
    <Suspense
      fallback={
        <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className={styles.loadingSpinner} />
        </div>
      }
    >
      <StudioContent />
    </Suspense>
  );
}
