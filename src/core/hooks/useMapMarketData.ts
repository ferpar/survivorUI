import { useEffect, useState } from "react";
import { FormState } from "./hooks";

type RawMarketDatum = [Date, number, number, number, number];

export interface MarketDatum {
  date: Date;
  open: number;
  high: number;
  low: number;
  close: number;
}

type marketDataMapper = (formState: FormState) => MarketDatum[];

const fetchJson = async (url: string) => {
  const response = await fetch(url);
  return response.json();
};

// Description: This hook is used to map the market data from the API to the format that the chart library expects
const useMapMarketData: marketDataMapper = ({
  startDate,
  endDate,
  short = false,
  quoteAmount = 1000,
  maxSoldiers = 10,
  amountPerSoldier = 100,
  stop = 0.1,
  limit = 0.5,
}) => {
  const [data, setData] = useState<any>({});

  // Parameters for the backtest
  const startTimestamp = new Date(startDate).getTime();
  const endTimestamp = new Date(endDate).getTime();
  const baseAmount = 0;

  useEffect(() => {
    // fetch data from API
    (async () => {
      const marketDataRawResponse: any = await fetchJson(
        `http://localhost:3000/backtest` +
          `?stop=${stop}&limit=${limit}&startTimestamp=${startTimestamp}&` +
          `endTimestamp=${endTimestamp}&quoteAmount=${quoteAmount}&` +
          `baseAmount=${baseAmount}&maxSoldiers=${maxSoldiers}&` +
          `amountPerSoldier=${amountPerSoldier}&short=${short}`
      );

      const marketDataRaw: RawMarketDatum[] = marketDataRawResponse?.marketData;

      if (!marketDataRaw) return;
      const marketDataDated = marketDataRaw.map((market) => {
        const [timestamp, open, high, low, close] = market;
        return {
          date: new Date(timestamp),
          open: open,
          high: high,
          low: low,
          close: close,
        };
      });
      setData({ ...marketDataRawResponse, marketData: marketDataDated });
    })();
  }, [
    startDate,
    endDate,
    short,
    quoteAmount,
    maxSoldiers,
    amountPerSoldier,
    stop,
    limit,
  ]);

  return data;
};

export default useMapMarketData;
