
function MoodPicker({ mood, setMood }) {
  return (
    <div>
      <div>
        <h2>Pick Your Mood</h2>
        <p>Select your current mood from the options below:</p>
      </div>

      <div className="flex gap-4 flex-wrap">
        <button
          className={`px-6 py-3 rounded-full font-medium transition-all hover:scale-105 hover: shadow-md ${
            mood === 'Cozy' ? 'bg-amber-500 text-white scale-110' : 'bg-gray-200 text-gray-700'
          }`}
          onClick={() => setMood('Cozy')}
        >
          ☕Cozy
        </button>
        <button
          className={`px-6 py-3 rounded-full font-medium transition-all hover:scale-105 hover: shadow-md ${
            mood === 'Adventurous' ? 'bg-emerald-500 text-white scale-110' : 'bg-gray-200 text-gray-700'
          }`}
          onClick={() => setMood('Adventurous')}
        >
          🧭Adventurous
        </button>
        <button
          className={`px-6 py-3 rounded-full font-medium transition-all hover:scale-105 hover: shadow-md ${
            mood === 'Heartbroken' ? 'bg-indigo-500 text-white scale-110' : 'bg-gray-200 text-gray-700'
          }`}
          onClick={() => setMood('Heartbroken')}
        >
          💔Heartbroken
        </button>
        <button
          className={`px-6 py-3 rounded-full font-medium transition-all hover:scale-105 hover: shadow-md ${
            mood === 'Curious' ? 'bg-fuchsia-500 text-white scale-110' : 'bg-gray-200 text-gray-700'
          }`}
          onClick={() => setMood('Curious')}
        >
          🔎Curious
        </button>
      </div>
    </div>
  );
}

export default MoodPicker;