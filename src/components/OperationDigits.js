import React from "react";
import { ACTIONS } from "./Calculator";

const OperationDigits = ({ dispatch, operation }) => {
  return (
    <button
      onClick={() =>
        dispatch({ type: ACTIONS.CHOOSE_OPERATION, payload: { operation } })
      }
    >
      {operation}
    </button>
  );
};

export default OperationDigits;
