import React from "react";
import {
  FieldSet,
  Legend,
  ShortInput,
  IntervalModes,
  IntervalMode,
} from "../BackOptions.styles";
import {
  BacktestContext,
  IBacktestContext,
} from "../../../core/Providers/BacktestProvider";
import {
  IMarketsContext,
  MarketsContext,
} from "../../../core/Providers/MarketsProvider";

const IntervalSelector = () => {
  const {
    formState: { startDate, endDate, short },
    setStartDate,
    setEndDate,
    setShort,
  }: IBacktestContext = React.useContext(BacktestContext);

  const { selectedMarket }: IMarketsContext = React.useContext(MarketsContext);

  // possible values: normal, lastXPeriods, nextXPeriods
  const [dateCalulcation, setDateCalculation] = React.useState("normal");
  const [numPeriods, setNumPeriods] = React.useState(45);

  const startDateISO = new Date(startDate).toISOString().split("T")[0];
  const endDateISO = new Date(endDate).toISOString().split("T")[0];

  const selectedPeriod = selectedMarket?.period_id
    ? selectedMarket.period_id
    : "1DAY";

  const dateChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "backtest-start") {
      setStartDate(new Date(value).getTime());
    } else if (name === "backtest-end") {
      setEndDate(new Date(value).getTime());
      if (dateCalulcation === "lastXPeriods") {
        setStartDate(
          calculateStartDate(
            numPeriods,
            selectedPeriod,
            new Date(value).getTime()
          )
        );
      }
    }
  };

  const shortChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    if (name === "short") {
      setShort(checked);
    }
  };

  // this function calculates the start date based on the end date and the period type and number
  const calculateStartDate = (
    periods: number,
    periodType: string,
    endDate: number
  ) => {
    if (periodType.slice(-3) === "DAY") {
      const numDays = parseInt(periodType.slice(0, -3));
      console.log(numDays);
      return new Date(
        new Date(endDate).setDate(
          new Date(endDate).getDate() - periods * numDays
        )
      ).getTime();
    } else if (periodType.slice(-3) === "1MTH") {
      const numMonths = parseInt(periodType.slice(0, -3));
      return new Date(
        new Date(endDate).setMonth(
          new Date(endDate).getMonth() - periods * numMonths
        )
      ).getTime();
    } else {
      return endDate;
    }
  };

  const changeMode = (e: React.BaseSyntheticEvent, mode: string) => {
    e.preventDefault();
    setDateCalculation(mode);
    if (mode === "lastXPeriods") {
      setStartDate(calculateStartDate(numPeriods, selectedPeriod, endDate));
    } else if (mode === "nextXPeriods") {
      setStartDate(endDate);
    }
  };

  React.useEffect(() => {
    console.log(startDateISO, endDateISO);
    console.log((endDate - startDate) / (1000 * 60 * 60 * 24));
  }, [startDate, endDate]);

  return (
    <FieldSet>
      <IntervalModes>
        <IntervalMode onClick={(e) => changeMode(e, "normal")}>
          Dates
        </IntervalMode>
        <IntervalMode onClick={(e) => changeMode(e, "lastXPeriods")}>
          Last X
        </IntervalMode>
      </IntervalModes>
      <Legend>Interval Selection</Legend>
      {dateCalulcation != "lastXPeriods" ? (
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
      ) : (
        <label htmlFor="last-x-periods">
          <span>Last X Periods</span>
          <ShortInput
            type="number"
            id="last-x-periods"
            name="last-x-periods"
            step={1}
            defaultValue={numPeriods}
            min={3}
            onChange={(e) => {
              setNumPeriods(parseInt(e.target.value));
              setStartDate(
                calculateStartDate(numPeriods, selectedPeriod, endDate)
              );
            }}
          />
        </label>
      )}
      {
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
      }
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
