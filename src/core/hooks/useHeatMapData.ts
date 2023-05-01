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

export interface HeatMapData {
  data: DataPoint[];
  limitLabels: number[];
  stopLabels: number[];
  stats: {
    min: number;
    max: number;
    mean: number;
    median: number;
    std: number;
  };
}

const fetchJson = async (url: string) => {
  const response = await fetch(url);
  return response.json();
};

interface FormState {
  startDate: number;
  endDate: number;
  short: boolean;
  baseAmount: number;
  maxSoldiers: number;
  amountPerSoldier: number;
}

type useHeatMapData = (formState: FormState) => HeatMapData;

const useHeatMapData: useHeatMapData = ({
  startDate,
  endDate,
  short = false,
  baseAmount = 1000,
  maxSoldiers = 10,
  amountPerSoldier = 100,
}) => {
  const [heatMapData, setHeatMapData] = useState<HeatMapData>(
    {} as HeatMapData
  );

  const startTimestamp = new Date(startDate).getTime();
  const endTimestamp = new Date(endDate).getTime();
  const quoteAmount = 0;

  useEffect(() => {
    (async () => {
      /* Example url `http://localhost:3000/marginheatmap
      ?startTimestamp=1449446400000&
      endTimestamp=1659225600000&
      baseAmount=1000&
      quoteAmount=0&
      maxSoldiers=10&
      amountPerSoldier=100&
      short=false`*/
      const heatMapDataRaw = await fetchJson(
        `http://localhost:3000/marginheatmap` +
          `?startTimestamp=${startTimestamp}&endTimestamp=${endTimestamp}&baseAmount=${baseAmount}` +
          `&quoteAmount=${quoteAmount}&maxSoldiers=${maxSoldiers}` +
          `&amountPerSoldier=${amountPerSoldier}&short=${short}`
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
            limit: Number(Math.round(marginLimit * 100)),
            stop: Number(Math.round(marginStop * 100)),
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

      const plArray = heatMapDataPoints.map((point) => point.profitLoss);

      const min = Math.min(...plArray);
      const max = Math.max(...plArray);
      const mean = plArray.reduce((a, b) => a + b, 0) / plArray.length;
      const median = [...plArray].sort()[Math.floor(plArray.length / 2)];
      const std = Math.sqrt(
        plArray.map((x) => Math.pow(x - mean, 2)).reduce((a, b) => a + b, 0) /
          plArray.length
      ); // standard deviation

      const newHeatMapData: HeatMapData = {
        data: heatMapDataPoints,
        limitLabels: labels.limit,
        stopLabels: labels.stop,
        stats: {
          min,
          max,
          mean,
          median,
          std,
        },
      };

      setHeatMapData(newHeatMapData);
    })();
  }, [startDate, endDate, short, baseAmount, maxSoldiers, amountPerSoldier]);

  return heatMapData;
};

export default useHeatMapData;
