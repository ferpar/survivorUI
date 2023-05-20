import React, { ReactNode } from "react";

export const MarketsContext = React.createContext<any | null>(null);

const fetchJson = async (url: string) => {
  const response = await fetch(url);
  const json = await response.json();
  return json;
};

const MarketsProvider = ({ children }: { children: ReactNode }) => {
  const [availableMarkets, setAvailableMarkets] = React.useState<any>(null);

  React.useEffect(() => {
    (async () => {
      const availableMarkets = await fetchJson("http://localhost:3000/markets");
      setAvailableMarkets(availableMarkets);
    })();
  }, []);

  return (
    <MarketsContext.Provider value={{ availableMarkets: availableMarkets }}>
      {children}
    </MarketsContext.Provider>
  );
};

export default MarketsProvider;
