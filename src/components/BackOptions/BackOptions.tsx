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

  const [ratio, setRatio] = React.useState(0);

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

  const amountChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "max-soldiers") {
      if (ratio) {
        setBaseAmount((Number(value) * amountPerSoldier) / ratio);
      }
      setMaxSoldiers(Number(value));
    } else if (name === "base-amount") {
      if (ratio) return;
      setBaseAmount(Number(value));
    } else if (name === "amount-per-soldier") {
      if (ratio) {
        setBaseAmount((Number(value) * maxSoldiers) / ratio);
      }
      setAmountPerSoldier(Number(value));
    }
  };

  const checkRatioHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    if (name === "ratio") {
      if (checked) {
        setRatio((maxSoldiers * amountPerSoldier) / baseAmount);
      } else {
        setRatio(0);
      }
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
            onChange={amountChangeHandler}
          />
        </label>
        <label htmlFor="base-amount">
          <span>Base Amount</span>
          <BaseAmountWrapper>
            <input
              disabled={ratio}
              type="number"
              id="base-amount"
              name="base-amount"
              min={100}
              step={100}
              value={baseAmount.toFixed(2)}
              onChange={amountChangeHandler}
            />
            <RatioCheck>
              <span>Fix Ratio</span>
              <input
                type="checkbox"
                id="ratio-check"
                name="ratio"
                checked={!!ratio}
                onChange={checkRatioHandler}
              />
            </RatioCheck>
          </BaseAmountWrapper>
        </label>
        <label htmlFor="amount-per-soldier">
          <span>Amount Per Soldier</span>
          <input
            type="number"
            id="amount-per-soldier"
            name="amount-per-soldier"
            min={100}
            step={100}
            value={amountPerSoldier}
            onChange={amountChangeHandler}
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
  & label > span {
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

const BaseAmountWrapper = styled.div`
  position: relative;
`;
const RatioCheck = styled.div`
  position: absolute;
  right: 24px;
  top: 0;
  bottom: 0;
  height: 100%;
  display: flex;
  align-items: center;
  gap: 4px;
  & > input {
    margin-bottom: -1px;
  }
`;

export default BackOptions;
