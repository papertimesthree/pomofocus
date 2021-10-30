import { useEffect, useState } from "react";
import { fapp } from "../utils/fb";

function LeaderBoard({ setShowLeaderboard, user }) {
  function modalOnClick(event) {
    event.stopPropagation();
  }

  let [ar, setAr] = useState([]);

  async function load() {
    let { docs } = await fapp
      .firestore()
      .collection("user-data")
      .orderBy("total_pomodoro", "desc")
      .limit(5)
      .get();
    setAr(docs);
  }

  useEffect(() => load(), []);

  return (
    <div
      onClick={() => setShowLeaderboard(false)}
      className="bg-black bg-opacity-80 fixed left-0 top-0 right-0 bottom-0 z-10 flex justify-center items-center"
    >
      <div className="bg-gray-100 p-10" onClick={modalOnClick}>
        <div>
          {user ? (
            <table className="border-green-800 ...">
              <thead>
                <tr>
                  <th className="border border-green-600 ...">Ranking</th>
                  <th className="border border-green-600 ...">Username</th>
                  <th className="border border-green-600 ...">Pomodoros</th>
                </tr>
              </thead>
              <tbody>
                {ar.map((v, i) => (
                  <tr key={i}>
                    <td className="border border-green-600 ...">{i + 1}</td>
                    <td
                      className={`border border-green-600 ${
                        v.data().name === user.displayName && v.id === user.uid
                          ? "bg-yellow-300"
                          : ""
                      } `}
                    >
                      {v.data().name}
                    </td>
                    <td className="border border-green-600 ...">
                      {v.data().total_pomodoro}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div>Login to see the leaderboard.</div>
          )}
        </div>
        <button
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-2 mt-4 rounded"
          onClick={() => setShowLeaderboard(false)}
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default LeaderBoard;
