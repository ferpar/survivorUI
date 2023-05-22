import React, { ReactNode } from "react";

export interface IMarketData {
  symbol_id: string;
  exchange_id: string;
  symbol_type: string;
  period_id: string;
  asset_id_base: string;
  asset_id_quote: string;
  data_start?: string;
  data_end?: string;
}

export const MarketsContext = React.createContext<any | null>(null);

const fetchJson = async (url: string) => {
  const response = await fetch(url);
  const json = await response.json();
  return json;
};

const MarketsProvider = ({ children }: { children: ReactNode }) => {
  const [availableMarkets, setAvailableMarkets] = React.useState<any>(null);
  const [selectedMarket, setSelectedMarket] = React.useState<
    IMarketData | undefined
  >();
  const selectMarket = (symbolId: string, periodId: string) => {
    const selectedMarket = availableMarkets.find(
      (market: IMarketData) =>
        market.symbol_id === symbolId && market.period_id === periodId
    );
    setSelectedMarket(selectedMarket);
  };

  React.useEffect(() => {
    (async () => {
      const availableMarkets = await fetchJson("http://localhost:3000/markets");
      setAvailableMarkets(availableMarkets);
      setSelectedMarket(availableMarkets[0]); // select the first market by default
    })();
  }, []);

  return (
    <MarketsContext.Provider
      value={{
        availableMarkets: availableMarkets,
        selectedMarket: selectedMarket,
        selectMarket: selectMarket,
      }}
    >
      {children}
    </MarketsContext.Provider>
  );
};

export default MarketsProvider;
