import React, { ReactNode } from "react";
import useHeatmapData from "../../hooks/useHeatMapData";
import useMapMarketData from "../../hooks/useMapMarketData";
import { FormState } from "../../hooks/hooks";

export interface IBacktestContext {
  marketData: any;
  heatMapData: any;
  formState: FormState;
  setStartDate: (startDate: number) => void;
  setEndDate: (endDate: number) => void;
  setShort: (short: boolean) => void;
  setMaxSoldiers: (maxSoldiers: number) => void;
  setQuoteAmount: (quoteAmount: number) => void;
  setAmountPerSoldier: (amountPerSoldier: number) => void;
  setStop: (stop: number) => void;
  setLimit: (limit: number) => void;
}

const defaultContext: IBacktestContext = {
  marketData: {},
  heatMapData: {},
  formState: {
    startDate: 0,
    endDate: 0,
    short: false,
    maxSoldiers: 0,
    quoteAmount: 0,
    amountPerSoldier: 0,
    stop: 0,
    limit: 0,
  },
  setStartDate: () => {},
  setEndDate: () => {},
  setShort: () => {},
  setMaxSoldiers: () => {},
  setQuoteAmount: () => {},
  setAmountPerSoldier: () => {},
  setStop: () => {},
  setLimit: () => {},
};

export const BacktestContext =
  React.createContext<IBacktestContext>(defaultContext);

const threeMonthsAgo = new Date(
  new Date().setMonth(new Date().getMonth() - 3)
).getTime();
const now = new Date().getTime();

const initialState = {
  startDate: threeMonthsAgo,
  endDate: now,
  short: false,
  maxSoldiers: 10, //max soldiers per squad
  quoteAmount: 1000, //initial Quote capital amount per squad
  amountPerSoldier: 100, //initial amount per soldier
  stop: 0.1, //stop loss
  limit: 0.5, //take profit
};

// timestamp for start and end date at initialState in milliseconds

type FormAction =
  | { type: "startDate"; payload: number }
  | { type: "endDate"; payload: number }
  | { type: "short"; payload: boolean }
  | { type: "maxSoldiers"; payload: number }
  | { type: "quoteAmount"; payload: number }
  | { type: "amountPerSoldier"; payload: number }
  | { type: "stop"; payload: number }
  | { type: "limit"; payload: number };

function reducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case "startDate":
      return { ...state, startDate: action.payload };
    case "endDate":
      return { ...state, endDate: action.payload };
    case "short":
      return { ...state, short: action.payload };
    case "maxSoldiers":
      return { ...state, maxSoldiers: action.payload };
    case "quoteAmount":
      return { ...state, quoteAmount: action.payload };
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

const BacktestProvider = ({ children }: { children: ReactNode }) => {
  const [formState, dispatch] = React.useReducer(reducer, initialState);
  const setStartDate = (startDate: number) =>
    dispatch({ type: "startDate", payload: startDate });
  const setEndDate = (endDate: number) =>
    dispatch({ type: "endDate", payload: endDate });
  const setShort = (short: boolean) =>
    dispatch({ type: "short", payload: short });
  const setMaxSoldiers = (maxSoldiers: number) =>
    dispatch({ type: "maxSoldiers", payload: maxSoldiers });
  const setQuoteAmount = (quoteAmount: number) =>
    dispatch({ type: "quoteAmount", payload: quoteAmount });
  const setAmountPerSoldier = (amountPerSoldier: number) =>
    dispatch({ type: "amountPerSoldier", payload: amountPerSoldier });
  const setStop = (stop: number) => dispatch({ type: "stop", payload: stop });
  const setLimit = (limit: number) =>
    dispatch({ type: "limit", payload: limit });

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
        setQuoteAmount,
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
