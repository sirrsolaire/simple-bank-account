import { useReducer, useRef } from "react";
import "./index.css";

/*
INSTRUCTIONS / CONSIDERATIONS:

1. Let's implement a simple bank account! It's similar to the example that I used as an analogy to explain how useReducer works, but it's simplified (we're not using account numbers here)

2. Use a reducer to model the following state transitions: openAccount, deposit, withdraw, requestLoan, payLoan, closeAccount. Use the `initialState` below to get started.

3. All operations (expect for opening account) can only be performed if isActive is true. If it's not, just return the original state object. You can check this right at the beginning of the reducer

4. When the account is opened, isActive is set to true. There is also a minimum deposit amount of 500 to open an account (which means that the balance will start at 500)

5. Customer can only request a loan if there is no loan yet. If that condition is met, the requested amount will be registered in the 'loan' state, and it will be added to the balance. If the condition is not met, just return the current state

6. When the customer pays the loan, the opposite happens: the money is taken from the balance, and the 'loan' will get back to 0. This can lead to negative balances, but that's no problem, because the customer can't close their account now (see next point)

7. Customer can only close an account if there is no loan, AND if the balance is zero. If this condition is not met, just return the state. If the condition is met, the account is deactivated and all money is withdrawn. The account basically gets back to the initial state
*/

const initialState = {
  balance: 0,
  loan: 0,
  isActive: false,
  openAccount: true,
  deposit: 150,
  withdraw: 50,
  requestLoan: 5000,
  payLoan: 5000,
  closeAccount: false,
};
function reducer(state, action) {
  switch (action.type) {
    case "deposit":
      return { ...state, balance: state.balance + state.deposit };
    case "withdraw":
      return {
        ...state,
        balance:
          state.balance > 0 ? state.balance - state.withdraw : state.balance,
      };
    case "requestLoan":
      if (state.loan === 0) {
        return {
          ...state,
          balance: state.balance + state.requestLoan,
          loan: state.loan + state.requestLoan,
        };
      } else {
        alert("You can only get one loan before you pay off your debt.");
        return state;
      }
    // return {
    //   ...state,
    //   balance:
    //     state.loan === 0 ? state.balance + state.requestLoan : state.balance,
    //   loan: state.loan === 0 ? state.loan + state.requestLoan : state.loan,
    // };
    case "payLoan":
      if (state.balance >= state.loan) {
        return {
          ...state,
          balance: state.balance - state.loan,
          loan: state.loan - state.loan,
        };
      } else {
        alert("Not Enough Balance");
        return state; // If the balance is not enough, we return the current state without any changes.
      }

    case "active":
      return {
        ...state,
        isActive: action.payload,
        balance: state.balance + 500,
      };
    case "close":
      if (state.loan === 0 && state.balance === 0) {
        return { ...state, isActive: action.payLoad };
      } else {
        alert("Balance and loan must be 0");
        return state;
      }
    // return {
    //   ...state,
    //   isActive:
    //     state.loan === 0 && state.balance === 0
    //       ? action.payLoad
    //       : state.isActive,
    // };
    default:
      throw new Error("Unknown");
  }
}
export default function App() {
  const [
    {
      balance,
      loan,
      isActive,
      openAccount,
      deposit,
      withdraw,
      requestLoan,
      closeAccount,
    },
    dispatch,
  ] = useReducer(reducer, initialState);

  return (
    <div className="App">
      <header>Bank Account</header>
      <div className="wrapper">
        <div className="buttons">
          <button
            onClick={() => dispatch({ type: "active", payload: openAccount })}
            disabled={isActive}
          >
            Open account
          </button>

          <button
            onClick={() => dispatch({ type: "deposit" })}
            disabled={!isActive}
          >
            Deposit {deposit}
          </button>

          <button
            onClick={() => dispatch({ type: "withdraw" })}
            disabled={!isActive}
          >
            Withdraw {withdraw}
          </button>

          <button
            onClick={() => dispatch({ type: "requestLoan" })}
            disabled={!isActive}
          >
            Request a loan of {requestLoan}
          </button>

          <button
            onClick={() => dispatch({ type: "payLoan" })}
            disabled={!isActive}
          >
            Pay loan
          </button>

          <button
            onClick={() =>
              dispatch({
                type: "close",
                payload: closeAccount,
              })
            }
            disabled={!isActive}
          >
            Close account
          </button>
        </div>
        <div className="infos">
          <p>Balance: {balance}</p>
          <p className="loan">
            Loan: <span>{loan}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
