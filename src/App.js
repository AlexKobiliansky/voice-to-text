import {useEffect, useState} from 'react';

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const mic = new SpeechRecognition();

mic.continuous = true;
mic.interimResults = true;
mic.lang = 'en-US';

function App() {
  const [isListening, setIsListening] = useState(false);
  const [note, setNote] = useState(null);
  const [savedNotes, setSavedNotes] = useState([]);

  useEffect(() => {
    handleListen();
  }, [isListening])

  const handleListen = () => {
    if (isListening) {
      mic.start();
      mic.onend = () => {
        console.log('continue...');
        mic.start();
      }
    } else {
      mic.stop();
      mic.onend = () => {
        console.log('Stopped Mic on Click')
      }
    }

    mic.onstart = () => {
      console.log('Mic is on')
    }

    mic.onresult = e => {
      const transcript = Array.from(e.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('');
      console.log(transcript);
      setNote(transcript);
      mic.onerror = e => {
        console.log(e.error);
      }
    }
  }

  const handleSaveNote = () => {
    setSavedNotes([...savedNotes, note]);
    setNote('')
  }

  return (
    <>
      <h1>Voice to text App</h1>
      <div className="container">
        <div className="box">
          <h2>Current Note</h2>
          {isListening ? <span style={{color: 'red'}}>record on</span> : <span style={{color: 'grey'}}>record stopped</span>}
          <button onClick={handleSaveNote} disabled={!note}>Save note</button>
          <button onClick={() => setIsListening(!isListening)}>Start/Stop</button>
          <p>{note}</p>
        </div>
        <div className="box">
          <h2>Notes</h2>
          {savedNotes.map(note => (
            <p key={note}>{note}</p>
          ))}
        </div>

      </div>
    </>

  );
}

export default App;
