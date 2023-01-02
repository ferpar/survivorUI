import React, { useRef, useEffect } from "react";
import { select, scaleBand, scaleLinear, axisBottom, axisLeft } from "d3";
import useResizeObserver from "../core/hooks/useResizeObserver";
import useHeatMapData from "../core/hooks/useHeatMapData";
import { ChartWrapper, Chart } from "./HeatMap.styled";

const data = [
  {
    X1: 1,
    X2: 1,
    value: 1,
  },
  {
    X1: 1,
    X2: 2,
    value: 2,
  },
  {
    X1: 1,
    X2: 3,
    value: 3,
  },
  {
    X1: 2,
    X2: 1,
    value: 2,
  },
  {
    X1: 2,
    X2: 2,
    value: 3,
  },
  {
    X1: 2,
    X2: 3,
    value: 1,
  },
  {
    X1: 3,
    X2: 1,
    value: 3,
  },
  {
    X1: 3,
    X2: 2,
    value: 1,
  },
  {
    X1: 3,
    X2: 3,
    value: 2,
  },
];

// [1, 2, 3],
// [2, 3, 1],
// [3, 1, 2],

const xLabels = [1, 2, 3];
const yLabels = [1, 2, 3];

const margins = {
  top: 20,
  right: 20,
  bottom: 20,
  left: 40,
};

const HeatMap = ({ rawData }) => {
  const wrapperRef = useRef();
  const svgRef = useRef();

  const dimensions = useResizeObserver(wrapperRef);
  const { width, height } = dimensions || {
    width: 0,
    height: 0,
  };

  const heatMapData = useHeatMapData(rawData);
  console.log(heatMapData);

  useEffect(() => {
    const svg = select(svgRef.current);
    if (!dimensions) return;

    const xScale = scaleBand()
      .domain(xLabels)
      .range([margins.left, width - margins.right])
      .padding(0.1);

    svg
      .selectAll("x-axis")
      .data([null])
      .join("g")
      .attr("class", "x-axis")
      .style("font-size", 15)
      .attr("transform", `translate(0, ${height - margins.bottom})`)
      .call(axisBottom(xScale));

    const yScale = scaleBand()
      .domain(yLabels)
      .range([margins.top, height - margins.bottom])
      .padding(0.1);

    svg
      .selectAll("y-axis")
      .data([null])
      .join("g")
      .attr("class", "y-axis")
      .style("font-size", 15)
      .call(axisLeft(yScale));

    const colorScale = scaleLinear()
      .domain([1, 3])
      .range(["#ffffff", "#ff0000"]);

    svg
      .selectAll("rect")
      .data(data)
      .join("rect")
      .attr("x", (d, i) => xScale(d.X1))
      .attr("y", (d, i) => yScale(d.X2))
      .attr("width", xScale.bandwidth())
      .attr("height", yScale.bandwidth())
      .style("fill", (d) => colorScale(d.value));
  }, [dimensions]);

  return (
    <ChartWrapper ref={wrapperRef}>
      <Chart ref={svgRef} />
    </ChartWrapper>
  );
};

export default HeatMap;
