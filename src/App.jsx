import {useState} from 'react';
import MoodPicker from './components/MoodPicker';
import ComfortMeter from './components/ComfortMeter';
import BookShelf from './components/BookShelf';

function App() {
  const [mood, setMood] = useState(null);

  const [comfortLevel, setComfortLevel] = useState(null);

  const [books, setBooks] = useState([]);

  return (
  <div className="App">
    <h1>Read My Mood</h1>
    <p>Welcome to Read My Mood!</p>

    <MoodPicker mood={mood} setMood={setMood} />
    <ComfortMeter comfortLevel={comfortLevel} setComfortLevel={setComfortLevel} />
    <BookShelf books={books} />
  </div>
);
}
export default App;