"use client";
import { useEffect, useRef } from "react";

export function useRainLayer(ctx, volume) {
  const gainRef = useRef(null);

  useEffect(() => {
    if (!ctx) return;

    // Master volume for the whole rain layer
    const gain = ctx.createGain();
    gain.gain.value = 0;
    gain.connect(ctx.destination);

    // ---------- 1. Background wash (distant rain) ----------
    const washBuffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const wash = washBuffer.getChannelData(0);
    for (let i = 0; i < wash.length; i++) {
      wash[i] = (Math.random() * 2 - 1) * 0.06;
    }

    const washSource = ctx.createBufferSource();
    washSource.buffer = washBuffer;
    washSource.loop = true;

    const highpass = ctx.createBiquadFilter();
    highpass.type = "highpass";
    highpass.frequency.value = 400; // remove the low rumble

    const lowpass = ctx.createBiquadFilter();
    lowpass.type = "lowpass";
    lowpass.frequency.value = 3000; // remove the harsh hiss

    washSource.connect(highpass).connect(lowpass).connect(gain);
    washSource.start();

    // ---------- 2. A single drop: a tiny burst of noise that dies away fast ----------
    const dropLength = Math.floor(ctx.sampleRate * 0.03); // 30 milliseconds
    const dropBuffer = ctx.createBuffer(1, dropLength, ctx.sampleRate);
    const drop = dropBuffer.getChannelData(0);
    const decay = ctx.sampleRate * 0.004;
    for (let i = 0; i < dropLength; i++) {
      drop[i] = (Math.random() * 2 - 1) * Math.exp(-i / decay);
    }

    function playDrop() {
      const src = ctx.createBufferSource();
      src.buffer = dropBuffer;

      // Each drop gets its own random tone, loudness and position
      const tone = ctx.createBiquadFilter();
      tone.type = "bandpass";
      tone.frequency.value = 1500 + Math.random() * 5000;
      tone.Q.value = 2 + Math.random() * 6;

      const level = ctx.createGain();
      level.gain.value = 0.05 + Math.random() * 0.25;

      const pan = ctx.createStereoPanner();
      pan.pan.value = Math.random() * 2 - 1; // -1 = left, 1 = right

      src.connect(tone).connect(level).connect(pan).connect(gain);
      src.start();
    }

    // ---------- 3. An occasional "plink": a drop landing in a puddle ----------
    function playPlink() {
      const t = ctx.currentTime;
      const startFreq = 2000 + Math.random() * 2000;

      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(startFreq, t);
      osc.frequency.exponentialRampToValueAtTime(startFreq * 0.5, t + 0.05);

      const env = ctx.createGain();
      env.gain.setValueAtTime(0.08, t);
      env.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

      const pan = ctx.createStereoPanner();
      pan.pan.value = Math.random() * 2 - 1;

      osc.connect(env).connect(pan).connect(gain);
      osc.start(t);
      osc.stop(t + 0.1);
    }

    // ---------- 4. Keep dropping at random intervals ----------
    let timeoutId;
    function scheduleNext() {
      if (ctx.state === "running") {
        playDrop();
        if (Math.random() < 0.04) playPlink();
      }
      timeoutId = setTimeout(scheduleNext, 5 + Math.random() * 35);
    }
    scheduleNext();

    gainRef.current = gain;

    return () => {
      clearTimeout(timeoutId);
      washSource.stop();
      gain.disconnect();
      gainRef.current = null;
    };
  }, [ctx]);

  useEffect(() => {
    if (!ctx || !gainRef.current) return;
    gainRef.current.gain.setTargetAtTime(volume, ctx.currentTime, 0.5);
  }, [ctx, volume]);
}