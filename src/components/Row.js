import React, { useState, useEffect } from "react";

export default function Row({ guess, currentGuess }) {
  //Format and split the current word typed (currentGuess) into an array, each letter will be an element to print in a tile
  const [letters, setLetters] = useState([]);

  useEffect(() => {
    if (!currentGuess) {
      return;
    }

    setLetters(currentGuess.split(""));
  }, [currentGuess]);

  return (
    <>
      {/* If a guess exist, we are receiving the entire word, colorized it */}
      {guess && (
        <div className="row past">
          {guess.map((letter, index) => {
            return (
              <div key={index} className={letter.color}>
                {letter.key}
              </div>
            );
          })}
        </div>
      )}
      {/* We are receiving a letter that is already stored in our array letters, loop all the array letters and print every item into a different tile*/}
      {currentGuess && letters.length > 0 && (
        <div className="row current">
          {letters.map((letter, index) => {
            return (
              <div key={index} className="filled">
                {letter}
              </div>
            );
          })}
          {[...Array(5 - letters.length)].map((_, index) => {
            return <div key={index}></div>;
          })}
        </div>
      )}
      {/* No input letter either full word, return 5 empty tiles */}
      {!guess && !currentGuess && (
        <div className="row">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      )}
    </>
  );
}
