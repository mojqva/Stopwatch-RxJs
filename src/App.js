import {useState, useEffect} from 'react'

function App() {
  const [time, setTime] = useState(0);
  const [timerOn, setTimerOn] = useState(false);

  useEffect(() => {
    let interval = null;

    if(timerOn) {
      interval = setInterval(() => {
        setTime(prevTime => prevTime + 10)
      }, 10)
    } else {
      clearInterval(interval)
    }

    return () => clearInterval(interval)
  }, [timerOn])

  return (
    <div>
      <div>
        <span>{('0' + Math.floor((time / 60000) % 60)).slice(-2)}:</span>
        <span>{('0' + Math.floor((time / 1000) % 60)).slice(-2)}:</span>
        <span>{('0' + ((time / 10) % 100)).slice(-2)}</span>
      </div>
      <div>
        <button onClick={() => setTimerOn(true)}>Start</button>
        <button onClick={() => {
          setTimerOn(false);
          setTime(0);
          }
        }>Stop</button>
        <button onDoubleClick={() => setTimerOn(false)}>Wait</button>
        <button onClick={() => setTime(0)}>Reset</button>
      </div>
    </div>
  );
}

export default App;
