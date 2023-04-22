import React, { useState, useContext, useEffect } from "react";
import { WordleContext } from "../context/Context";

export default function Stats() {
  const { stats } = useContext(WordleContext);

  const [graphics, setGraphics] = useState(""); //The graphic container

  useEffect(() => {
    if (Object.keys(stats).length === 0) return;

    //When the context stats is loaded, loop over every one of six possible attempts and calculate the percentage of it
    setGraphics(
      [...Array(6)].map((_, index) => {
        const i = index + 1;
        const percent = (stats["guess" + i] / stats.win) * 100;
        return (
          <div className="guess" key={index}>
            <p>{i}</p>
            {/* The render of the bars, % of guesses, plus 5 to show correctly the text into it */}
            <div
              className="bars"
              style={{
                width: percent + 5 + "%",
                backgroundColor: stats.maxGuess === i ? "green" : "gray",
              }}
            >
              <p>{stats["guess" + i]}</p>
            </div>
          </div>
        );
      })
    );
  }, [stats]);

  return (
    <>
      {Object.keys(stats).length !== 0 && (
        <>
          <div>STATISTICS</div>
          <div className="stats">
            <div className="stats-type">
              <p className="stats-number">{stats.played}</p>
              <p className="stats-title"> Played</p>
            </div>
            <div className="stats-type">
              <p className="stats-number">
                {stats.played > 0
                  ? Math.round((stats.win / stats.played) * 100)
                  : 0}
              </p>
              <p className="stats-title"> Win %</p>
            </div>
            <div className="stats-type">
              <p className="stats-number">{stats.streak}</p>
              <p className="stats-title"> Current Streak</p>
            </div>
            <div className="stats-type">
              <p className="stats-number">{stats.maxStreak}</p>
              <p className="stats-title"> Max Streak</p>
            </div>
          </div>
          <div>GUESS DISTRIBUTION</div>
          <div className="distribution">{graphics}</div>
        </>
      )}
    </>
  );
}
