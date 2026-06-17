/**
 * RuangGaya — Sound Effects via Web Audio API
 * No external files needed — synthesizes sounds in-browser.
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioCtx;
}

/**
 * Plays a camera shutter "click" sound synthesized via Web Audio API.
 * Mimics a real mechanical shutter: a sharp high-freq click + short low-freq thud.
 */
export function playShutterSound(): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  // Resume context if suspended (browser autoplay policy)
  if (ctx.state === 'suspended') {
    ctx.resume();
  }

  const now = ctx.currentTime;

  // ── High-pitched click (the "shutter blade") ──────────────────
  const clickOsc = ctx.createOscillator();
  const clickGain = ctx.createGain();
  clickOsc.type = 'sine';
  clickOsc.frequency.setValueAtTime(1200, now);
  clickOsc.frequency.exponentialRampToValueAtTime(400, now + 0.04);
  clickGain.gain.setValueAtTime(0.6, now);
  clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
  clickOsc.connect(clickGain);
  clickGain.connect(ctx.destination);
  clickOsc.start(now);
  clickOsc.stop(now + 0.07);

  // ── Low-pitched thud (the "mirror slap") ──────────────────────
  const thudOsc = ctx.createOscillator();
  const thudGain = ctx.createGain();
  thudOsc.type = 'sine';
  thudOsc.frequency.setValueAtTime(90, now + 0.02);
  thudOsc.frequency.exponentialRampToValueAtTime(40, now + 0.12);
  thudGain.gain.setValueAtTime(0.4, now + 0.02);
  thudGain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
  thudOsc.connect(thudGain);
  thudGain.connect(ctx.destination);
  thudOsc.start(now + 0.02);
  thudOsc.stop(now + 0.15);

  // ── Noise burst for texture ────────────────────────────────────
  const bufferSize = ctx.sampleRate * 0.05;
  const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = noiseBuffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  const noiseSource = ctx.createBufferSource();
  noiseSource.buffer = noiseBuffer;
  const noiseGain = ctx.createGain();
  noiseGain.gain.setValueAtTime(0.15, now);
  noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
  noiseSource.connect(noiseGain);
  noiseGain.connect(ctx.destination);
  noiseSource.start(now);
  noiseSource.stop(now + 0.05);
}
