import React from "react";
import useHeatmapData from "../../hooks/useHeatMapData";
import useMapMarketData from "../../hooks/useMapMarketData";

export const BacktestContext = React.createContext({
  marketData: {},
  heatMapData: {},
});

const threeMonthsAgo = new Date(
  new Date().setMonth(new Date().getMonth() - 3)
).getTime();
const now = new Date().getTime();

const initialState = {
  startDate: threeMonthsAgo,
  endDate: now,
  short: false,
  maxSoldiers: 10, //max soldiers per squad
  baseAmount: 1000, //initial base capital amount per squad
  amountPerSoldier: 100, //initial amount per soldier
  stop: 0.1, //stop loss
  limit: 0.5, //take profit
};

// timestamp for start and end date at initialState in milliseconds

function reducer(state, action) {
  switch (action.type) {
    case "startDate":
      return { ...state, startDate: action.payload };
    case "endDate":
      return { ...state, endDate: action.payload };
    case "short":
      return { ...state, short: action.payload };
    case "maxSoldiers":
      return { ...state, maxSoldiers: action.payload };
    case "baseAmount":
      return { ...state, baseAmount: action.payload };
    case "amountPerSoldier":
      return { ...state, amountPerSoldier: action.payload };
    case "stop":
      return { ...state, stop: action.payload };
    case "limit":
      return { ...state, limit: action.payload };
    default:
      throw new Error();
  }
}

const BacktestProvider = ({ children }) => {
  const [formState, dispatch] = React.useReducer(reducer, initialState);
  const setStartDate = (startDate) =>
    dispatch({ type: "startDate", payload: startDate });
  const setEndDate = (endDate) =>
    dispatch({ type: "endDate", payload: endDate });
  const setShort = (short) => dispatch({ type: "short", payload: short });
  const setMaxSoldiers = (maxSoldiers) =>
    dispatch({ type: "maxSoldiers", payload: maxSoldiers });
  const setBaseAmount = (baseAmount) =>
    dispatch({ type: "baseAmount", payload: baseAmount });
  const setAmountPerSoldier = (amountPerSoldier) =>
    dispatch({ type: "amountPerSoldier", payload: amountPerSoldier });
  const setStop = (stop) => dispatch({ type: "stop", payload: stop });
  const setLimit = (limit) => dispatch({ type: "limit", payload: limit });

  const marketData = useMapMarketData(formState);
  const heatMapData = useHeatmapData(formState);

  return (
    <BacktestContext.Provider
      value={{
        marketData,
        heatMapData,
        formState,
        setStartDate,
        setEndDate,
        setShort,
        setMaxSoldiers,
        setBaseAmount,
        setAmountPerSoldier,
        setStop,
        setLimit,
      }}
    >
      {children}
    </BacktestContext.Provider>
  );
};

export default BacktestProvider;
