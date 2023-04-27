import { useEffect, useState } from "react";

type RawMarketDatum = [Date, number, number, number, number];

export interface MarketDatum {
  date: Date;
  open: number;
  high: number;
  low: number;
  close: number;
}

type marketDataMapper = () => MarketDatum[];

const fetchJson = async (url: string) => {
  const response = await fetch(url);
  return response.json();
};

// Description: This hook is used to map the market data from the API to the format that the chart library expects
const useMapMarketData: marketDataMapper = (): MarketDatum[] => {
  const [data, setData] = useState<MarketDatum[]>([]);

  // Parameters for the backtest
  const stop = 0.9;
  const limit = 1.1;
  const startTimestamp = 1613668497310;
  const endTimestamp = 1645204714307;
  const baseAmount = 1000;
  const quoteAmount = 0;
  const maxSoldiers = 10;
  const amountPerSoldier = 100;
  const short = false;

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
  }, []);

  return data;
};

export default useMapMarketData;
