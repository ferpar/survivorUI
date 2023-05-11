import { axisBottom, axisLeft } from "d3";

export default function drawAxes({
  margins,
  svg,
  dimensions: { height },
  xScale,
  yScale,
}) {
  const xAxis = axisBottom(xScale);
  const yAxis = axisLeft(yScale);

  svg
    .selectAll(".x-axis")
    .data([null])
    .join("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0, ${height - margins.bottom})`)
    .call(xAxis);

  svg
    .selectAll(".y-axis")
    .data([null])
    .join("g")
    .attr("class", "y-axis")
    .attr("transform", `translate(${margins.left}, 0)`)
    .call(yAxis);
}
