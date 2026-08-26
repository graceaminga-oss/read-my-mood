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
      <div className="mb-6">
        <p className="font-mono text-xs tracking-[0.25em] uppercase text-[#7C7660] mb-2">
          Step 02
        </p>

        <h2 className="font-serif text-2xl font-semibold text-[#1B2A22]">
          How much do you want to read?
        </h2>

        <p className="text-[#5B5646] mt-2 font-sans">
          The taller the spine, the longer you'll want to stay.
        </p>
      </div>

      <div className="bg-[#F3ECDA] border border-[#D9CFB0] p-6 sm:p-8">
        {/* Spines sit on a shelf line; height itself communicates commitment */}
        <div className="flex items-end justify-between gap-3 sm:gap-5 h-24 border-b-[3px] border-[#1B2A22]/70 px-1">
          {levels.map((item) => {
            const isSelected = comfortLevel === item.level;

            return (
              <button
                key={item.level}
                type="button"
                onClick={() => setComfortLevel(item.level)}
                aria-label={`Reading level ${item.level}: ${item.title}`}
                aria-pressed={isSelected}
                className="group flex-1 flex flex-col items-center justify-end h-full focus:outline-none"
              >
                <div
                  className={`
                    w-full max-w-[34px] transition-all duration-200 border
                    ${isSelected
                      ? 'bg-[#C08A32] border-[#1B2A22]/40 shadow-[2px_2px_0_0_rgba(27,42,34,0.2)]'
                      : 'bg-[#8C8368] border-[#1B2A22]/10 group-hover:bg-[#A6976F]'
                    }
                  `}
                  style={{ height: `${item.spineHeight}px` }}
                />
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between mt-2 px-1">
          <span className="font-mono text-[11px] text-[#7C7660]">
            quick escape
          </span>
          <span className="font-mono text-[11px] text-[#7C7660]">
            long journey
          </span>
        </div>

        {/* Selected level, shown as a stamped label */}
        <div className="mt-6 pt-6 border-t border-[#1B2A22]/10 text-center min-h-[76px]">
          {selectedLevel ? (
            <div className="inline-block">
              <div className="inline-flex items-center gap-2 border-2 border-[#1B2A22]/70 px-3 py-1 -rotate-1 font-mono text-xs uppercase tracking-wider text-[#1B2A22]">
                Level {selectedLevel.level} — {selectedLevel.title}
              </div>
              <p className="text-sm text-[#5B5646] mt-3 font-sans">
                {selectedLevel.description}
              </p>
            </div>
          ) : (
            <>
              <h3 className="font-serif font-semibold text-[#1B2A22] mb-1">
                Choose your reading level
              </h3>
              <p className="text-sm text-[#7C7660] font-sans">
                Select a spine from 1 to 5.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ComfortMeter;
