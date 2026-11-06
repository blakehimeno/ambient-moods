export default function MoodPicker({ moods, activeId, onSelect }) {
  return (
    <div className="flex flex-wrap justify-center gap-3">
      {moods.map((m) => {
        const isActive = m.id === activeId;
        return (
          <button
            key={m.id}
            onClick={() => onSelect(m.id)}
            className={`px-5 py-2 rounded-full border backdrop-blur-sm transition ${
              isActive
                ? "bg-white/20 border-white/70"
                : "border-white/20 hover:bg-white/10"
            }`}
          >
            {m.name}
          </button>
        );
      })}
    </div>
  );
}