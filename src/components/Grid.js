import React, { useContext } from "react";
import Row from "./Row";
import { WordleContext } from "../context/Context";

export default function Grid() {
  const { currentGuess, guesses, turn } = useContext(WordleContext);

  return (
    <div>
      {/* Loop over the array of objects that has the input words. 
      If the turn equals the index, send the current input letter (currentGuess)
      if not, return the entire object that contains the word */}
      {guesses.map((guess, index) => {
        if (turn === index) {
          return <Row key={index} currentGuess={currentGuess} />;
        }
        return <Row key={index} guess={guess} />;
      })}
    </div>
  );
}
