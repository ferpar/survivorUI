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
        balance: ledgerEntry.quote * entry.open + ledgerEntry.base, // close or open??
        id: idx,
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

    // create an area for each entry in the ledgerAreas array
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

    // create a rect for each entry in the balances array x0 = date, x1 = next date, y0 = 0, y1 = balance
    const ledgerRects = ledgerContainer
      .selectAll(".ledger-rect")
      .data(balances)
      .join("rect")
      .attr("class", "ledger-rect")
      .attr("id", (d) => d.id)
      .attr("x", (d) => xScale(d.date))
      .attr("y", (d) => yScale(d.balance))
      .attr("width", (d, idx) => {
        if (idx === balances.length - 1) return width / balances.length;
        return xScale(balances[idx + 1].date) - xScale(d.date);
      })
      .attr("height", (d) => yScale(0) - yScale(d.balance))
      .attr("stroke", "blue")
      .attr("fill", "transparent")
      .attr("opacity", 0);

    // HOVER EFFECTS
    // add a mouseover event to the ledger rects, showing the area for the balance
    ledgerRects
      .on("mouseover", (event, d) => {
        select(event.target).attr("opacity", 0.5);
      })
      .on("mouseout", (event, d) => {
        select(event.target).attr("opacity", 0);
      });

    // add a tooltip to the ledger rects, showing the balance and date

    // TOOLTIP
    const maxTooltipWidth = 200;
    const tooltip = select("body")
      .selectAll(".tooltip-walletView")
      .data([null])
      .join("div")
      .attr("class", "tooltip-walletView")
      .style("position", "absolute")
      .style("top", 0)
      .style("background-color", "white")
      .style("width", maxTooltipWidth + "px")
      .style("padding", "5px")
      .style("border", "1px solid black")
      .style("border-radius", "5px")
      .style("opacity", 0)
      .style("pointer-events", "none");

    const getTooltipDisplacement = (event) => {
      const tooFarRight = event.pageX + maxTooltipWidth > width;
      return { x: tooFarRight ? -maxTooltipWidth : 20, y: -120 };
    };

    ledgerRects
      .on("mouseenter", (event, d) => {
        const date = new Date(d.date);
        const dateStr = date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
        const precision = 4;
        const balance = d.balance.toFixed(2);
        const quote =
          d.quote < Math.pow(10, -precision) ? 0 : d.quote.toPrecision(4);
        const tooltipDisplacement = getTooltipDisplacement(event);
        tooltip
          .style("opacity", 1)
          .style("display", "block")
          .style("left", event.pageX + tooltipDisplacement.x + "px")
          .style("top", event.pageY + tooltipDisplacement.y + "px")
          .html(`<p>Balance: ${balance}</p> 
          <p>Quote: ${quote}</p>
          <p>Base Balance: ${d.base.toFixed(2)}</p>
          <p>at ${dateStr}</p>`);
      })
      .on("mouseleave", (event, d) => {
        tooltip.style("opacity", 0).style("display", "none");
      })
      .on("mousemove", (event, d) => {
        const tooltipDisplacement = getTooltipDisplacement(event);
        tooltip
          .style("left", event.pageX + tooltipDisplacement.x + "px")
          .style("top", event.pageY + tooltipDisplacement.y + "px");
      });
  }, [dimensions, priceSeries, wallet, squads, ledger]);

  return (
    <ChartWrapper ref={wrapperRef}>
      <Chart ref={svgRef} />
    </ChartWrapper>
  );
};

export default WalletView;
