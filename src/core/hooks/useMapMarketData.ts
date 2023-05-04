import { useEffect, useState } from "react";

type RawMarketDatum = [Date, number, number, number, number];

export interface MarketDatum {
  date: Date;
  open: number;
  high: number;
  low: number;
  close: number;
}

type marketDataMapper = (formState: {
  startDate: number;
  endDate: number;
  short: boolean;
  baseAmount: number;
  maxSoldiers: number;
  amountPerSoldier: number;
  stop: number;
  limit: number;
}) => MarketDatum[];

const fetchJson = async (url: string) => {
  const response = await fetch(url);
  return response.json();
};

// Description: This hook is used to map the market data from the API to the format that the chart library expects
const useMapMarketData: marketDataMapper = ({
  startDate,
  endDate,
  short = false,
  baseAmount = 1000,
  maxSoldiers = 10,
  amountPerSoldier = 100,
  stop = 0.1,
  limit = 0.5,
}) => {
  const [data, setData] = useState<MarketDatum[]>([]);

  // Parameters for the backtest
  const startTimestamp = new Date(startDate).getTime();
  const endTimestamp = new Date(endDate).getTime();
  const quoteAmount = 0;

  useEffect(() => {
    /* Example URL: http://localhost:3000/backtest
      ?stop=0.9&limit=1.1&
      startTimestamp=1449446400000&
      endTimestamp=1659225600000&
      baseAmount=1000&
      quoteAmount=0&
      maxSoldiers=10&
      amountPerSoldier=100&
      short=false */
    // fetch data from API
    (async () => {
      const marketDataRawResponse: any = await fetchJson(
        `http://localhost:3000/backtest` +
          `?stop=${stop}&limit=${limit}&startTimestamp=${startTimestamp}&` +
          `endTimestamp=${endTimestamp}&baseAmount=${baseAmount}&` +
          `quoteAmount=${quoteAmount}&maxSoldiers=${maxSoldiers}&` +
          `amountPerSoldier=${amountPerSoldier}&short=${short}`
      );

      const marketDataRaw: RawMarketDatum[] = marketDataRawResponse?.marketData;

      if (!marketDataRaw) return;
      const marketData = marketDataRaw.map((market) => {
        const [timestamp, open, high, low, close] = market;
        return {
          date: new Date(timestamp),
          open: open,
          high: high,
          low: low,
          close: close,
        };
      });
      setData(marketData);
    })();
  }, [startDate, endDate, short, baseAmount, maxSoldiers, amountPerSoldier]);

  return data;
};

export default useMapMarketData;
