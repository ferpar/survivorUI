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
      console.log(availableMarkets);
      setAvailableMarkets(availableMarkets);
    })();
  }, []);

  return (
    <MarketsContext.Provider value={{ availableMarkets }}>
      {children}
    </MarketsContext.Provider>
  );
};

export default MarketsProvider;
