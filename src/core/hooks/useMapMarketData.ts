import { useEffect, useState } from 'react';

type RawMarketDatum = [Date, number, number, number, number];

interface MarketDatum {
  date: Date;
  open: number;
  high: number;
  low: number;
  close: number;
}

type marketDataMapper = (marketDataRaw: RawMarketDatum[]) => MarketDatum[];

// Description: This hook is used to map the market data from the API to the format that the chart library expects
const useMapMarketData : marketDataMapper = (marketDataRaw : RawMarketDatum[]): MarketDatum[] => {
  const [data, setData] = useState<MarketDatum[]>([]);

  useEffect(() => {
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
  }, [marketDataRaw]);

  return data;
};

export default useMapMarketData;
