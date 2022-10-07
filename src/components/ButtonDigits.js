import React from "react";
import { ACTIONS } from "./Calculator";

const ButtonDigits = ({ dispatch, digit }) => {
  return (
    <button
      onClick={() => dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit } })}
    >
      {digit}
    </button>
  );
};

export default ButtonDigits;
