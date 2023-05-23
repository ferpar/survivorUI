import React from "react";
import { FieldSet, Legend } from "../BackOptions.styles";
import {
  BacktestContext,
  IBacktestContext,
} from "../../../core/Providers/BacktestProvider";

const IntervalSelector = () => {
  const {
    formState: { startDate, endDate, short },
    setStartDate,
    setEndDate,
    setShort,
  }: IBacktestContext = React.useContext(BacktestContext);

  const startDateISO = new Date(startDate).toISOString().split("T")[0];
  const endDateISO = new Date(endDate).toISOString().split("T")[0];

  const dateChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "backtest-start") {
      setStartDate(new Date(value).getTime());
    } else if (name === "backtest-end") {
      setEndDate(new Date(value).getTime());
    }
  };

  const shortChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    if (name === "short") {
      setShort(checked);
    }
  };
  return (
    <FieldSet>
      <Legend>Interval Selection</Legend>
      <label htmlFor="start-date">
        <span>Start Date</span>
        <input
          type="date"
          id="start-date"
          name="backtest-start"
          value={startDateISO}
          onChange={dateChangeHandler}
        />
      </label>
      <label htmlFor="end-date">
        <span>End Date</span>
        <input
          type="date"
          id="end-date"
          name="backtest-end"
          value={endDateISO}
          onChange={dateChangeHandler}
        />
      </label>
      <label htmlFor="short-check">
        <span>Short</span>
        <input
          type="checkbox"
          id="short-check"
          name="short"
          checked={short}
          onChange={shortChangeHandler}
        />
      </label>
    </FieldSet>
  );
};
export default IntervalSelector;
