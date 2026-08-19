function ComfortMeter({ comfortLevel, setComfortLevel }) {

  return(
    <div className="mt-10">
      <div>
      <h2 className="text-2xl font-bold text-stone-800 mb-2">Comfort Level</h2>
      <p className="text-lg text-gray-500 mb-8">How long of a book are you in the mood for?</p>
      <p>1 = Quick read · 5 = Long read</p>
      </div>
      <div className="flex gap-2">
      {Array.from({ length: 5 }).map((_, index) => {
  const level = index + 1;
  return (
    <button
      key={level}
      onClick={() => setComfortLevel(level)}
      className={`text-3xl transition-all duration-200 ${
        level <= comfortLevel ? 'opacity-100 scale-110' : 'opacity-30'
      }`}
      aria-label={`Comfort level ${level}`} 
    >
      📖
    </button>
  );
})}
    </div>
    </div>
  )
}

export default ComfortMeter;