"use client";
import { useEffect, useRef } from "react";

export function usePadLayer(ctx, volume) {
  const gainRef = useRef(null);

  useEffect(() => {
    if (!ctx) return;

    // Final volume knob
    const gain = ctx.createGain();
    gain.gain.value = 0;

    // Soften the tone
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 800;

    // Keep the combined oscillators from getting too loud
    const mix = ctx.createGain();
    mix.gain.value = 0.08;

    mix.connect(filter).connect(gain).connect(ctx.destination);

    // A soft A-minor chord: A2, E3, A3, C4
    const notes = [110, 164.81, 220, 261.63];

    // Two oscillators per note, slightly detuned for a warm, shimmery sound
    const oscillators = notes.flatMap((freq) =>
      [-7, 7].map((detune) => {
        const osc = ctx.createOscillator();
        osc.type = "sawtooth";
        osc.frequency.value = freq;
        osc.detune.value = detune;
        osc.connect(mix);
        osc.start();
        return osc;
      })
    );

    // A very slow wobble on the filter makes the pad "breathe"
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.08; // one cycle every ~12 seconds
    const lfoDepth = ctx.createGain();
    lfoDepth.gain.value = 400;
    lfo.connect(lfoDepth).connect(filter.frequency);
    lfo.start();

    gainRef.current = gain;

    return () => {
      oscillators.forEach((osc) => osc.stop());
      lfo.stop();
      gain.disconnect();
      gainRef.current = null;
    };
  }, [ctx]);

  useEffect(() => {
    if (!ctx || !gainRef.current) return;
    gainRef.current.gain.setTargetAtTime(volume, ctx.currentTime, 0.5);
  }, [ctx, volume]);
}