export default function drawTransactions({
  balances,
  transactionsSummary,
  transactionsBarHeight,
  dimensions: { width },
  xScale,
  yScale,
  ledgerContainer,
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
    .style("fill", (d) => {
      if (d.type === "buy") return "green";
      if (d.type === "sell") return "red";
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
    .style("font-weight", "bold");
}
