export default function MoodBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-black">
      <div
        className="absolute left-1/2 top-1/2 w-[120vmin] h-[120vmin] rounded-full animate-breathe"
        style={{
          background:
            "radial-gradient(circle, #2b1d5c 0%, #1a1240 30%, #0b0820 55%, #000000 75%)",
        }}
      />
    </div>
  );
}