import React, { useEffect, useContext } from "react";
import Grid from "./Grid";
import Keypad from "./Keypad";
import EndGame from "./EndGame";
import { WordleContext } from "../context/Context";

export default function Wordle() {
  const { solution, showModalEndGame, handleKeyup } = useContext(WordleContext);

  //Trigger the handleKeyup function from useWordle everytime a keyup event is detected
  useEffect(() => {
    window.addEventListener("keyup", handleKeyup);

    return () => {
      window.removeEventListener("keyup", handleKeyup);
    };
  }, [handleKeyup]);

  return (
    <>
      {solution && (
        <>
          {/*<div>Solution: {solution}</div>*/}
          <Grid />
          <Keypad />
          {showModalEndGame && <EndGame />}
        </>
      )}
    </>
  );
}
