import React from "react";
import useHeatmapData from "../../hooks/useHeatMapData";
import useMapMarketData from "../../hooks/useMapMarketData";

export const BacktestContext = React.createContext({
  marketData: {},
  heatMapData: {},
});

const initialState = {
  startDate: new Date("2021-02-18").getTime(),
  endDate: new Date("2022-02-18").getTime(),
  short: false,
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

  const marketData = useMapMarketData(formState);
  const heatMapData = useHeatmapData(formState);

  console.log(formState);
  return (
    <BacktestContext.Provider
      value={{
        marketData,
        heatMapData,
        formState,
        setStartDate,
        setEndDate,
        setShort,
      }}
    >
      {children}
    </BacktestContext.Provider>
  );
};

export default BacktestProvider;
