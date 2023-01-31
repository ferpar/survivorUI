import { useState, useEffect } from 'react';

interface BacktestConfig {
  margin: number,
  marginStop: number,
  marginLimit: number,
  maxSoldiers: number,
  amountPerSoldier: number,
}

interface Transaction {
  date: Date,
  type: 'buy' | 'sell' | 'deposit' | 'withdraw',
}

interface InitialTransaction extends Transaction {
  amount: number,
}

interface Wallet {
  baseCurrency: string,
  quoteCurrency: string,
  balance: number,
  baseBalance: number,
  quoteBalance: number,
}

interface BacktestResult {
  config: BacktestConfig,
  initialTransaction: InitialTransaction
  wallet: Wallet,
}

interface Labels {
  limit: number[],
  stop: number[],
}

interface RawSimulationResult {
  backtestResults: BacktestResult[],
  labels: Labels
}

interface DataPoint {
  limit: number,
  stop: number,
  profitLoss: number,
}

interface HeatMapData {
  data: DataPoint[],
  limitLabels: number[],
  stopLabels: number[],
}

export default function useHeatMapData(heatMapDataRaw: RawSimulationResult) {
  const [heatMapData, setHeatMapData] = useState<HeatMapData>({} as HeatMapData);

  useEffect(() => {

    const { backtestResults, labels } = heatMapDataRaw;

    const heatMapDataPoints: DataPoint[] = backtestResults.map((result): DataPoint => {
      const { config, wallet, initialTransaction } = result;
      const { margin, marginStop, marginLimit, maxSoldiers, amountPerSoldier } = config;
      const { baseCurrency, quoteCurrency, balance, baseBalance, quoteBalance } = wallet;
      const { type, date, amount } = initialTransaction;
      return {
          limit: Number(parseInt(Math.round(marginLimit*100))),
          stop: Number(parseInt(Math.round(marginStop*100))),
          profitLoss: baseBalance/amount
      };
    });

    const newHeatMapData: HeatMapData = {
      data: heatMapDataPoints,
      limitLabels: labels.limit,
      stopLabels: labels.stop,
    };

    setHeatMapData(newHeatMapData);
  }, [heatMapDataRaw])

  return heatMapData
}
