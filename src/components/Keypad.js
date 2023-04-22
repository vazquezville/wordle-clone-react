import React, { useContext } from "react";
import { WordleContext } from "../context/Context";

export default function Keypad() {
  const { usedKeys, handleKeyup } = useContext(WordleContext);

  //Every line is a different array
  const keys1 = [
    {
      key: "Q",
    },
    {
      key: "W",
    },
    {
      key: "E",
    },
    {
      key: "R",
    },
    {
      key: "T",
    },
    {
      key: "Y",
    },
    {
      key: "U",
    },
    {
      key: "I",
    },
    {
      key: "O",
    },
    {
      key: "P",
    },
  ];
  const keys2 = [
    {
      key: "A",
    },
    {
      key: "S",
    },
    {
      key: "D",
    },
    {
      key: "F",
    },
    {
      key: "G",
    },
    {
      key: "H",
    },
    {
      key: "J",
    },
    {
      key: "K",
    },
    {
      key: "L",
    },
  ];
  const keys3 = [
    {
      key: "Z",
    },
    {
      key: "X",
    },
    {
      key: "C",
    },
    {
      key: "V",
    },
    {
      key: "B",
    },
    {
      key: "N",
    },
    {
      key: "M",
    },
  ];

  return (
    <div className="keypad">
      <div className="line1">
        {keys1.map((key) => {
          return (
            <div
              key={key.key}
              className={usedKeys[key.key]}
              onClick={async () => {
                await handleKeyup(key);
              }}
            >
              {key.key}
            </div>
          );
        })}
      </div>
      <div className="line2">
        {keys2.map((key) => {
          return (
            <div
              key={key.key}
              className={usedKeys[key.key]}
              onClick={async () => {
                await handleKeyup(key);
              }}
            >
              {key.key}
            </div>
          );
        })}
      </div>
      <div className="line3">
        <div
          className="enter"
          onClick={async () => {
            await handleKeyup({ key: "Enter" });
          }}
        >
          ENTER
        </div>
        {keys3.map((key) => {
          return (
            <div
              key={key.key}
              className={usedKeys[key.key]}
              onClick={async () => {
                await handleKeyup(key);
              }}
            >
              {key.key}
            </div>
          );
        })}
        <div
          className="backward"
          onClick={async () => {
            await handleKeyup({ key: "Backspace" });
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24"
            viewBox="0 0 24 24"
            width="24"
          >
            <path
              fill="var(--color-tone-1)"
              d="M22 3H7c-.69 0-1.23.35-1.59.88L0 12l5.41 8.11c.36.53.9.89 1.59.89h15c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H7.07L2.4 12l4.66-7H22v14zm-11.59-2L14 13.41 17.59 17 19 15.59 15.41 12 19 8.41 17.59 7 14 10.59 10.41 7 9 8.41 12.59 12 9 15.59z"
            ></path>
          </svg>
        </div>
      </div>
    </div>
  );
}
