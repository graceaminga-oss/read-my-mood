function ComfortMeter({ comfortLevel, setComfortLevel }) {

  return(
    <div>
      <div>
      <h2>Comfort Level</h2>
      <p>How much can you handle right now?</p>
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