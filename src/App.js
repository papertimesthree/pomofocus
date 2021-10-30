import { useEffect, useState } from "react";
import Nav from "./components/nav";
import Pomodoro from "./components/pomodoro";

import "./styles.css";
import AppContext from "./utils/context";
import { fapp } from "./utils/fb";

const defDuration = 25;
const defBreak = 5;
const defGoal = 4;

export default function App() {
  let [duration, setDuration] = useState(undefined);
  let [breakDuration, setBreakDuration] = useState(undefined);
  let [goal, setGoal] = useState(undefined);
  let [user, setUser] = useState(undefined);

  useEffect(() => {
    fapp.auth().onAuthStateChanged(handleLogin);
    let settings = localStorage.getItem("settings");
    if (settings === null) {
      setDuration(defDuration);
      setBreakDuration(defBreak);
      setGoal(defGoal);
    } else {
      let { duration, breakDuration, goal } = JSON.parse(settings);
      setDuration(duration);
      setBreakDuration(breakDuration);
      setGoal(goal);
    }
  }, []);

  function changeSettings(duration, breakDuration, goal) {
    localStorage.setItem(
      "settings",
      JSON.stringify({ duration, breakDuration, goal })
    );
    setDuration(duration);
    setBreakDuration(breakDuration);
    setGoal(goal);
  }

  async function handleLogin(user) {
    if (!user) {
      setUser(undefined);
      return;
    }

    let userData = await fapp
      .firestore()
      .collection("user-data")
      .doc(user.uid)
      .get();
    if (userData.exists) {
      user.userData = userData.data();
    } else {
      fapp
        .firestore()
        .collection("user-data")
        .doc(user.uid)
        .set({ name: user.displayName });
      user.userData = {};
    }

    setUser(user);
  }

  if (typeof duration === "undefined") return <div>loading...</div>;

  return (
    <AppContext.Provider
      value={{
        settings: { duration, breakDuration, goal },
        changeSettings: changeSettings,
        user
      }}
    >
      <div className="App">
        <Nav />
        <Pomodoro />
      </div>
    </AppContext.Provider>
  );
}
