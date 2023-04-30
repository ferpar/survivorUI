import React from "react";
import styled, { keyframes } from "styled-components";
import { BacktestContext } from "../../core/Providers/BacktestProvider";

const BackOptions = () => {
  const {
    formState: {
      startDate: startTimestamp,
      endDate: endTimestamp,
      short,
      maxSoldiers,
      baseAmount,
      amountPerSoldier,
    },
    setStartDate,
    setEndDate,
    setShort,
    setMaxSoldiers,
    setBaseAmount,
    setAmountPerSoldier,
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
      <FieldSet>
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
      </FieldSet>
      <FieldSetAnimated>
        <label htmlFor="max-soldiers">
          <span>Max Soldiers</span>
          <input
            type="number"
            id="max-soldiers"
            name="max-soldiers"
            min={1}
            value={maxSoldiers}
            onChange={(e) => setMaxSoldiers(Number(e.target.value))}
          />
        </label>
        <label htmlFor="base-amount">
          <span>Base Amount</span>
          <input
            type="number"
            id="base-amount"
            name="base-amount"
            min={100}
            step={100}
            value={baseAmount}
            onChange={(e) => setBaseAmount(Number(e.target.value))}
          />
        </label>
        <label htmlFor="amount-per-soldier">
          <span>Amount Per Soldier</span>
          <input
            type="number"
            id="amount-per-soldier"
            name="amount-per-soldier"
            min={10}
            value={amountPerSoldier}
            onChange={(e) => setAmountPerSoldier(Number(e.target.value))}
          />
        </label>
      </FieldSetAnimated>
    </Form>
  );
};

const Form = styled.form`
  align-items: baseline;
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-bottom: 1rem;
`;

const FieldSet = styled.fieldset`
  border: none;
  display: flex;
  flex-direction: row;
  flex: 1;
  gap: 32px;
  & label span {
    display: block;
  }
`;

const slideInFromRight = keyframes`
    0% {
      transform: translateX(150%);
      opacity: 0;
    }
    100% {
      transform: translateX(0);
      opacity: 1;
    }
`;

const FieldSetAnimated = styled(FieldSet)`
  transform: translateX(150%);
  animation: ${slideInFromRight} 0.7s ease-out both;
`;

export default BackOptions;
