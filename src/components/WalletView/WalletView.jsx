import React from "react";
import { BacktestContext } from "../../core/Providers/BacktestProvider";
import { scaleLinear, scaleTime, select, extent, max } from "d3";
import useResizeObserver from "../../core/hooks/useResizeObserver";
import { ChartWrapper, Chart } from "./WalletView.styled";
import useWalletData from "./useWalletData";
import {
  drawAxes,
  drawAreas,
  drawLedgerRects,
  drawTransactions,
} from "./instructions";

const margins = {
  top: 20,
  right: 20,
  bottom: 20,
  left: 40,
};

const transactionsBarHeight = 40;

const WalletView = () => {
  const wrapperRef = React.useRef();
  const svgRef = React.useRef();
  const dimensions = useResizeObserver(wrapperRef);
  const { width, height } = dimensions || {
    width: 0,
    height: 0,
  };

  const context = React.useContext(BacktestContext);
  const priceSeries = context?.marketData?.marketData;
  const wallet = context?.marketData?.wallet;
  // const squads = context?.marketData?.squads;
  const ledger = context?.marketData?.wallet?.ledger;

  const { balances, transactionsSummary } = useWalletData({
    priceSeries,
    wallet,
    ledger,
  });

  React.useEffect(() => {
    if (!dimensions) return;
    if (!balances || !transactionsSummary) return;

    // graphical instructions
    const svg = select(svgRef.current);

    const xScale = scaleTime()
      .domain(extent(balances, (d) => d.date))
      .range([margins.left, width - margins.right]);

    const yScale = scaleLinear()
      .domain([0, max(balances, (d) => d.balance)])
      .range([height - margins.bottom - transactionsBarHeight, margins.top]);

    const ledgerContainer = svg
      .selectAll(".wallet-container")
      .data([null])
      .join("g")
      .attr("class", "wallet-container");

    const dependencyFrame = {
      balances,
      transactionsSummary,
      margins,
      transactionsBarHeight,
      dimensions,
      svg,
      xScale,
      yScale,
      ledgerContainer,
    };

    drawAxes(dependencyFrame);
    drawAreas(dependencyFrame);
    drawLedgerRects(dependencyFrame);
    drawTransactions(dependencyFrame);
  }, [dimensions, balances, transactionsSummary]);

  return (
    <ChartWrapper ref={wrapperRef}>
      <Chart ref={svgRef} />
    </ChartWrapper>
  );
};

export default WalletView;
