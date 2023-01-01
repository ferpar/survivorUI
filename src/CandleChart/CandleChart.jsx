import React, { useRef, useEffect } from "react";
import {
  scaleLinear,
  scaleTime,
  axisBottom,
  axisLeft,
  select,
  extent,
  max,
} from "d3";
import useResizeObserver from "../core/hooks/useResizeObserver";
import { ChartWrapper, Chart } from "./CandleChart.styled";

const CandleChart = ({ marketData: data }) => {
  const wrapperRef = useRef();
  const svgRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);
  const { width, height } = dimensions || {
    width: 0,
    height: 0,
  };

  const margins = {
    top: 20,
    right: 20,
    bottom: 20,
    left: 20,
  };

  useEffect(() => {
    const svg = select(svgRef.current);
    if (!dimensions) return;
    if (!data) return;

    const xScale = scaleTime()
      .domain(extent(data, (d) => d.date))
      .range([margins.left, width - margins.right]);

    const yScale = scaleLinear()
      .domain([0, max(data, (d) => d.high)])
      .range([height - margins.bottom, margins.top]);

    svg
      .selectAll(".candle")
      .data(data)
      .join("rect")
      .attr("class", "candle")
      .attr("x", (d) => xScale(d.date))
      .attr("y", (d) => yScale(d.high))
      .attr("width", 2)
      .attr("height", (d) => yScale(d.low) - yScale(d.high))
      .attr("fill", (d) => (d.open > d.close ? "red" : "green"));

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
  }, [data, dimensions]);

  return (
    <ChartWrapper ref={wrapperRef}>
      <Chart ref={svgRef} />
    </ChartWrapper>
  );
};

export default CandleChart;
