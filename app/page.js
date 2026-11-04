"use client";
import { useAudioEngine } from "@/hooks/useAudioEngine";
import { useRainLayer } from "@/hooks/useRainLayer";
import { usePadLayer } from "@/hooks/usePadLayer";
import { moods } from "@/lib/moods";

export default function Home() {
  const { ctx, isPlaying, start, stop } = useAudioEngine();
  const mood = moods[0]; // just "Rainy Window" for now

  useRainLayer(ctx, mood.layers.rain);
  usePadLayer(ctx, mood.layers.pad);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6">
      <h1 className="text-4xl font-light tracking-wide">Ambient Moods</h1>
      <p className="text-white/60">{mood.name}</p>
      <button
        onClick={isPlaying ? stop : start}
        className="px-6 py-2 rounded-full border border-white/30 hover:bg-white/10 transition"
      >
        {isPlaying ? "Pause" : "Play"}
      </button>
    </main>
  );
}