import { select } from "d3";
export default function ledgerRects({
  balances,
  xScale,
  yScale,
  ledgerContainer,
  dimensions: { width },
}) {
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
}
