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
import useWalletData from "./useWalletData";
import { drawAxes, drawAreas } from "./instructions";

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
          .html(`<p>Balance: ${balance} (open)</p> 
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

    // create a group for each transaction date
    const transactionGroups = ledgerContainer
      .selectAll(".transaction-group")
      .data(transactionsSummary)
      .join("g")
      .attr("class", "transaction-group")
      .attr("transform", (d) => `translate(${xScale(new Date(d[0].date))}, 0)`);

    // create a rect for each transaction in the group
    const transactionRects = transactionGroups
      .selectAll(".transaction-rect")
      .data((d) => d)
      .join("rect")
      .attr("class", "transaction-rect")
      .attr("x", 0)
      .attr("y", (d) => {
        if (d.type === "buy" || d.type === "short") return yScale(0);
        return yScale(0) + transactionsBarHeight / 2;
      })
      .attr("width", (d) => {
        if (d.nextDate) {
          return xScale(new Date(d.nextDate)) - xScale(new Date(d.date));
        }
        return width / balances.length;
      })
      .attr("height", transactionsBarHeight / 2)
      .style("fill", (d) => {
        if (d.type === "buy") return "green";
        if (d.type === "sell") return "red";
        return "black";
      });

    const transactionTexts = transactionGroups
      .selectAll(".transaction-text")
      .data((d) => d)
      .join("text")
      .attr("class", "transaction-text")
      .attr("x", 0)
      .attr("y", (d) => {
        if (d.type === "buy" || d.type === "short") return yScale(0);
        return yScale(0) + transactionsBarHeight / 2;
      })
      .attr("dx", 5)
      .attr("dy", 15)
      .text((d) => d.amount)
      .style("fill", "white")
      .style("font-size", "12px")
      .style("font-weight", "bold");
  }, [dimensions, priceSeries, wallet, ledger]);

  return (
    <ChartWrapper ref={wrapperRef}>
      <Chart ref={svgRef} />
    </ChartWrapper>
  );
};

export default WalletView;
