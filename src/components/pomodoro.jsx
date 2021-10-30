import { useSound } from "use-sound";
import { differenceInMilliseconds, differenceInSeconds } from "date-fns/esm";
import { useContext, useEffect, useState } from "react";
import buttonSFX from "../buttonClick.mp3";
import timerSFX from "../timer.mp3";
import AppContext from "../utils/context";
import { fapp, increment } from "../utils/fb";
import { format } from "date-fns";

export default function Pomodoro() {
  const { settings } = useContext(AppContext);
  const { user } = useContext(AppContext);
  const { duration, breakDuration, goal } = settings;

  // replace with duration, breakDuration
  const POMODORO_TIME = duration * 60 * 1000; // 25 minutes in milliseconds
  const BREAK_TIME = breakDuration * 60 * 1000; //BreakTime

  const [startTime, setStartTime] = useState(undefined);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [onBreak, setOnBreak] = useState(false);
  const [pomodoro, setPomodoro] = useState(0);
  const [buttonClick] = useSound(buttonSFX);
  const [timerDing] = useSound(timerSFX);

  function displayRemaining(currentTime, startTime) {
    if (!startTime || !currentTime) return "-";

    let elasped = differenceInMilliseconds(currentTime, startTime);
    let ms = onBreak ? BREAK_TIME - elasped : POMODORO_TIME - elasped;
    if (ms < 0) return "-";
    let s = ms / 1000;
    ms = ms % 1000;
    let m = Math.floor(s / 60);
    s = s % 60;
    return `${m}:${s < 10 ? "0" + s.toFixed(2) : s.toFixed(2)}`;
    // `${m}:${s < 10 ? "0" + s.toFixed(2) : s.toFixed(2)}`
  }

  async function incrementPomodoro() {
    setPomodoro((x) => x + 1);

    if (!user) return;

    // collection that stores number of pomodoros
    let { docs } = await fapp
      .firestore()
      .collection("pomodoros")
      .where("uid", "==", user.uid)
      .where("date", "==", format(new Date(), "yyyy-MM-dd"))
      .get();

    await fapp
      .firestore()
      .collection("user-data")
      .doc(user.uid)
      .update({ total_pomodoro: increment(1) });

    let userDataDoc = await fapp
      .firestore()
      .collection("user-data")
      .doc(user.uid)
      .get();
    user.userData.total_pomodoro = userDataDoc.data().total_pomodoro;

    if (docs.length === 1) {
      fapp
        .firestore()
        .collection("pomodoros")
        .doc(docs[0].id)
        .update({ count: increment(1) });
    } else {
      fapp
        .firestore()
        .collection("pomodoros")
        .add({
          uid: user.uid,
          date: format(new Date(), "yyyy-MM-dd"),
          count: 1
        });
    }
  }

  useEffect(() => {
    let interval = null;
    if (startTime && onBreak === false) {
      interval = setInterval(() => {
        if (differenceInMilliseconds(new Date(), startTime) > POMODORO_TIME) {
          stopTimer();
          setStartTime(undefined);
          setOnBreak(true);
          timerDing();
          incrementPomodoro();
        } else {
          setCurrentTime(new Date());
        }
      }, 47);
    }

    if (startTime && onBreak) {
      interval = setInterval(() => {
        if (differenceInMilliseconds(new Date(), startTime) > BREAK_TIME) {
          setStartTime(undefined);
          stopTimer();
          setOnBreak(false);
          timerDing();
        } else {
          setCurrentTime(new Date());
        }
      }, 47);
    }

    return () => clearInterval(interval);
  }, [startTime]);

  function start() {
    buttonClick();
    setStartTime(new Date());
    setCurrentTime(new Date());
  }

  function end() {
    buttonClick();
    setStartTime(undefined);
    setCurrentTime(new Date());
  }

  let [deg, setDeg] = useState(0);

  let [timerId, setTimerId] = useState(undefined);

  function startTimer() {
    setDeg(0);
    start();
    let timerId = setInterval(() => {
      setDeg((p) => (p + 1) % 360);
    }, (1000 / 360) * `${onBreak ? BREAK_TIME / 1000 : POMODORO_TIME / 1000}`);
    setTimerId(timerId);
  }

  function stopTimer() {
    end();
    clearInterval(timerId);
  }

  return (
    <main>
      <div className="flex flex-col justify-center items-center p-20">
        <div className="mb-4 text-xl">
          {onBreak && pomodoro !== goal && <div>Time for a break!</div>}
        </div>
        <div className="mb-4 text-xl">
          {pomodoro === goal && <div>All done!</div>}
        </div>
        <div
          className="w-60 h-60 border rounded-full relative"
          style={{
            background: `conic-gradient(#2d27dc ${deg}deg, #f06292 ${deg}deg 100%`
          }}
        >
          <div className="w-full h-full border-4 bg-white rounded-full transform scale-75 flex flex-col justify-center ">
            <div className="text-6xl">
              {displayRemaining(currentTime, startTime)}
            </div>
          </div>
        </div>
      </div>

      <div className="text-xl mb-4">
        {new Array(pomodoro).fill("🔥")}
        {new Array(goal - pomodoro).fill("🍅")}
      </div>

      {startTime ? (
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={stopTimer}
        >
          STOP
        </button>
      ) : (
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={startTimer}
        >
          START
        </button>
      )}
    </main>
  );
}
