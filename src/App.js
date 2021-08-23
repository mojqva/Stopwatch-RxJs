import {useState, useEffect} from 'react';
import {
  interval,
  Subject
} from 'rxjs';
import {
  scan,
  startWith,
} from 'rxjs/operators';



function App() {
  const [time, setTime] = useState();
  const [timerOn, setTimerOn] = useState(false);
  const [reset, setReset] = useState(false);

  const observable$ = interval(10).pipe(
    startWith(0),
    scan(time => time + 10)
  );

  const action$ = new Subject();
  action$.subscribe(setTime);

  const actionOn$ = new Subject();
  actionOn$.subscribe(setTimerOn);

  const actionReset$ = new Subject();
  actionReset$.subscribe(setReset);

  useEffect(() => {
    const sub = observable$.subscribe(setTime);

    if(!timerOn) {
      sub.unsubscribe()
    }
    
    if(reset) {
      action$.next(0);
    }
    actionReset$.next(false);

    return () => sub.unsubscribe();
    // let interval = null;

    // if(timerOn) {
    //   interval = setInterval(() => {
    //     setTime(prevTime => prevTime + 10)
    //   }, 10)
    // } else {
    //   clearInterval(interval)
    // }

    // return () => clearInterval(interval)
  }, [timerOn, reset])

  return (
    <div>
      <div>
        <span>{('0' + Math.floor((time / 60000) % 60)).slice(-2)}:</span>
        <span>{('0' + Math.floor((time / 1000) % 60)).slice(-2)}:</span>
        <span>{('0' + ((time/10) % 100)).slice(-2)}</span>
      </div>
      <div>
        <button onClick={() => {actionOn$.next(true)}}>Start</button>
        <button onClick={() => {actionOn$.next(false)}}>Stop</button>
        <button onDoubleClick={() => actionOn$.next(false)}>Wait</button>
        <button onClick={() => actionReset$.next(true)}>Reset</button>
      </div>
    </div>
  );
}

export default App;
