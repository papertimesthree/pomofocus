import React, { useContext } from "react";
import AppContext from "../utils/context";

function Settings({ showSettings, setShowSettings }) {
  const { settings, changeSettings } = useContext(AppContext);
  const { duration, breakDuration, goal } = settings;

  function modalOnClick(event) {
    event.stopPropagation();
  }

  function create(event) {
    event.preventDefault();
    changeSettings(
      event.target.duration.value,
      event.target.breakDuration.value,
      event.target.goal.value
    );
    setShowSettings(false);
  }

  return (
    <>
      {showSettings ? (
        <div
          onClick={() => setShowSettings(false)}
          className="bg-black bg-opacity-80 fixed left-0 top-0 right-0 bottom-0 z-10 flex justify-center items-center"
        >
          <div className="bg-white p-4 rounded shadow" onClick={modalOnClick}>
            <div className="flex items-start justify-between p-4 border-b border-solid items-center ">
              <h3 className="text-2xl font-semibold">Settings</h3>
              <button
                className="p-1 ml-auto border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                onClick={() => setShowSettings(false)}
              >
                x
              </button>
            </div>
            <form onSubmit={create} className="space-y-3">
              <div>
                <label className="block mb-1">Study Duration</label>
                <input
                  className="border border-gray-400 p-1"
                  type="number"
                  id="pomodoroTime"
                  min="1"
                  max="100"
                  defaultValue={duration}
                  name="duration"
                />
              </div>

              <div>
                <label className="block mb-1">Break Duration</label>
                <input
                  className="border border-gray-400 p-1"
                  type="number"
                  id="breakTime"
                  min="1"
                  max="100"
                  defaultValue={breakDuration}
                  name="breakDuration"
                />
              </div>

              <div>
                <label className="block mb-1">Pomodoros</label>
                <input
                  className="border border-gray-400 p-1"
                  type="number"
                  id="numPomodoros"
                  min="1"
                  max="100"
                  defaultValue={goal}
                  name="goal"
                />
              </div>
              <div className="flex items-center justify-end p-6 border-t border-solid  rounded-b">
                <button
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-2 mr-2 rounded"
                  onClick={() => setShowSettings(false)}
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-2 mr-2 rounded"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
export default Settings;
