import React, { createContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

export const WordleContext = createContext();

export const WordleProvider = ({ children }) => {
  const [turn, setTurn] = useState(0); //Attempt number, 6 tries in total (0-5)
  const [currentGuess, setCurrentGuess] = useState(""); //Current letters pressed (0-5), when pressed enter, will be a word stored in the guesses array
  const [guesses, setGuesses] = useState([...Array(6)]); //Contain the record of used words, an array of objects, each word will be an object splitted into letters and colors for the tile
  const [history, setHistory] = useState([]); //Contain the record of used words, an array with strings
  const [usedKeys, setUsedKeys] = useState({}); //An object that stores the pressed keys and their colors after the word verification

  const [solution, setSolution] = useState(null); //Current word to be guessed
  const [showModalEndGame, setShowModalEndGame] = useState(false); //Modal control view

  const [isCorrect, setIsCorrect] = useState(false);

  const [stats, setStats] = useState({});

  var isLoading = false; //Check if game already is setup or request a new word on load the app

  useEffect(() => {
    if (isLoading) return;
    isLoading = true;

    let wordleClone = JSON.parse(localStorage.getItem("wordleClone"));

    //Check if we have a game in progress, then abort the request for a new word
    if (
      wordleClone !== null &&
      wordleClone.currentGame &&
      !wordleClone.isFinished
    ) {
      setSolution(wordleClone.currentGameInfo.solution);
      setGuesses(replaceNullWithUndefined(wordleClone.currentGameInfo.guesses));
      setHistory(replaceNullWithUndefined(wordleClone.currentGameInfo.history));
      setUsedKeys(wordleClone.currentGameInfo.usedKeys);
      setTurn(parseInt(wordleClone.currentGameInfo.turn));
      setCurrentGuess(
        replaceEmtpyStringWithUndefined(
          wordleClone.currentGameInfo.currentGuess
        )
      );
      setStats(wordleClone);

      return;
    }

    //Check if the game is in progress and was already solved, if is so, request a new game
    if (wordleClone !== null && wordleClone.isFinished) {
      newGame();
      return;
    }

    //If is the first time, store a default object with the data needed
    if (wordleClone === null) {
      wordleClone = {
        played: 0,
        win: 0,
        streak: 0,
        maxStreak: 0,
        guess1: 0,
        guess2: 0,
        guess3: 0,
        guess4: 0,
        guess5: 0,
        guess6: 0,
        maxGuess: 0,
        isFinished: false,
        currentGame: false,
        currentGameInfo: {
          solution: "",
          guesses: [...Array(6)],
          history: [],
          usedKeys: [],
          turn: 0,
          currentGuess: "",
        },
      };
      setStats(wordleClone);
      localStorage.setItem("wordleClone", JSON.stringify(wordleClone));
    }

    requestWord();
  }, []);

  //Reset all the vars and request a new word to start a new game
  const newGame = async () => {
    setTurn(0);
    setIsCorrect(false);
    setShowModalEndGame(false);
    setCurrentGuess("");
    setGuesses([...Array(6)]);
    setHistory([]);
    setUsedKeys({});

    let wordleClone = JSON.parse(localStorage.getItem("wordleClone"));
    wordleClone.isFinished = false;
    wordleClone.currentGame = true;
    wordleClone.currentGameInfo = {
      guesses: [...Array(6)],
      history: [],
      usedKeys: {},
      turn: 0,
      currentGuess: "",
    };
    localStorage.setItem("wordleClone", JSON.stringify(wordleClone));

    await requestWord();
  };

  //when we store undefine values from the array they become null, we need to format them when recovering
  function replaceNullWithUndefined(arr) {
    return arr.map((value) => (value === null ? undefined : value));
  }
  function replaceEmtpyStringWithUndefined(string) {
    return string === undefined ? "" : string;
  }

  //Function to request the word
  const requestWord = async () => {
    const options = {
      method: "GET",
      headers: {
        /*"X-RapidAPI-Key": "YOUR KEY HERE",*/
        "X-RapidAPI-Host": "random-word-api.p.rapidapi.com",
      },
    };

    await fetch("https://random-word-api.p.rapidapi.com/L/5", options)
      .then((response) => response.json())
      .then((response) => {
        //console.log(response.word);
        setSolution(response.word.toUpperCase());
      })
      .catch((err) => {
        console.error(err);
      });
  };

  //Write the new solution received
  useEffect(() => {
    if (solution) {
      let wordleClone = JSON.parse(localStorage.getItem("wordleClone"));
      wordleClone.currentGame = true;
      wordleClone.currentGameInfo.solution = solution;
      localStorage.setItem("wordleClone", JSON.stringify(wordleClone));
    }
  }, [solution]);

  //Save the stats after every turn and if the game is finished show the modal after 2 sec
  useEffect(() => {
    if (turn > 5 && !isCorrect) {
      saveStats(false, turn);

      setTimeout(() => {
        modifyShowModalEndGame(true);
      }, 2000);
      return;
    }
    saveCurrentGame();
  }, [turn]);

  //Or save the stats when the word is guessed and show the modal after 2 sec
  useEffect(() => {
    if (isCorrect) {
      saveStats(true, turn - 1);
      setTimeout(() => {
        modifyShowModalEndGame(true);
      }, 2000);
    }
  }, [isCorrect]);

  //Check the game state and save it for the user stats
  const saveStats = (correct, attempt) => {
    let wordleClone = JSON.parse(localStorage.getItem("wordleClone"));

    //Mark the game as finished
    wordleClone.isFinished = true;

    //Sum one more played game
    wordleClone.played = parseInt(wordleClone.played) + 1;

    //Reset the streak if the user has failed and save the stats
    if (!correct) {
      wordleClone.streak = 0;
      localStorage.setItem("wordleClone", JSON.stringify(wordleClone));
      setStats(wordleClone);
      return;
    }

    //Sum one more win, also to the streak
    wordleClone.win = parseInt(wordleClone.win) + 1;
    wordleClone.streak = parseInt(wordleClone.streak) + 1;

    //Update the maxStreak if the current streak is higher
    if (wordleClone.streak > wordleClone.maxStreak) {
      wordleClone.maxStreak = wordleClone.streak;
    }

    //Sum one to the correspondent attempt
    switch (parseInt(attempt)) {
      case 0:
        wordleClone.guess1 = parseInt(wordleClone.guess1) + 1;
        break;
      case 1:
        wordleClone.guess2 = parseInt(wordleClone.guess2) + 1;
        break;
      case 2:
        wordleClone.guess3 = parseInt(wordleClone.guess3) + 1;
        break;
      case 3:
        wordleClone.guess4 = parseInt(wordleClone.guess4) + 1;
        break;
      case 4:
        wordleClone.guess5 = parseInt(wordleClone.guess5) + 1;
        break;
      case 5:
        wordleClone.guess6 = parseInt(wordleClone.guess6) + 1;
        break;
    }

    //Check the turn with more victories
    for (let i = 1; i < 6; i++) {
      if (wordleClone["guess" + i] > wordleClone.maxGuess) {
        wordleClone.maxGuess = i;
      }
    }

    //Save the current state
    localStorage.setItem("wordleClone", JSON.stringify(wordleClone));
    setStats(wordleClone);
  };

  //Function to save the current game state, called after every attempt or when the word is guessed
  const saveCurrentGame = () => {
    let wordleClone = JSON.parse(localStorage.getItem("wordleClone"));

    wordleClone.currentGameInfo.guesses = guesses;
    wordleClone.currentGameInfo.history = history;
    wordleClone.currentGameInfo.usedKeys = usedKeys;
    wordleClone.currentGameInfo.turn = turn;
    wordleClone.currentGameInfo.currentGuess = currentGuess;

    //Save the stats and created them if doesn't exist
    localStorage.setItem("wordleClone", JSON.stringify(wordleClone));
  };

  const modifyTurn = (turn) => {
    setTurn(turn);
  };

  const modifyCurrentGuess = (guess) => {
    setCurrentGuess(guess);
  };

  const modifyGuesses = (guesses) => {
    setGuesses(guesses);
  };

  const modifyHistory = (history) => {
    setHistory(history);
  };

  const modifyIsCorrect = (value) => {
    setIsCorrect(value);
  };

  const modifyUsedKeys = (keys) => {
    setUsedKeys(keys);
  };

  const modifySolution = (solution) => {
    setSolution(solution);
  };

  const modifyShowModalEndGame = (value) => {
    setShowModalEndGame(value);
  };

  //Convert input into an array of objects, each letter will be an element
  const formatGuess = () => {
    //Convert the solution string and the current guess into an array of individual letters
    let solutionArray = [...solution];
    let formattedGuess = [...currentGuess].map((letter) => {
      return { key: letter, color: "grey" };
    });

    //Check the matches and changes the value if is needed
    //Exact same position in the word = green
    formattedGuess.forEach((letter, i) => {
      if (solutionArray[i] === letter.key) {
        formattedGuess[i].color = "green";
        solutionArray[i] = null;
      }
    });

    //Letter in the solution but incorrect position
    formattedGuess.forEach((letter, i) => {
      if (solutionArray.includes(letter.key) && letter.color !== "green") {
        formattedGuess[i].color = "yellow";
        solutionArray[solutionArray.indexOf(letter.key)] = null;
      }
    });

    return formattedGuess;
  };

  //Manage the state of the guess element (letter exist in the correct position, letter exist but not in that position, letter doesn't exist)
  const addNewGuess = (formattedGuess) => {
    //Win the game, match the exactly word solution
    if (currentGuess === solution) {
      setIsCorrect(true);
    }

    //Update the history array with the word, using turn as index
    setGuesses((prevGuesses) => {
      let newGuesses = [...prevGuesses];
      newGuesses[turn] = formattedGuess;
      return newGuesses;
    });

    setHistory((prevHistory) => {
      return [...prevHistory, currentGuess];
    });

    setTurn((prevTurn) => {
      return prevTurn + 1;
    });

    //Colorized the keys
    setUsedKeys((prevUsedKeys) => {
      let newKeys = { ...prevUsedKeys };

      formattedGuess.forEach((letter) => {
        const currentColor = newKeys[letter.key];

        if (letter.color === "green") {
          newKeys[letter.key] = "green";
          return;
        }

        if (letter.color === "yellow" && currentColor !== "green") {
          newKeys[letter.key] = "yellow";
          return;
        }

        if (
          letter.color === "grey" &&
          currentColor !== "green" &&
          currentColor !== "yellow"
        ) {
          newKeys[letter.key] = "grey";
          return;
        }
      });

      return newKeys;
    });

    //Reset the current guess
    setCurrentGuess("");
  };

  //Manage the keyup
  const handleKeyup = async ({ key }) => {
    //Avoid to write when the game is over
    if (isCorrect || turn > 5) {
      return;
    }

    //Manage the enter event, check if the guess was correct
    if (key === "Enter") {
      //All turns used
      if (turn > 5) {
        return;
      }

      //Avoid duplicated words
      if (history.includes(currentGuess)) {
        toast.error("You already tried that word");
        return;
      }

      //Check if word is 5 characters long
      if (currentGuess.length !== 5) {
        toast.error("Word must be 5 characters long");
        return;
      }

      //Check if word is valid
      //For the moment this function is disabled, sometimes the dictionary api doesn't contain the word
      /*
      const isValid = await isValidWord(currentGuess);
      if (!isValid) {
        toast.error("This word doesn't exist");
        return;
      }
      */

      //Req fulfilled, format the word in order to check it up
      const formattedGuess = formatGuess();
      //Add the word to the history of the current game
      addNewGuess(formattedGuess);
    }

    //Manage de backspace function and delete the previous character if exist
    if (key === "Backspace") {
      modifyCurrentGuess((prevGuess) => {
        return prevGuess.slice(0, -1);
      });
      return;
    }

    //Filter the keypress to let pass just letters when the current guess word is smaller than 5 characters
    if (/^[A-Za-z]$/.test(key) && currentGuess.length < 5) {
      setCurrentGuess((prevGuess) => {
        return prevGuess + key.toUpperCase();
      });
    }
  };

  //Check if the word exist, not used right now
  const isValidWord = async (word) => {
    const options = {
      method: "GET",
      headers: {
        /*"X-RapidAPI-Key": "YOUR KEY HERE",*/
        "X-RapidAPI-Host": "dictionary-by-api-ninjas.p.rapidapi.com",
      },
    };

    return await fetch(
      "https://dictionary-by-api-ninjas.p.rapidapi.com/v1/dictionary?word=" +
        word,
      options
    )
      .then((response) => response.json())
      .then((response) => {
        //console.log(response.valid);
        return response.valid;
      })
      .catch((err) => console.error(err));
  };

  return (
    <WordleContext.Provider
      value={{
        turn,
        modifyTurn,
        currentGuess,
        modifyCurrentGuess,
        guesses,
        modifyGuesses,
        history,
        modifyHistory,
        isCorrect,
        modifyIsCorrect,
        usedKeys,
        modifyUsedKeys,
        solution,
        modifySolution,
        showModalEndGame,
        modifyShowModalEndGame,
        handleKeyup,
        newGame,
        stats,
      }}
    >
      {children}
    </WordleContext.Provider>
  );
};
