// sound.js
let audioCtx = null;

function getCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === "suspended") audioCtx.resume();
  return audioCtx;
}

// Short burst of filtered noise — reads as a crisp mechanical "tick"
function noiseBurst(ctx, { freq = 2200, q = 6, duration = 0.035, gain = 0.50 }) {
  const bufferSize = ctx.sampleRate * duration;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  const source = ctx.createBufferSource();
  source.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = freq;
  filter.Q.value = q;

  const g = ctx.createGain();
  g.gain.setValueAtTime(gain, ctx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

  source.connect(filter).connect(g).connect(ctx.destination);
  source.start();
}

export function playHoverSound() {
  const ctx = getCtx();
  noiseBurst(ctx, {
    freq: 2600 + Math.random() * 300,
    q: 8,
    duration: 0.06,
    gain: 0.8
  });
}

export function playClickSound() {
  const ctx = getCtx();
  noiseBurst(ctx, {
    freq: 1400,
    q: 4,
    duration: 0.09,
    gain: 1.0
  });
}
