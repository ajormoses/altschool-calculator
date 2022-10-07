import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartSimple,
  faMoon,
  faSun,
} from "@fortawesome/free-solid-svg-icons";

import ButtonDigits from "./ButtonDigits";

import OperationDigits from "./OperationDigits";

import React, { useReducer, useState } from "react";

export const ACTIONS = {
  ADD_DIGIT: "add-digit",
  CHOOSE_OPERATION: "choose-operation",
  CLEAR: "clear",
  DELETE_DIGIT: "delete-digit",
  EVALUATE: "evaluate",
};

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          currentOperand: payload.digit,
          overwrite: false,
        };
      }
      if (payload.digit === "0" && state.currentOperand === "0") {
        return state;
      }
      if (payload.digit === "." && state.currentOperand.includes(".")) {
        return state;
      }

      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`,
      };
    case ACTIONS.CHOOSE_OPERATION:
      if (state.currentOperand == null && state.previousOperand == null) {
        return state;
      }

      if (state.currentOperand == null) {
        return {
          ...state,
          operation: payload.operation,
        };
      }

      if (state.previousOperand == null) {
        return {
          ...state,
          operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null,
        };
      }

      return {
        ...state,
        previousOperand: evaluate(state),
        operation: payload.operation,
        currentOperand: null,
      };
    case ACTIONS.CLEAR:
      return {};
    case ACTIONS.DELETE_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          currentOperand: null,
        };
      }
      if (state.currentOperand == null) return state;
      if (state.currentOperand.length === 1) {
        return { ...state, currentOperand: null };
      }

      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1),
      };
    case ACTIONS.EVALUATE:
      if (
        state.operation == null ||
        state.currentOperand == null ||
        state.previousOperand == null
      ) {
        return state;
      }

      return {
        ...state,
        overwrite: true,
        previousOperand: null,
        operation: null,
        currentOperand: evaluate(state),
      };
  }
}

function evaluate({ currentOperand, previousOperand, operation }) {
  const prev = parseFloat(previousOperand);
  const current = parseFloat(currentOperand);
  if (isNaN(prev) || isNaN(current)) return "";
  let computation = "";
  switch (operation) {
    case "+":
      computation = prev + current;
      break;
    case "-":
      computation = prev - current;
      break;
    case "x":
      computation = prev * current;
      break;
    case "÷":
      computation = prev / current;
      break;
    case "%":
      computation = (prev / 100) * current;
      break;
  }

  return computation.toString();
}

const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
});
function formatOperand(operand) {
  if (operand == null) return;
  const [integer, decimal] = operand.split(".");
  if (decimal == null) return INTEGER_FORMATTER.format(integer);
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`;
}

const Calculator = () => {
  const [theme, setTheme] = useState(true);

  const handleClick = () => {
    setTheme((prevTheme) => !prevTheme);
    document.body.classList.toggle("dark-theme");
  };

  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(
    reducer,
    {}
  );

  return (
    <>
      <div className="container">
        <main>
          <header>
            <div className="screen">
              <div className="screen-header">
                <FontAwesomeIcon className="bar" icon={faChartSimple} />
                <p>Standard</p>
                <div className="toggle-theme" onClick={handleClick}>
                  {theme ? (
                    <FontAwesomeIcon icon={faMoon} />
                  ) : (
                    <FontAwesomeIcon icon={faSun} />
                  )}
                </div>
              </div>
              <div className="screen-content">
                <div className="screen-content-text">
                  <p className="previous-operand">
                    {formatOperand(previousOperand)} {operation}
                  </p>
                  <h1 className="current-operand">
                    {formatOperand(currentOperand)}
                  </h1>
                </div>
              </div>
            </div>
          </header>
          <div className="main-content">
            <div className="first-col div-col">
              <div>MC</div>
              <div>MR</div>
              <div>M+</div>
              <div>M-</div>
              <div>MS</div>
              <div>M'</div>
            </div>
            <div className="second-col button-col">
              <OperationDigits operation="%" dispatch={dispatch} />
              <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>
                CE
              </button>
              <button onClick={() => dispatch({ type: ACTIONS.CLEAR })}>
                AC
              </button>
              <OperationDigits operation="÷" dispatch={dispatch} />
            </div>
            <div className="third-col button-col">
              <ButtonDigits digit="7" dispatch={dispatch} />
              <ButtonDigits digit="8" dispatch={dispatch} />
              <ButtonDigits digit="9" dispatch={dispatch} />
              <OperationDigits operation="x" dispatch={dispatch} />
            </div>
            <div className="fourth-col button-col">
              <ButtonDigits digit="4" dispatch={dispatch} />
              <ButtonDigits digit="5" dispatch={dispatch} />
              <ButtonDigits digit="6" dispatch={dispatch} />
              <OperationDigits operation="-" dispatch={dispatch} />
            </div>
            <div className="fifth-col button-col">
              <ButtonDigits digit="1" dispatch={dispatch} />
              <ButtonDigits digit="2" dispatch={dispatch} />
              <ButtonDigits digit="3" dispatch={dispatch} />
              <OperationDigits operation="+" dispatch={dispatch} />
            </div>
            <div className="sixth-col button-col ">
              <ButtonDigits digit="" dispatch={dispatch} />
              <ButtonDigits digit="0" dispatch={dispatch} />
              <ButtonDigits digit="." dispatch={dispatch} />
              <button
                className="equal-to"
                onClick={() => dispatch({ type: ACTIONS.EVALUATE })}
              >
                =
              </button>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Calculator;
