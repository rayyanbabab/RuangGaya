'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

export interface NLM { x: number; y: number; z?: number }
export type FaceLandmarksResult = NLM[][];

/**
 * Patterns emitted by MediaPipe/TFLite WASM that are purely informational
 * but unfortunately routed through console.error.
 */
const MEDIAPIPE_INFO_PATTERNS = [
  'XNNPACK',
  'TensorFlow Lite',
  'INFO:',
  'Created TensorFlow',
];

function isMediaPipeInfo(args: unknown[]): boolean {
  const msg = String(args[0] ?? '');
  return MEDIAPIPE_INFO_PATTERNS.some((p) => msg.includes(p));
}

export function useFaceDetection(enabled: boolean) {
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [isModelReady, setIsModelReady]     = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const landmarkerRef    = useRef<any>(null);
  const lastVideoTimeRef = useRef(-1);

  // ── Suppress MediaPipe INFO logs that come through console.error ──────────
  // The WASM module emits "INFO: Created TensorFlow Lite XNNPACK delegate for
  // CPU" via console.error on every first detectForVideo call per session.
  // We install a persistent filter at the module level while the filter is
  // enabled, rather than patching per-call (which WASM bypasses).
  useEffect(() => {
    if (!enabled) return;

    const origError = console.error.bind(console);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    console.error = (...args: any[]) => {
      if (isMediaPipeInfo(args)) return; // swallow
      origError(...args);
    };

    return () => {
      console.error = origError; // restore on disable / unmount
    };
  }, [enabled]);

  // ── Load MediaPipe Face Landmarker model ─────────────────────────────────
  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;

    async function loadModel() {
      setIsModelLoading(true);
      try {
        const { FaceLandmarker, FilesetResolver } =
          await import('@mediapipe/tasks-vision');

        const filesetResolver = await FilesetResolver.forVisionTasks(
          'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm'
        );

        const faceLandmarker = await FaceLandmarker.createFromOptions(
          filesetResolver,
          {
            baseOptions: {
              modelAssetPath:
                'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task',
              delegate: 'GPU',
            },
            outputFaceBlendshapes: false,
            runningMode: 'VIDEO',
            numFaces: 1,
          }
        );

        if (!cancelled) {
          landmarkerRef.current = faceLandmarker;
          setIsModelReady(true);
          setIsModelLoading(false);
        }
      } catch (err) {
        // Use the real console.error directly here (model load failure IS an error)
        const msg = err instanceof Error ? err.message : String(err);
        // eslint-disable-next-line no-console
        window.console.error('[FaceLandmarker] load failed:', msg);
        if (!cancelled) setIsModelLoading(false);
      }
    }

    loadModel();
    return () => { cancelled = true; };
  }, [enabled]);

  // ── Cleanup landmarker on unmount ─────────────────────────────────────────
  useEffect(() => {
    return () => {
      landmarkerRef.current?.close?.();
    };
  }, []);

  // ── Detect faces in a video frame ─────────────────────────────────────────
  const detectFaces = useCallback(
    (video: HTMLVideoElement): FaceLandmarksResult => {
      const lm = landmarkerRef.current;
      if (!lm || !isModelReady) return [];
      if (video.readyState < 2 || video.paused) return [];

      // Deduplicate: skip if video hasn't advanced to a new frame
      // (allow ct===0 to process the very first frame)
      const ct = video.currentTime;
      if (ct === lastVideoTimeRef.current && ct !== 0) return [];
      lastVideoTimeRef.current = ct;

      try {
        const result = lm.detectForVideo(video, performance.now());
        return (result.faceLandmarks as NLM[][]) ?? [];
      } catch {
        return [];
      }
    },
    [isModelReady]
  );

  return { isModelLoading, isModelReady, detectFaces };
}
