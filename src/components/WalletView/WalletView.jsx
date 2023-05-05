import React from "react";
import { BacktestContext } from "../../core/Providers/BacktestProvider";
import {
  scaleLinear,
  scaleTime,
  axisBottom,
  axisLeft,
  select,
  extent,
  max,
  min,
  area,
  curveStepAfter,
} from "d3";
import useResizeObserver from "../../core/hooks/useResizeObserver";
import { ChartWrapper, Chart } from "./WalletView.styled";

const margins = {
  top: 20,
  right: 20,
  bottom: 20,
  left: 40,
};

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
  const squads = context?.marketData?.squads;
  const ledger = context?.marketData?.wallet?.ledger;
  const initialAmount = context?.formState.baseAmount; // not considering the quote amount for now

  React.useEffect(() => {
    if (!dimensions) return;
    if (!priceSeries || !wallet || !squads || !ledger) return;

    // data preprocessing
    // using an object to avoid duplicates
    const ledgerObject = ledger.reduce((acc, entry) => {
      acc[entry.date] = entry;
      return acc;
    }, {});
    // transform object to array
    const ledgerEntries = Object.values(ledgerObject);

    // update each price series entry with the balance at that date
    // based on the ledger entries
    const balances = priceSeries.map((entry, idx) => {
      const currentDateStr = entry.date;
      // amount of quote in ledger at date is found in latest ledger entry
      // with date <= current date
      let ledgerEntry = ledgerEntries
        .filter((entry) => new Date(entry.date) <= new Date(currentDateStr))
        .pop();
      // if no such ledger entry found, use the last one
      // useful at the end of the series
      if (!ledgerEntry) {
        ledgerEntry = ledgerEntries[ledgerEntries.length - 1];
      }
      return {
        quote: ledgerEntry.quote,
        base: ledgerEntry.base,
        date: currentDateStr,
        balance: ledgerEntry.quote * entry.close + ledgerEntry.base, // close or open??
      };
    });

    // graphical instructions
    const svg = select(svgRef.current);

    const xScale = scaleTime()
      .domain(extent(balances, (d) => d.date))
      .range([margins.left, width - margins.right]);

    const yScale = scaleLinear()
      .domain([0, max(balances, (d) => d.balance)])
      .range([height - margins.bottom, margins.top]);

    const xAxis = axisBottom(xScale);
    svg
      .selectAll(".x-axis")
      .data([null])
      .join("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0, ${height - margins.bottom})`)
      .call(xAxis);

    const yAxis = axisLeft(yScale);
    svg
      .selectAll(".y-axis")
      .data([null])
      .join("g")
      .attr("class", "y-axis")
      .attr("transform", `translate(${margins.left}, 0)`)
      .call(yAxis);

    const ledgerContainer = svg
      .selectAll(".wallet-container")
      .data([null])
      .join("g")
      .attr("class", "wallet-container");

    // create an area path from the base amounts and y = 0 as base

    const baseArea = area()
      .x((d) => xScale(d.date))
      .y0((d) => yScale(0))
      .y1((d) => yScale(d.base))
      .curve(curveStepAfter)(balances);

    const quoteArea = area()
      .x((d) => xScale(d.date))
      .y0((d) => yScale(d.base))
      .y1((d) => yScale(d.balance))
      .curve(curveStepAfter)(balances);

    const ledgerAreas = [
      {
        name: "base",
        area: baseArea,
        color: "green",
      },
      {
        name: "quote",
        area: quoteArea,
        color: "red",
      },
    ];

    ledgerContainer
      .selectAll(".ledger-area")
      .data(ledgerAreas)
      .join("path")
      .attr("class", "ledger-area")
      .attr("fill", "green")
      .attr("opacity", 0.5)
      .attr("d", baseArea)
      .attr("d", (d) => d.area)
      .attr("fill", (d) => d.color);
  }, [dimensions, priceSeries, wallet, squads, ledger, initialAmount]);

  return (
    <ChartWrapper ref={wrapperRef}>
      <Chart ref={svgRef} />
    </ChartWrapper>
  );
};

export default WalletView;
