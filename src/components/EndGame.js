import React, { useEffect, useState, useContext } from "react";
import { WordleContext } from "../context/Context";

export default function EndGame() {
  const { isCorrect, turn, solution, newGame } = useContext(WordleContext);

  const [message, setMessage] = useState(""); //Emulate the final message of wordle based in the number of attemps
  var isRequestingNewGame = false; //Avoid to press multiple times the new game button

  useEffect(() => {
    switch (parseInt(turn)) {
      case 1:
        setMessage("Genius");
        break;
      case 2:
        setMessage("Magnificent");
        break;
      case 3:
        setMessage("Impressive");
        break;
      case 4:
        setMessage("Splendid");
        break;
      case 5:
        setMessage("Great");
        break;
      case 6:
        setMessage("Phew");
        break;
      case 7:
        setMessage(solution);
        break;
    }
  }, [turn, solution]);

  return (
    <div className="modal">
      {isCorrect && (
        <div>
          <h1>{message}</h1>
          <div className="solutionFrame">
            <p>{solution}</p>
          </div>
          <p>
            You found the solution in {turn} guess{turn > 1 && "es"}
          </p>
          <p
            onClick={() => {
              if (isRequestingNewGame) return;
              isRequestingNewGame = true;
              newGame();
            }}
            className="newGame"
          >
            Play again
          </p>
        </div>
      )}
      {!isCorrect && (
        <div>
          <div className="solutionFrame">
            <p>{solution}</p>
          </div>
          <p>You run out of tries. Good luck next time.</p>
          <p
            onClick={() => {
              if (isRequestingNewGame) return;
              isRequestingNewGame = true;
              newGame();
            }}
            className="newGame"
          >
            Play again
          </p>
        </div>
      )}
    </div>
  );
}
