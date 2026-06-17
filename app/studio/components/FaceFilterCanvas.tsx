'use client';

import {
  useRef, useEffect, forwardRef, useImperativeHandle, useCallback,
} from 'react';
import { useFaceDetection } from '@/hooks/useFaceDetection';
import { drawFaceFilter } from '@/lib/face-filters';
import type { FaceFilterId } from '@/lib/config';
import type { NLM } from '@/hooks/useFaceDetection';
import styles from './FaceFilterCanvas.module.css';

export interface FaceFilterCanvasHandle {
  /**
   * Returns a stable snapshot canvas with the last successfully drawn filter.
   * Used at capture time — avoids the race condition where the live canvas
   * might be cleared mid-frame.
   */
  getCanvas: () => HTMLCanvasElement | null;
}

interface Props {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  isVideoReady: boolean;
  filterId: FaceFilterId;
}

const FaceFilterCanvas = forwardRef<FaceFilterCanvasHandle, Props>(
  ({ videoRef, isVideoReady, filterId }, ref) => {
    // Live canvas for real-time display
    const canvasRef      = useRef<HTMLCanvasElement>(null);
    // Snapshot canvas — updated only when we have valid landmarks (used at capture)
    const snapshotRef    = useRef<HTMLCanvasElement | null>(null);
    // Last known landmarks — prevents flickering between detection frames
    const lastLandmarks  = useRef<NLM[]>([]);
    const rafRef         = useRef<number>(0);
    const enabled        = filterId !== 'none';

    const { isModelLoading, isModelReady, detectFaces } = useFaceDetection(enabled);

    useImperativeHandle(ref, () => ({
      getCanvas: () => snapshotRef.current,
    }));

    // Reset cached landmarks when filter changes
    useEffect(() => {
      lastLandmarks.current = [];
      snapshotRef.current   = null;
    }, [filterId]);

    const loop = useCallback(() => {
      const canvas = canvasRef.current;
      const video  = videoRef.current;
      if (!canvas || !video) {
        rafRef.current = requestAnimationFrame(loop);
        return;
      }

      // Keep canvas size in sync with the video element
      const vw = video.clientWidth  || canvas.width;
      const vh = video.clientHeight || canvas.height;

      // Only resize when dimensions actually change (resizing clears the canvas)
      if (canvas.width !== vw || canvas.height !== vh) {
        canvas.width  = vw;
        canvas.height = vh;
        // Clear cached landmarks so the resized canvas gets a fresh draw
        lastLandmarks.current = [];
      }

      const ctx = canvas.getContext('2d');
      if (!ctx) { rafRef.current = requestAnimationFrame(loop); return; }

      // Try to detect faces this frame
      const faces = detectFaces(video);
      if (faces.length > 0) {
        lastLandmarks.current = faces[0]; // cache latest landmarks
      }

      // Draw using cached landmarks — prevents flickering on frames where
      // detection returns [] (e.g., duplicate currentTime, model still warming up)
      if (lastLandmarks.current.length > 0) {
        ctx.clearRect(0, 0, vw, vh);
        drawFaceFilter(ctx, lastLandmarks.current, vw, vh, filterId, video);

        // Keep snapshot canvas up-to-date for capture compositing
        if (!snapshotRef.current || snapshotRef.current.width !== vw || snapshotRef.current.height !== vh) {
          const snap = document.createElement('canvas');
          snap.width  = vw;
          snap.height = vh;
          snapshotRef.current = snap;
        }
        const snapCtx = snapshotRef.current.getContext('2d');
        if (snapCtx) {
          snapCtx.clearRect(0, 0, vw, vh);
          snapCtx.drawImage(canvas, 0, 0);
        }
      }

      rafRef.current = requestAnimationFrame(loop);
    }, [videoRef, detectFaces, filterId]);

    useEffect(() => {
      if (!enabled || !isVideoReady || !isModelReady) {
        // Clear display canvas and cached data when disabled
        const canvas = canvasRef.current;
        if (canvas) canvas.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height);
        lastLandmarks.current = [];
        snapshotRef.current   = null;
        return;
      }

      rafRef.current = requestAnimationFrame(loop);
      return () => cancelAnimationFrame(rafRef.current);
    }, [enabled, isVideoReady, isModelReady, loop]);

    if (!enabled) return null;

    return (
      <div className={styles.wrap} aria-hidden="true">
        {isModelLoading && (
          <div className={styles.loadingBadge}>
            <span className={styles.spinner} />
            <span>Memuat AI filter...</span>
          </div>
        )}
        {/* Display canvas — CSS-mirrored to match the video element */}
        <canvas ref={canvasRef} className={styles.canvas} />
      </div>
    );
  }
);

FaceFilterCanvas.displayName = 'FaceFilterCanvas';
export default FaceFilterCanvas;
