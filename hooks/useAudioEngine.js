"use client";
import { useState, useCallback } from "react";

export function useAudioEngine() {
  const [ctx, setCtx] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const start = useCallback(async () => {
    let audio = ctx;
    if (!audio) {
      audio = new AudioContext();
      setCtx(audio);
    }
    await audio.resume();
    setIsPlaying(true);
  }, [ctx]);

  const stop = useCallback(async () => {
    await ctx?.suspend();
    setIsPlaying(false);
  }, [ctx]);

  return { ctx, isPlaying, start, stop };
}