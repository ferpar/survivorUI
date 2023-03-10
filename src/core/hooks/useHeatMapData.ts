import { useState, useEffect } from "react";

interface BacktestConfig {
  margin: number;
  marginStop: number;
  marginLimit: number;
  maxSoldiers: number;
  amountPerSoldier: number;
}

interface Transaction {
  date: Date;
  type: "buy" | "sell" | "deposit" | "withdraw";
}

interface InitialTransaction extends Transaction {
  amount: number;
}

interface Wallet {
  baseCurrency: string;
  quoteCurrency: string;
  balance: number;
  baseBalance: number;
  quoteBalance: number;
}

interface BacktestResult {
  config: BacktestConfig;
  wallet: Wallet;
  soldiers: {
    deadSoldiers: number;
    extractedSoldiers: number;
  };
}

interface Labels {
  limit: number[];
  stop: number[];
}

interface RawSimulationResult {
  backtestResults: BacktestResult[];
  labels: Labels;
}

interface DataPoint {
  limit: number;
  stop: number;
  profitLoss: number;
  baseBalance?: number;
  quoteBalance?: number;
  maxSoldiers?: number;
  amountPerSoldier?: number;
  deadSoldiers?: number;
  extractedSoldiers?: number;
  short?: boolean;
}

interface HeatMapData {
  data: DataPoint[];
  limitLabels: number[];
  stopLabels: number[];
}

const fetchJson = async (url: string) => {
  const response = await fetch(url);
  return response.json();
};

export default function useHeatMapData() {
  const [heatMapData, setHeatMapData] = useState<HeatMapData>(
    {} as HeatMapData
  );

  const startTimestamp = 1643668497310;
  const endTimestamp = 1679225600000;
  const baseAmount = 1000;
  const quoteAmount = 0;
  const maxSoldiers = 10;
  const amountPerSoldier = 100;
  const short = false;

  useEffect(() => {
    (async () => {
      // Example url `http://localhost:3000/marginheatmap?startTimestamp=1449446400000&endTimestamp=1659225600000&baseAmount=1000&quoteAmount=0&maxSoldiers=10&amountPerSoldier=100&short=false`
      const heatMapDataRaw = await fetchJson(
        `http://localhost:3000/marginheatmap?startTimestamp=${startTimestamp}&endTimestamp=${endTimestamp}&baseAmount=${baseAmount}&quoteAmount=${quoteAmount}&maxSoldiers=${maxSoldiers}&amountPerSoldier=${amountPerSoldier}&short=${short}`
      );

      const { backtestResults, labels }: RawSimulationResult = heatMapDataRaw;

      const heatMapDataPoints: DataPoint[] = backtestResults.map(
        (result): DataPoint => {
          const { config, wallet, soldiers } = result;
          const { marginStop, marginLimit, maxSoldiers, amountPerSoldier } =
            config;
          const { deadSoldiers, extractedSoldiers } = soldiers;
          const { balance, baseBalance, quoteBalance } = wallet;
          return {
            limit: Number(parseInt(Math.round(marginLimit * 100))),
            stop: Number(parseInt(Math.round(marginStop * 100))),
            profitLoss: balance / baseAmount,
            baseBalance,
            quoteBalance,
            maxSoldiers,
            amountPerSoldier,
            deadSoldiers,
            extractedSoldiers,
            short,
          };
        }
      );

      const newHeatMapData: HeatMapData = {
        data: heatMapDataPoints,
        limitLabels: labels.limit,
        stopLabels: labels.stop,
      };

      setHeatMapData(newHeatMapData);
    })();
  }, []);

  return heatMapData;
}
