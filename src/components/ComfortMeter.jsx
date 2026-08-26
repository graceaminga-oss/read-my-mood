function ComfortMeter({ comfortLevel, setComfortLevel }) {
  const levels = [
    {
      level: 1,
      title: 'Quick Escape',
      description: 'A short read for a few quiet minutes.',
    },
    {
      level: 2,
      title: 'Light Read',
      description: 'Something easy to enjoy without a big commitment.',
    },
    {
      level: 3,
      title: 'Comfortable Read',
      description: 'A balanced choice for a relaxed reading session.',
    },
    {
      level: 4,
      title: 'Long Read',
      description: 'A story you can settle into for a while.',
    },
    {
      level: 5,
      title: 'Get Lost',
      description: 'You are ready to disappear into a longer story.',
    },
  ];

  const selectedLevel = levels.find(
    (item) => item.level === comfortLevel
  );

  return (
    <div>
      {/* Heading */}
      <div className="mb-6">
        <p className="text-sm font-semibold text-stone-400 uppercase tracking-wider mb-2">
          Reading time
        </p>

        <h2 className="text-2xl font-bold text-stone-800 mb-2">
          How much do you want to read?
        </h2>

        <p className="text-stone-500">
          Choose how much time you want to spend with your next book.
        </p>
      </div>

      {/* Reading level selector */}
      <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 shadow-sm">

        <div className="flex items-center justify-between mb-5">
          <span className="text-sm text-stone-400">
            Quick escape
          </span>

          <span className="text-sm text-stone-400">
            Long journey
          </span>
        </div>

        <div className="grid grid-cols-5 gap-2 sm:gap-4">
          {levels.map((item) => {
            const isSelected = comfortLevel === item.level;

            return (
              <button
                key={item.level}
                type="button"
                onClick={() => setComfortLevel(item.level)}
                aria-label={`Reading level ${item.level}: ${item.title}`}
                className={`
                  group
                  flex
                  flex-col
                  items-center
                  gap-2
                  py-3
                  rounded-2xl
                  transition-all
                  duration-200
                  ${
                    isSelected
                      ? 'bg-stone-800 text-white scale-105 shadow-md'
                      : 'text-stone-400 hover:bg-stone-100 hover:text-stone-600'
                  }
                `}
              >
                <span className="text-2xl transition-transform group-hover:scale-110">
                  📖
                </span>

                <span className="text-sm font-semibold">
                  {item.level}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected level information */}
        <div className="mt-6 pt-6 border-t border-stone-100 text-center min-h-[90px]">
          {selectedLevel ? (
            <>
              <h3 className="font-bold text-lg text-stone-800 mb-1">
                {selectedLevel.title}
              </h3>

              <p className="text-sm text-stone-500">
                {selectedLevel.description}
              </p>
            </>
          ) : (
            <>
              <h3 className="font-semibold text-stone-700 mb-1">
                Choose your reading level
              </h3>

              <p className="text-sm text-stone-400">
                Select from 1 to 5 to tell us how much you want to read.
              </p>
            </>
          )}
        </div>

      </div>
    </div>
  );
}

export default ComfortMeter;