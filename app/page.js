"use client";
import { useState } from "react";
import { useAudioEngine } from "@/hooks/useAudioEngine";
import { useRainLayer } from "@/hooks/useRainLayer";
import { usePadLayer } from "@/hooks/usePadLayer";
import { moods } from "@/lib/moods";
import MoodBackground from "@/components/MoodBackground";
import MoodPicker from "@/components/MoodPicker";

export default function Home() {
  const { ctx, isPlaying, start, stop } = useAudioEngine();
  const [moodId, setMoodId] = useState(moods[0].id);

  const mood = moods.find((m) => m.id === moodId);

  useRainLayer(ctx, mood.layers.rain);
  usePadLayer(ctx, mood.layers.pad);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-8 px-4">
      <MoodBackground  />

      <h1 className="text-5xl font-light tracking-wide drop-shadow-lg">
        {mood.name}
      </h1>

      <MoodPicker moods={moods} activeId={moodId} onSelect={setMoodId} />

      <button
        onClick={isPlaying ? stop : start}
        className="px-8 py-3 rounded-full border border-white/40 backdrop-blur-sm hover:bg-white/10 transition"
      >
        {isPlaying ? "Pause" : "Play"}
      </button>
    </main>
  );
}