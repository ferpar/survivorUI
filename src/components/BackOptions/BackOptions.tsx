import React from "react";
import styled from "styled-components";
import { BacktestContext } from "../../core/Providers/BacktestProvider";

const BackOptions = () => {
  const {
    formState: { startDate: startTimestamp, endDate: endTimestamp, short },
    setStartDate,
    setEndDate,
    setShort,
  } = React.useContext(BacktestContext);

  const startDate = new Date(startTimestamp).toISOString().split("T")[0];
  const endDate = new Date(endTimestamp).toISOString().split("T")[0];

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
    <Form>
      <label htmlFor="start-date">
        <span>Start Date</span>
        <input
          type="date"
          id="start-date"
          name="backtest-start"
          value={startDate}
          onChange={dateChangeHandler}
        />
      </label>
      <label htmlFor="end-date">
        <span>End Date</span>
        <input
          type="date"
          id="end-date"
          name="backtest-end"
          value={endDate}
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
    </Form>
  );
};

const Form = styled.form`
  align-items: baseline;
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 32px;
  & label span {
    margin-right: 16px;
  }
  margin-bottom: 1rem;
`;

export default BackOptions;
