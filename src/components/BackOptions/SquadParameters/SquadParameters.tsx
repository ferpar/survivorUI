import React from "react";
import {
  BacktestContext,
  IBacktestContext,
} from "../../../core/Providers/BacktestProvider";
import {
  FieldSetAnimated,
  Legend,
  QuoteAmountWrapper,
  RatioCheck,
} from "../BackOptions.styles";

const SquadParameters = () => {
  const {
    formState: { maxSoldiers, quoteAmount, amountPerSoldier },
    setMaxSoldiers,
    setQuoteAmount,
    setAmountPerSoldier,
  }: IBacktestContext = React.useContext(BacktestContext);

  const [ratio, setRatio] = React.useState(0);

  const amountChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "max-soldiers") {
      if (ratio) {
        setQuoteAmount((Number(value) * amountPerSoldier) / ratio);
      }
      setMaxSoldiers(Number(value));
    } else if (name === "quote-amount") {
      if (ratio) return;
      setQuoteAmount(Number(value));
    } else if (name === "amount-per-soldier") {
      if (ratio) {
        setQuoteAmount((Number(value) * maxSoldiers) / ratio);
      }
      setAmountPerSoldier(Number(value));
    }
  };

  const checkRatioHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    if (name === "ratio") {
      if (checked) {
        setRatio((maxSoldiers * amountPerSoldier) / quoteAmount);
      } else {
        setRatio(0);
      }
    }
  };

  return (
    <FieldSetAnimated>
      <Legend>Squad Parameters</Legend>
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
      <label htmlFor="quote-amount">
        <span>Quote Amount</span>
        <QuoteAmountWrapper>
          <input
            disabled={!!ratio}
            type="number"
            id="quote-amount"
            name="quote-amount"
            min={100}
            step={100}
            value={quoteAmount.toFixed(2)}
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
        </QuoteAmountWrapper>
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
  );
};

export default SquadParameters;
