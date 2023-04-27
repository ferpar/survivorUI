import React from "react";
import useHeatmapData from "../../hooks/useHeatMapData";
import useMapMarketData from "../../hooks/useMapMarketData";

export const BacktestContext = React.createContext({
  marketData: {},
  heatMapData: {},
});

const BacktestProvider = ({ children }) => {
  const marketData = useMapMarketData();
  const heatMapData = useHeatmapData();

  return (
    <BacktestContext.Provider
      value={{
        marketData,
        heatMapData,
      }}
    >
      {children}
    </BacktestContext.Provider>
  );
};

export default BacktestProvider;
