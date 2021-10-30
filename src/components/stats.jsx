import {
  addMonths,
  addDays,
  format,
  getDaysInMonth,
  startOfMonth
} from "date-fns";
import { useContext, useEffect, useState } from "react";
import AppContext from "../utils/context";
import { fapp } from "../utils/fb";
import ChartSection from "./stats/chart-section";

export default function Stats({ setShowStats }) {
  const { user } = useContext(AppContext);

  let [ar, setAr] = useState([]);
  //hello
  async function load() {
    console.log("loading....");

    if (!user) return;

    let { docs } = await fapp
      .firestore()
      .collection("pomodoros")
      // .where("date", ">=", start)
      // .where("date", "<=", end)
      .where("uid", "==", user.uid)
      .get();

    docs.sort((a, b) => (a.data().date < b.data().date ? -1 : 1));

    setAr(docs);
  }

  useEffect(() => load(), []);

  function modalOnClick(event) {
    event.stopPropagation();
  }

  return (
    <div
      onClick={() => setShowStats(false)}
      className="bg-black bg-opacity-80 fixed left-0 top-0 right-0 bottom-0 z-10 flex justify-center items-center"
    >
      <div className="bg-gray-100 p-10" onClick={modalOnClick}>
        <div>
          {user ? (
            <div>
              <h1 className="text-2xl">Stats</h1>

              <ChartSection ar={ar} />

              <div className="grid grid-cols-3">
                {[-2, -1, 0].map((offset) => {
                  let d = startOfMonth(addMonths(new Date(), offset));
                  return <Calendar d={d} key={offset} ar={ar} />;
                })}
              </div>
              <h1 className="text-xl mt-2">
                Total Pomodoros: {user?.userData.total_pomodoro || 0}
              </h1>
            </div>
          ) : (
            <div>Login to see your activity.</div>
          )}
        </div>

        <button
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-2 mt-2 rounded"
          onClick={() => setShowStats(false)}
        >
          Close
        </button>
      </div>
    </div>
  );
}

// function TotalTime({ ar }) {
//   let totalTimeSec = 0;
//   ar.forEach((ev) => (totalTimeSec = ev.data().totalTime));
//   let min = Math.floor(totalTimeSec / 60);
//   totalTimeSec = totalTimeSec % 60;
//   let hr = Math.floor(min / 60);
//   min = min % 60;
//   return (
//     <div className="text-xl">
//       Total Time:{`${hr < 10 ? "0" + hr : hr}:${min < 10 ? "0" + min : min}`}
//     </div>
//   );
// }

function Calendar({ d, ar }) {
  let cells = new Array(getDaysInMonth(d)).fill(0);
  ar.forEach((ev) => {
    let [yyy, mmm, ddd] = ev.data().date.split("-");
    if (d.getMonth() === parseInt(mmm, 10) - 1)
      cells[parseInt(ddd, 10) - 1] = ev.data().count;
  });

  return (
    <div className="border">
      <div>{format(d, "yyyy-MMM")}</div>
      <div className="grid grid-cols-7">
        {"sun,mon,tue,wed,thu,fri,sat".split(",").map((v) => (
          <div key={v}>{v}</div>
        ))}

        {new Array(d.getDay()).fill(0).map((v, i) => (
          <div key={i}></div>
        ))}

        {cells.map((v, i) => {
          // let ymd = format(addDays(d, i), "yyyy-MM-dd");
          // let filtered = ar.filter((v) => v.data().date === ymd);
          // let num = filtered.length === 1 ? filtered[0].data().count : 0;
          let color = "bg-transparent";
          if (v < 10) color = `bg-green-${v}00`;
          else color = `bg-green-900`;

          return (
            <div key={i} className={`border ${color}`}>
              &nbsp;
            </div>
          );
        })}
      </div>
    </div>
  );
}
