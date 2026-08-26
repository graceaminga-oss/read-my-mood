function MoodPicker({ mood, setMood }) {
  const moods = [
    {
      name: 'Cozy',
      icon: '☕',
      description: 'Warm, relaxing, and comforting',
      color: 'amber',
      selected: 'border-amber-400 bg-amber-50',
      iconBg: 'bg-amber-100',
    },
    {
      name: 'Adventurous',
      icon: '🧭',
      description: 'Exciting, bold, and full of discovery',
      color: 'emerald',
      selected: 'border-emerald-400 bg-emerald-50',
      iconBg: 'bg-emerald-100',
    },
    {
      name: 'Heartbroken',
      icon: '💔',
      description: 'Emotional, thoughtful, and comforting',
      color: 'indigo',
      selected: 'border-indigo-400 bg-indigo-50',
      iconBg: 'bg-indigo-100',
    },
    {
      name: 'Curious',
      icon: '🔎',
      description: 'Interesting, mysterious, and thought-provoking',
      color: 'fuchsia',
      selected: 'border-fuchsia-400 bg-fuchsia-50',
      iconBg: 'bg-fuchsia-100',
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <p className="font-mono text-xs tracking-[0.25em] uppercase text-[#7C7660] mb-2">
          Step 01
        </p>

        <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#1B2A22]">
          Pick your mood
        </h2>

        <p className="text-[#5B5646] mt-2 font-sans">
          Choose the mood that best describes how you feel right now.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {moods.map((item) => {
          const isSelected = mood === item.name;

          return (
            <button
              key={item.name}
              type="button"
              onClick={() => setMood(item.name)}
              aria-pressed={isSelected}
              className={`
                group relative text-left p-5
                bg-[#F3ECDA] border transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-[#C08A32] focus:ring-offset-2 focus:ring-offset-[#21402F]
                ${isSelected
                  ? 'border-[#1B2A22]/30 shadow-[4px_4px_0_0_rgba(27,42,34,0.15)] -translate-y-0.5'
                  : 'border-[#D9CFB0] hover:-translate-y-0.5 hover:shadow-[3px_3px_0_0_rgba(27,42,34,0.08)]'
                }
              `}
            >
              {/* Color chip, top-right corner: rounded square, color-coded per mood */}
              <span
                className="absolute top-4 right-4 w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
                aria-hidden="true"
              />

              {isSelected && (
                <span
                  className="absolute top-4 right-9 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white font-mono"
                  style={{ backgroundColor: item.color }}
                >
                  ✓
                </span>
              )}

              <div
                className="w-11 h-11 flex items-center justify-center text-xl mb-4 rounded-full border border-[#1B2A22]/10"
                style={{ backgroundColor: isSelected ? item.soft : '#EAE4D2' }}
              >
                {item.icon}
              </div>

              <h3 className="font-serif text-lg font-semibold text-[#1B2A22] mb-1">
                {item.name}
              </h3>

              <p className="text-sm text-[#5B5646] leading-relaxed font-sans">
                {item.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default MoodPicker;
