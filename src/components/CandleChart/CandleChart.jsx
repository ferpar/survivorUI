import React, { useRef, useEffect } from "react";
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

const CandleChart = ({ marketData: data, withLogScale = true }) => {
  const wrapperRef = useRef();
  const svgRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);
  const { width, height } = dimensions || {
    width: 0,
    height: 0,
  };

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
  }, [data, dimensions, margins, withLogScale]);

  return (
    <ChartWrapper ref={wrapperRef}>
      <Chart ref={svgRef} />
    </ChartWrapper>
  );
};

export default CandleChart;
