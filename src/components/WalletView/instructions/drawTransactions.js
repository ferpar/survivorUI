import { select } from "d3-selection";
export default function drawTransactions({
  balances,
  transactionsSummary,
  transactionsBarHeight,
  dimensions: { width },
  xScale,
  yScale,
  ledgerContainer,
  setSelectedDate,
}) {
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
    .style("cursor", "pointer")
    .style("fill", (d) => {
      if (d.type === "buy" || d.type === "short") return "green";
      if (d.type === "sell" || d.type === "shortCover") return "red";
      return "black";
    });

  transactionGroups
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
    .style("font-weight", "bold")
    .style("pointer-events", "none");

  // Tooltip

  const maxTooltipWidth = 100;
  const tooltip = select("body")
    .selectAll(".tooltip-walletView-transaction")
    .data([null])
    .join("div")
    .attr("class", "tooltip-walletView-transaction")
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
    return { x: tooFarRight ? -maxTooltipWidth : 20, y: -80 };
  };

  transactionRects
    .on("mouseenter", (event, d) => {
      const date = new Date(d.date);
      const dateStr = `${
        date.getMonth() + 1
      }/${date.getDate()}/${date.getFullYear()}`;
      const { pageX, pageY } = event;
      const { x: xOffset, y: yOffset } = getTooltipDisplacement(event);
      tooltip
        .style("opacity", 1)
        .style("display", "block")
        .style("left", pageX + xOffset + "px")
        .style("top", pageY + yOffset + "px")
        .html(
          `<div><strong>${d.type}</strong>: <span>${d.amount}</span></div><div>${dateStr}</div>`
        );
    })
    .on("mouseleave", (event, d) => {
      tooltip.style("opacity", 0).style("display", "none");
    })
    .on("mousemove", (event, d) => {
      const { pageX, pageY } = event;
      const { x: xOffset, y: yOffset } = getTooltipDisplacement(event);
      tooltip
        .style("left", pageX + xOffset + "px")
        .style("top", pageY + yOffset + "px");
    })
    .on("click", (event, d) => {
      setSelectedDate(new Date(d.date).getTime());
    });
}
