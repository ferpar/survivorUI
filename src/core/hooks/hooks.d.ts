declare function useMapMarketData(
  marketDataRaw: RawMarketDatum[]
): MarketDatum[];

// declare and export interface for form state
export interface FormState {
  startDate: number;
  endDate: number;
  short: boolean;
  quoteAmount: number;
  maxSoldiers: number;
  amountPerSoldier: number;
  stop: number;
  limit: number;
}
