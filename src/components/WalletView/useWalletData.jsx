import React from "react";

function useWalletData({ priceSeries, wallet, ledger }) {
  const [balances, setBalances] = React.useState(null);
  const [transactionsSummary, setTransactionsSummary] = React.useState(null);

  React.useEffect(() => {
    if (!priceSeries || !wallet || !ledger) {
      setBalances(null);
      setTransactionsSummary(null);
      return;
    }
    // Ledger
    // using an object to avoid duplicates
    const ledgerObject = ledger.reduce((acc, entry) => {
      acc[entry.date] = entry;
      return acc;
    }, {});
    // transform object to array
    const ledgerEntries = Object.values(ledgerObject);

    // update each price series entry with the balance at that date
    // based on the ledger entries
    const balances = priceSeries.map((entry, idx) => {
      const currentDateStr = entry.date;
      // amount of quote in ledger at date is found in latest ledger entry
      // with date <= current date
      let ledgerEntry = ledgerEntries
        .filter((entry) => new Date(entry.date) <= new Date(currentDateStr))
        .pop();
      // if no such ledger entry found, use the last one
      // useful at the end of the series
      if (!ledgerEntry) {
        ledgerEntry = ledgerEntries[ledgerEntries.length - 1];
      }
      return {
        quote: ledgerEntry.quote,
        base: ledgerEntry.base,
        date: currentDateStr,
        balance: ledgerEntry.quote * entry.open + ledgerEntry.base, // close or open??
        id: idx,
      };
    });

    // Transactions
    // object with date as keys and array of transactions as values
    const transactionsByDate = wallet.transactions.reduce((acc, entry) => {
      const date = entry.date;
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(entry);
      return acc;
    }, {});
    console.log(transactionsByDate);

    // array of transactions
    const transactionsArray = Object.values(transactionsByDate);

    const transactionsSummary = transactionsArray.map((entry, idx) => {
      const periodSummary = [];
      const date = entry[0].date;
      const numberOfBuys = entry.filter((entry) => entry.type === "buy").length;
      const numberOfSells = entry.filter(
        (entry) => entry.type === "sell"
      ).length;
      const numberOfShorts = entry.filter(
        (entry) => entry.type === "short"
      ).length;
      const numberOfCovers = entry.filter(
        (entry) => entry.type === "shortCover"
      ).length;
      const nextDateIndex = priceSeries.findIndex(
        (entry) => new Date(entry.date).getTime() === new Date(date).getTime()
      );
      const nextDate = priceSeries[nextDateIndex + 1]?.date;

      if (numberOfBuys > 0) {
        periodSummary.push({
          date: date,
          type: "buy",
          amount: numberOfBuys,
          nextDate: nextDate,
        });
      }

      if (numberOfSells > 0) {
        periodSummary.push({
          date: date,
          type: "sell",
          amount: numberOfSells,
          nextDate: nextDate,
        });
      }

      if (numberOfShorts > 0) {
        periodSummary.push({
          date: date,
          type: "short",
          amount: numberOfShorts,
          nextDate: nextDate,
        });
      }

      if (numberOfCovers > 0) {
        periodSummary.push({
          date: date,
          type: "shortCover",
          amount: numberOfCovers,
          nextDate: nextDate,
        });
      }

      return periodSummary;
    });

    setBalances(balances);
    setTransactionsSummary(transactionsSummary);
  }, [priceSeries, wallet, ledger]);

  return {
    balances,
    transactionsSummary,
  };
}

export default useWalletData;
