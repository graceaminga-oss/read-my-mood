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
      <div className="mb-6 sm:mb-8">
        <p className="font-['Courier_Prime'] text-[11px] sm:text-xs uppercase tracking-[0.2em] text-[#7C7660] mb-2">
          Reading time
        </p>

        <h2 className="font-['Fraunces'] text-2xl sm:text-3xl font-semibold text-[#1B2A22] mb-2 leading-tight">
          How much do you want to read?
        </h2>

        <p className="font-['Public_Sans'] text-sm sm:text-base text-[#5B5646] leading-6">
          Choose how much time you want to spend with your next book.
        </p>
      </div>

      {/* Reading level selector */}
      <div className="bg-[#FFFDF5] border border-[#D9CFB0] px-4 py-6 sm:p-7">

        <div className="flex items-center justify-between mb-5">
          <span className="font-['Courier_Prime'] text-[11px] sm:text-xs uppercase tracking-wide text-[#7C7660]">
            Quick escape
          </span>

          <span className="font-['Courier_Prime'] text-[11px] sm:text-xs uppercase tracking-wide text-[#7C7660]">
            Long journey
          </span>
        </div>

        <div className="grid grid-cols-5 gap-1.5 sm:gap-3">
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
                  gap-1.5
                  py-3
                  sm:py-4
                  border
                  transition-colors
                  duration-200
                  ${
                    isSelected
                      ? 'bg-[#21402F] border-[#21402F] text-[#F3ECDA]'
                      : 'bg-[#F3ECDA] border-[#D9CFB0] text-[#7C7660] hover:border-[#B0A67F] hover:text-[#21402F]'
                  }
                `}
              >
                <span className="text-xl sm:text-2xl">
                  📖
                </span>

                <span className="font-['Courier_Prime'] text-xs sm:text-sm font-semibold">
                  {item.level}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected level information */}
        <div className="mt-6 pt-6 border-t border-[#D9CFB0] text-center min-h-[90px]">
          {selectedLevel ? (
            <>
              <h3 className="font-['Fraunces'] text-lg sm:text-xl font-semibold text-[#1B2A22] mb-1">
                {selectedLevel.title}
              </h3>

              <p className="font-['Public_Sans'] text-sm text-[#5B5646] leading-6 max-w-lg mx-auto">
                {selectedLevel.description}
              </p>
            </>
          ) : (
            <>
              <h3 className="font-['Fraunces'] text-lg sm:text-xl font-semibold text-[#1B2A22] mb-1">
                Choose your reading level
              </h3>

              <p className="font-['Public_Sans'] text-sm text-[#7C7660] leading-6 max-w-lg mx-auto">
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