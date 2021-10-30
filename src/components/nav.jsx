import React, { useContext, useState } from "react";
import AppContext from "../utils/context";
import { fapp, googleP } from "../utils/fb";
import LeaderBoard from "./leaderboard";
import Settings from "./settings";
import Stats from "./stats";

export default function Nav() {
  let [showSettings, setShowSettings] = useState(false);
  let [showStats, setShowStats] = useState(false);
  let [showLeaderboard, setShowLeaderboard] = useState(false);
  const { user } = useContext(AppContext);

  function signOut() {
    fapp.auth().signOut();
  }

  function signIn() {
    fapp.auth().signInWithPopup(googleP);
  }

  return (
    <div className="Nav">
      <div className="flex bg-indigo-500 items-center space-x-2 p-2 text-white font-sans">
        <div>Focus</div>
        <button
          className="bg-white text-black rounded p-1"
          onClick={() => setShowStats(true)}
        >
          Stats
        </button>
        <button
          className="bg-white text-black rounded p-1"
          onClick={() => setShowLeaderboard(true)}
        >
          Leaderboard
        </button>
        <button
          className="bg-white text-black rounded p-1"
          onClick={() => setShowSettings(true)}
        >
          Settings
        </button>
        <div className="flex-grow" />
        {user ? (
          <button className="bg-white text-black rounded p-1" onClick={signOut}>
            Log Out
          </button>
        ) : (
          <button className="bg-white text-black rounded p-1" onClick={signIn}>
            Login
          </button>
        )}
      </div>
      <Settings showSettings={showSettings} setShowSettings={setShowSettings} />
      {showStats && <Stats setShowStats={setShowStats} />}
      {showLeaderboard && (
        <LeaderBoard setShowLeaderboard={setShowLeaderboard} user={user} />
      )}
    </div>
  );
}
