import React, { useRef, useEffect } from "react";
import { BacktestContext } from "../../core/Providers/BacktestProvider";
import {
  scaleLinear,
  scaleLog,
  scaleTime,
  axisBottom,
  axisLeft,
  select,
  extent,
  max,
  min,
} from "d3";
import useResizeObserver from "../../core/hooks/useResizeObserver";
import { ChartWrapper, Chart } from "./CandleChart.styled";

const margins = {
  top: 20,
  right: 20,
  bottom: 20,
  left: 40,
};

const CandleChart = ({ withLogScale = true }) => {
  const wrapperRef = useRef();
  const svgRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);
  const { width, height } = dimensions || {
    width: 0,
    height: 0,
  };

  const {
    marketData: { marketData: data },
  } = React.useContext(BacktestContext);

  useEffect(() => {
    const svg = select(svgRef.current);
    if (!dimensions) return;
    if (!data) return;

    const xScale = scaleTime()
      .domain(extent(data, (d) => d.date))
      .range([margins.left, width - margins.right]);

    const yScale = withLogScale
      ? scaleLog()
          .domain([min(data, (d) => d.low), max(data, (d) => d.high)])
          .range([height - margins.bottom, margins.top])
      : scaleLinear()
          .domain([0, max(data, (d) => d.high)])
          .range([height - margins.bottom, margins.top]);

    const candleContainer = svg
      .selectAll(".candle-container")
      .data([null])
      .join("g")
      .attr("class", "candle-container");

    const candleWidth =
      (0.8 * (width - margins.left - margins.right)) / data.length;

    const dependencyFrame = [
      margins,
      dimensions,
      svg,
      candleContainer,
      xScale,
      yScale,
      candleWidth,
    ];

    candleContainer
      .selectAll(".candle")
      .data(data)
      .join("rect")
      .attr("class", "candle")
      .attr("x", (d) => xScale(d.date))
      .attr("y", (d) => (d.open > d.close ? yScale(d.open) : yScale(d.close)))
      .attr("width", candleWidth)
      .attr("height", (d) =>
        d.open > d.close
          ? yScale(d.close) - yScale(d.open)
          : yScale(d.open) - yScale(d.close)
      )
      .attr("fill", (d) => (d.open > d.close ? "red" : "green"));

    candleContainer
      .selectAll(".candle-line")
      .data(data)
      .join("line")
      .attr("class", "candle-line")
      .attr("x1", (d) => xScale(d.date) + candleWidth / 2)
      .attr("x2", (d) => xScale(d.date) + candleWidth / 2)
      .attr("y1", (d) => yScale(d.high))
      .attr("y2", (d) => yScale(d.low))
      .attr("stroke-width", 0.5)
      .attr("stroke", (d) => (d.open > d.close ? "red" : "green"));

    // Add your axes, gridlines, etc. here
    // X axis
    svg
      .selectAll(".x-axis")
      .data([null])
      .join("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0, ${height - margins.bottom})`)
      .call(axisBottom(xScale));

    // Y axis
    svg
      .selectAll(".y-axis")
      .data([null])
      .join("g")
      .attr("class", "y-axis")
      .attr("transform", `translate(${margins.left}, 0)`)
      .call(axisLeft(yScale));

    // Gridlines
    // svg
    //   .selectAll(".gridline")
    //   .data(data)
    //   .join("line")
    //   .attr("class", "gridline")
    //   .attr("x1", (d) => xScale(d.date))
    //   .attr("x2", (d) => xScale(d.date))
    //   .attr("y1", margins.top)
    //   .attr("y2", height - margins.bottom)
    //   .attr("stroke-width", 0.5)
    //   .attr("stroke", "lightgray");

    // create rectangle for each candle, with y = 0 as base
    const rectangles = candleContainer
      .selectAll(".tooltip-rect")
      .data(data)
      .join("rect")
      .attr("class", "tooltip-rect")
      .attr("x", (d) => xScale(d.date))
      .attr("y", (d) => yScale(d.high))
      .attr("width", candleWidth)
      .attr("height", (d) => height - margins.bottom - yScale(d.high))
      .attr("fill", "transparent")
      .attr("stroke", "blue")
      .attr("opacity", 0);

    // Hover effect
    rectangles
      .on("mouseover", (event, d) => {
        select(event.target).attr("opacity", 0.5);
      })
      .on("mouseout", (event, d) => {
        select(event.target).attr("opacity", 0);
      });

    // Tooltip
    const maxTooltipWidth = 200;
    const tooltip = select("body")
      .selectAll(".tooltip-candles")
      .data([null])
      .join("div")
      .attr("class", "tooltip-candles")
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
      return { x: tooFarRight ? -maxTooltipWidth : 20, y: -140 };
    };

    rectangles
      .on("mouseenter", (event, d) => {
        const date = new Date(d.date);
        const dateStr = date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
        const precision = 5;
        const open = parseFloat(d.open).toPrecision(precision);
        const high = parseFloat(d.high).toPrecision(precision);
        const low = parseFloat(d.low).toPrecision(precision);
        const close = parseFloat(d.close).toPrecision(precision);
        const tooltipHTML = `
          <div>Date: ${dateStr}</div>
          <div>Open: ${open}</div>
          <div>High: ${high}</div>
          <div>Low: ${low}</div>
          <div>Close: ${close}</div>
        `;
        tooltip
          .style("opacity", 1)
          .style("display", "block")
          .style("left", event.pageX + getTooltipDisplacement(event).x + "px")
          .style("top", event.pageY + getTooltipDisplacement(event).y + "px")
          .html(tooltipHTML);
      })
      .on("mouseleave", (event, d) => {
        tooltip.style("opacity", 0).style("display", "none");
      })
      .on("mousemove", (event, d) => {
        tooltip
          .style("left", event.pageX + getTooltipDisplacement(event).x + "px")
          .style("top", event.pageY + getTooltipDisplacement(event).y + "px");
      });
  }, [data, dimensions, margins, withLogScale]);

  return (
    <ChartWrapper ref={wrapperRef}>
      <Chart ref={svgRef} />
    </ChartWrapper>
  );
};

export default CandleChart;
