'use client';

import { useState, useCallback, useRef } from 'react';
import {
  TEMPLATES, FRAMES, FILTERS, TIMER_OPTIONS,
  Template, Frame, FilterType, TimerOption, StickerItem,
} from '@/lib/config';
import { captureRawFrame } from '@/lib/capture';

interface PhotoboothState {
  activeTemplate: Template;
  activeFrame: Frame;
  filter: FilterType;
  stripText: string;
  stripTextColor: string;
  slots: (string | null)[];       // raw (unfiltered) captures
  activeSlot: number;
  timer: TimerOption;
  autoShoot: boolean;
  isCountingDown: boolean;
  countdown: number;
  isComplete: boolean;
  stickers: StickerItem[];
}

interface PhotoboothActions {
  setTemplate: (t: Template) => void;
  setFrame: (f: Frame) => void;
  setFilter: (f: FilterType) => void;
  setStripText: (s: string) => void;
  setStripTextColor: (c: string) => void;
  setActiveSlot: (i: number) => void;
  setTimer: (t: TimerOption) => void;
  setAutoShoot: (v: boolean) => void;
  capturePhoto: (video: HTMLVideoElement) => void;
  startTimedCapture: (video: HTMLVideoElement) => void;
  startAutoShoot: (video: HTMLVideoElement) => void;
  resetAll: () => void;
  cancelCountdown: () => void;
  addSticker: (src: string) => void;
  updateSticker: (id: string, updates: Partial<StickerItem>) => void;
  removeSticker: (id: string) => void;
  clearStickers: () => void;
}

export function usePhotobooth(): PhotoboothState & PhotoboothActions {
  const defaultTemplate = TEMPLATES[1]; // 3×1
  const [activeTemplate, setActiveTemplate] = useState<Template>(defaultTemplate);
  const [activeFrame, setActiveFrame] = useState<Frame>(FRAMES[0]);
  const [filter, setFilter] = useState<FilterType>('Normal');
  const [stripText, setStripText] = useState('');
  const [stripTextColor, setStripTextColor] = useState('#000000');
  const [slots, setSlots] = useState<(string | null)[]>(Array(defaultTemplate.slots).fill(null));
  const [activeSlot, setActiveSlotState] = useState(0);
  const [timer, setTimer] = useState<TimerOption>(3);
  const [autoShoot, setAutoShoot] = useState(false);
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [stickers, setStickers] = useState<StickerItem[]>([]);

  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const autoShootRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelCountdown = useCallback(() => {
    if (countdownRef.current) clearInterval(countdownRef.current);
    if (autoShootRef.current) clearTimeout(autoShootRef.current);
    setIsCountingDown(false);
    setCountdown(0);
  }, []);

  const setTemplate = useCallback((t: Template) => {
    setActiveTemplate(t);
    setSlots(Array(t.slots).fill(null));
    setActiveSlotState(0);
    setIsComplete(false);
  }, []);

  const setFrame = useCallback((f: Frame) => setActiveFrame(f), []);
  const setActiveSlot = useCallback((i: number) => {
    setActiveSlotState(i);
    setIsComplete(false);
  }, []);

  // Raw capture — filter applied at render time
  const doCapture = useCallback((video: HTMLVideoElement, slotIndex: number) => {
    const dataURL = captureRawFrame(video);
    setSlots((prev) => {
      const next = [...prev];
      next[slotIndex] = dataURL;
      return next;
    });
  }, []);

  const advanceSlot = useCallback((currentSlot: number, currentSlots: (string | null)[]) => {
    const nextEmpty = currentSlots.findIndex((s, i) => i > currentSlot && s === null);
    if (nextEmpty !== -1) {
      setActiveSlotState(nextEmpty);
    } else {
      const allFilled = currentSlots.every((s) => s !== null);
      if (allFilled) setIsComplete(true);
    }
  }, []);

  const capturePhoto = useCallback((video: HTMLVideoElement) => {
    // Capture exactly once — store in local var, then update state
    const dataURL = captureRawFrame(video);
    setSlots((prev) => {
      const next = [...prev];
      next[activeSlot] = dataURL;
      advanceSlot(activeSlot, next);
      return next;
    });
  }, [activeSlot, advanceSlot]);

  const startTimedCapture = useCallback((video: HTMLVideoElement) => {
    if (isCountingDown) return;
    cancelCountdown();
    setIsCountingDown(true);
    setCountdown(timer);
    let remaining = timer;
    countdownRef.current = setInterval(() => {
      remaining -= 1;
      setCountdown(remaining);
      if (remaining <= 0) {
        clearInterval(countdownRef.current!);
        setIsCountingDown(false);
        capturePhoto(video);
      }
    }, 1000);
  }, [isCountingDown, timer, cancelCountdown, capturePhoto]);

  const startAutoShoot = useCallback((video: HTMLVideoElement) => {
    if (isCountingDown) { cancelCountdown(); return; }
    const emptyIndices = slots.map((s, i) => (s === null ? i : -1)).filter((i) => i !== -1);
    if (emptyIndices.length === 0) return;
    let idx = 0;
    const shootNext = () => {
      if (idx >= emptyIndices.length) return;
      const slotIdx = emptyIndices[idx];
      setActiveSlotState(slotIdx);
      setIsCountingDown(true);
      setCountdown(timer);
      let remaining = timer;
      countdownRef.current = setInterval(() => {
        remaining -= 1;
        setCountdown(remaining);
        if (remaining <= 0) {
          clearInterval(countdownRef.current!);
          setIsCountingDown(false);
          doCapture(video, slotIdx);
          idx += 1;
          if (idx < emptyIndices.length) {
            autoShootRef.current = setTimeout(shootNext, 800);
          } else {
            setIsComplete(true);
          }
        }
      }, 1000);
    };
    shootNext();
  }, [isCountingDown, cancelCountdown, slots, timer, doCapture]);

  const resetAll = useCallback(() => {
    cancelCountdown();
    setSlots(Array(activeTemplate.slots).fill(null));
    setActiveSlotState(0);
    setIsComplete(false);
    setStickers([]); // clear stickers on retake
  }, [activeTemplate, cancelCountdown]);

  const addSticker = useCallback((src: string) => {
    setStickers((prev) => [
      ...prev,
      {
        id: `sticker-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        src,
        width: 150, // Default size
        height: 150,
        transform: `translate(100px, 100px) rotate(0deg)`,
      },
    ]);
  }, []);

  const updateSticker = useCallback((id: string, updates: Partial<StickerItem>) => {
    setStickers((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
  }, []);

  const removeSticker = useCallback((id: string) => {
    setStickers((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const clearStickers = useCallback(() => setStickers([]), []);

  return {
    activeTemplate, activeFrame, filter, stripText, stripTextColor, slots, activeSlot,
    timer, autoShoot, isCountingDown, countdown, isComplete,
    stickers,
    setTemplate, setFrame, setFilter: (f: FilterType) => setFilter(f),
    setStripText, setStripTextColor, setActiveSlot, setTimer, setAutoShoot,
    capturePhoto, startTimedCapture, startAutoShoot, resetAll, cancelCountdown,
    addSticker, updateSticker, removeSticker, clearStickers,
  };
}
