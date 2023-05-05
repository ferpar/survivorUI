import React, { useRef, useEffect } from "react";
import { BacktestContext } from "../../core/Providers/BacktestProvider";
import {
  select,
  scaleBand,
  scaleLinear,
  axisBottom,
  axisLeft,
  min,
  max,
} from "d3";
import useResizeObserver from "../../core/hooks/useResizeObserver";
import { ChartWrapper, Chart } from "./HeatMap.styled";

const margins = {
  top: 20,
  right: 20,
  bottom: 20,
  left: 40,
};

const HeatMap = ({}) => {
  const wrapperRef = useRef();
  const svgRef = useRef();

  const dimensions = useResizeObserver(wrapperRef);
  const { width, height } = dimensions || {
    width: 0,
    height: 0,
  };

  const { heatMapData } = React.useContext(BacktestContext);

  useEffect(() => {
    const svg = select(svgRef.current);
    if (!dimensions) return;
    if (!heatMapData?.data?.length) return;

    const xScale = scaleBand()
      .domain(heatMapData.limitLabels)
      .range([margins.left, width - margins.right])
      .padding(0.1);

    svg
      .selectAll(".x-axis")
      .data([null])
      .join("g")
      .attr("class", "x-axis")
      .style("font-size", 15)
      .attr("transform", `translate(0, ${height - margins.bottom})`)
      .call(
        axisBottom(xScale).tickValues(
          xScale.domain().filter((d, i) => !((i + 1) % 2))
        )
      );

    const yScale = scaleBand()
      .domain(heatMapData.stopLabels)
      .range([height - margins.bottom, margins.top])
      .padding(0.1);

    svg
      .selectAll(".y-axis")
      .data([null])
      .join("g")
      .attr("class", "y-axis")
      .style("font-size", 15)
      .attr("transform", `translate(${margins.left}, 0)`)
      .call(axisLeft(yScale));

    const colorScale = scaleLinear()
      .domain([
        min(heatMapData.data, (dataPoint) => dataPoint.profitLoss),
        1,
        0.95 * max(heatMapData.data, (dataPoint) => dataPoint.profitLoss),
        max(heatMapData.data, (dataPoint) => dataPoint.profitLoss),
      ])
      .range(["black", "white", "green", "blue"]);

    const borderRadius = 3;

    const samples = svg
      .selectAll("rect")
      .data(heatMapData.data)
      .join("rect")
      .attr("x", (d) => xScale(d.limit))
      .attr("y", (d) => yScale(d.stop))
      .attr("width", xScale.bandwidth())
      .attr("height", yScale.bandwidth())
      .attr("rx", borderRadius)
      .attr("ry", borderRadius)
      .style("fill", (d) => colorScale(d.profitLoss))
      .style("cursor", "pointer");

    const tooltip = select("body")
      .selectAll(".tooltip-heatmap")
      .data([null])
      .join("div")
      .attr("class", "tooltip-heatmap")
      .style("position", "absolute")
      .style("top", 0)
      .style("background-color", "white")
      .style("padding", "5px")
      .style("border", "1px solid black")
      .style("border-radius", "5px")
      .style("opacity", 0);

    const tooltipDisplacement = { x: 20, y: -60 };

    samples
      .on("mouseover", (event, d) => {
        tooltip
          .style("opacity", 1)
          .style("display", "block")
          .style("left", `${event.pageX + tooltipDisplacement.x}px`)
          .style("top", `${event.pageY + tooltipDisplacement.y}px`)
          .html(
            `Limit: ${d.limit}<br/>Stop: ${d.stop}<br/>Profit/Loss: ${d.profitLoss}`
          );
      })
      .on("mouseout", () => {
        tooltip.style("opacity", 0).style("display", "none");
      })
      .on("mousemove", (event) => {
        tooltip
          .style("left", `${event.pageX + tooltipDisplacement.x}px`)
          .style("top", `${event.pageY + tooltipDisplacement.y}px`)
          .style("opacity", 1)
          .style("display", "block");
      });
  }, [dimensions, heatMapData]);

  return (
    <ChartWrapper ref={wrapperRef}>
      <Chart ref={svgRef} />
    </ChartWrapper>
  );
};

export default HeatMap;
