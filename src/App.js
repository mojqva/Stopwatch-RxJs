import {useState, useEffect} from 'react';
import {
  interval,
  Subject,
} from 'rxjs';
import {  
  scan,  
  startWith, 
} from 'rxjs/operators';

function App() {
  const [time, setTime] = useState(0);
  const [timerOn, setTimerOn] = useState(false);
  const [reset, setReset] = useState(false);
  const [currTime, setCurrTime] = useState(time);
  const [paused, setPaused] = useState(false)

  const observable$ = interval(10).pipe(
    startWith(currTime),
    scan(time => time + 10)
  );

  const action$ = new Subject();
  action$.subscribe(setTime);

  const actionOn$ = new Subject();
  actionOn$.subscribe(setTimerOn);

  const actionReset$ = new Subject();
  actionReset$.subscribe(setReset);

  const actionPaused$ = new Subject();
  actionPaused$.subscribe(setPaused);

  useEffect(() => {
    const sub = observable$.subscribe(setTime);

    if(!timerOn) {
      sub.unsubscribe();
    }

    if(paused) {
      sub.unsubscribe();
      setTime(currTime);
    }
    
    if(reset) {
      action$.next(0);
      setCurrTime(0)
    }
    actionReset$.next(false);

    return () => sub.unsubscribe();
  }, [timerOn, reset, paused])

  return (
    <div>
      <div>
        <span>{('0' + Math.floor((time / 60000) % 60)).slice(-2)}:</span>
        <span>{('0' + Math.floor((time / 1000) % 60)).slice(-2)}:</span>
        <span>{('0' + ((time/10) % 100)).slice(-2)}</span>
      </div>
      <div>
        <button id='resume' onClick={() => {actionOn$.next(true); actionPaused$.next(false)}}>Start</button>
        <button onClick={() => {actionOn$.next(false); setCurrTime(0)}}>Stop</button>
        <button id='pause' onDoubleClick={() => {setCurrTime(time); actionPaused$.next(true)}}>Wait</button>
        <button onClick={() => actionReset$.next(true)}>Reset</button>
      </div>
    </div>
  );
}

export default App;
