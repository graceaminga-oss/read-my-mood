function MoodPicker({ mood, setMood }) {
  const moods = [
    {
      name: 'Cozy',
      icon: '☕',
      description: 'Warm, relaxing, and comforting',
      color: '#C08A32',
      selected: 'border-amber-400 bg-amber-50',
      iconBg: 'bg-amber-100',
    },
    {
      name: 'Adventurous',
      icon: '🧭',
      description: 'Exciting, bold, and full of discovery',
      color: '#4F765D',
      selected: 'border-emerald-400 bg-emerald-50',
      iconBg: 'bg-emerald-100',
    },
    {
      name: 'Heartbroken',
      icon: '💔',
      description: 'Emotional, thoughtful, and comforting',
      color: '#66758A',
      selected: 'border-indigo-400 bg-indigo-50',
      iconBg: 'bg-indigo-100',
    },
    {
      name: 'Curious',
      icon: '🔎',
      description: 'Interesting, mysterious, and thought-provoking',
      color: '#876B7E',
      selected: 'border-fuchsia-400 bg-fuchsia-50',
      iconBg: 'bg-fuchsia-100',
    },
  ];

  return (
    <div>
      <div className="mb-6 sm:mb-8">
        <h2 className="font-['Fraunces'] text-2xl sm:text-3xl font-semibold text-[#1B2A22] mb-2">
          Pick Your Mood
        </h2>

        <p className="font-['Public_Sans'] text-sm sm:text-base text-[#5B5646] leading-6">
          Choose the mood that best describes how you feel right now.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
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
                p-4 sm:p-5
                border
                transition-colors
                duration-200
                focus:outline-none
                focus:ring-2
                focus:ring-[#21402F]/30
                ${
                  isSelected
                    ? item.selected
                    : 'border-[#D9CFB0] bg-[#FFFDF5] hover:border-[#B0A67F] hover:bg-[#F8F3E5]'
                }
              `}
            >
              {/* Selected checkmark */}
              {isSelected && (
                <span className="absolute top-4 right-4 text-sm font-semibold text-[#21402F]">
                  ✓
                </span>
              )}

              {/* Mood icon */}
              <div
                className={`
                  w-11 h-11 sm:w-12 sm:h-12
                  flex items-center justify-center
                  text-xl sm:text-2xl
                  mb-4
                  ${isSelected ? item.iconBg :
                    'bg-[#EDE8D9]'
                  }
                `}
              >
                {item.icon}
              </div>

              {/* Mood name */}
              <h3 className="font-['Fraunces'] text-lg sm:text-xl font-semibold text-[#1B2A22] mb-1">
                {item.name}
              </h3>

              {/* Mood description */}
              <p className="font-['Public_Sans'] text-sm text-[#5B5646] leading-6 pr-5">
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