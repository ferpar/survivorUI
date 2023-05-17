import { area, curveStepAfter } from "d3";

export default function drawAreas({
  balances,
  xScale,
  yScale,
  ledgerContainer,
}) {
  // create an area path from the base amounts and y = 0 as base
  const quoteArea = area()
    .x((d) => xScale(d.date))
    .y0((d) => yScale(0))
    .y1((d) => yScale(d.quote))
    .curve(curveStepAfter)(balances);

  const baseArea = area()
    .x((d) => xScale(d.date))
    .y0((d) => yScale(d.quote))
    .y1((d) => yScale(d.balance))
    .curve(curveStepAfter)(balances);

  const ledgerAreas = [
    {
      name: "quote",
      area: quoteArea,
      color: "green",
    },
    {
      name: "base",
      area: baseArea,
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
}
