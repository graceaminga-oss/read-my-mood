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
        <h2 className="text-2xl font-bold text-stone-800 mb-2">
          Pick Your Mood
        </h2>

        <p className="text-stone-500">
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
              className={`
                relative
                text-left
                p-5
                rounded-2xl
                border-2
                transition-all
                duration-200
                hover:-translate-y-1
                hover:shadow-md
                focus:outline-none
                focus:ring-2
                focus:ring-stone-400
                ${
                  isSelected
                    ? item.selected
                    : 'border-stone-200 bg-white hover:border-stone-300'
                }
              `}
            >
              {/* Selected checkmark */}
              {isSelected && (
                <span className="absolute top-4 right-4 text-sm font-bold">
                  ✓
                </span>
              )}

              {/* Mood icon */}
              <div
                className={`
                  w-12 h-12
                  rounded-xl
                  flex items-center justify-center
                  text-2xl
                  mb-4
                  ${isSelected ? item.iconBg : 'bg-stone-100'}
                `}
              >
                {item.icon}
              </div>

              {/* Mood name */}
              <h3 className="text-lg font-bold text-stone-800 mb-1">
                {item.name}
              </h3>

              {/* Mood description */}
              <p className="text-sm text-stone-500 leading-relaxed">
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