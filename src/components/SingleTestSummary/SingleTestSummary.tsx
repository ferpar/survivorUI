import React from "react";
import styled, { keyframes, css } from "styled-components";
import { BacktestContext } from "../../core/Providers/BacktestProvider";

const percentageToRatio = (percent: number) => {
  return parseFloat((percent / 100).toFixed(2));
};

const ratioToPercentage = (ratio: number) => {
  return parseInt((ratio * 100).toFixed(0));
};

const SingleTestSummary = () => {
  const [visible, setVisible] = React.useState(null);
  const context = React.useContext(BacktestContext);

  if (!context?.marketData.squads) return null;
  const {
    formState: { stop, limit },
    setStop,
    setLimit,
    marketData: { squads },
  } = context;

  const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newValue = percentageToRatio(value);
    if (name === "stop") {
      setStop(newValue);
    } else if (name === "limit") {
      setLimit(newValue);
    }
  };

  return (
    <Wrapper visible={visible}>
      <ToggleButton onClick={() => setVisible((innerVisible) => !innerVisible)}>
        {visible ? "<<" : ">>"}
      </ToggleButton>
      <MainTitle>Single Backtest Summary</MainTitle>
      {visible && (
        <Form>
          <label htmlFor="stop">
            <span>Stop %</span>
            <BaseInput
              type="number"
              name="stop"
              value={ratioToPercentage(stop)}
              onChange={inputChangeHandler}
            />
          </label>
          <label htmlFor="limit">
            <span>Limit %</span>
            <BaseInput
              type="number"
              name="limit"
              value={ratioToPercentage(limit)}
              onChange={inputChangeHandler}
            />
          </label>
        </Form>
      )}
      {squads &&
        squads.map((squad, id) => {
          return (
            <div key={id}>
              <SquadTitle>
                Squad {id} {squad.short ? "short" : "long"}
              </SquadTitle>
              <SquadSummary>
                <div>
                  <p>Dead: {squad?.deadSoldiers.length}</p>
                  <p>Extracted {squad?.extractedSoldiers.length}</p>
                  <p>Active: {squad?.soldiers.length}</p>
                </div>
                <div>
                  <p>Balance: {squad?.wallet?.balance.toFixed(2)}</p>
                  <p>Base Balance: {squad?.wallet?.baseBalance.toFixed(2)}</p>
                  <p>Quote Balance: {squad?.wallet?.quoteBalance.toFixed(2)}</p>
                </div>
              </SquadSummary>
            </div>
          );
        })}
    </Wrapper>
  );
};

const slideOut = keyframes`
  from {
    transform: translateX(0%);
  }
  to {
    transform: translateX(-100%);
  }
`;

const slideIn = keyframes`
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0%);
  }
`;

const entry = keyframes`
  from {
    transform: translateX(-120%);
    opacity: 0;
  }
  to {
    transform: translateX(-100%);
    opacity: 1;
  }
`;

const entryAnim = css`
  animation: ${entry} 0.5s ease-out both;
  animation-delay: 0.5s;
`;

const slideOutAnim = css`
  animation: ${slideOut} 0.5s ease-in forwards;
`;

const slideInAnim = css`
  animation: ${slideIn} 0.5s ease-out forwards;
`;

const ToggleButton = styled.button`
  background: #aaa;
  border-radius 5px;
  position: absolute;
  right: 0;
  top: 0;
  padding: 9px;
  transform: translateX(100%);
`;
const Wrapper = styled.div`
  position: absolute;
  background-color: #eee;
  left: 0;
  top: 0;
  display: flex;
  flex-direction: column;
  padding: 1rem 16px;
  border-radius: 0 5px 5px 5px;
  ${(props) =>
    props?.visible === null
      ? entryAnim
      : props?.visible
      ? slideInAnim
      : slideOutAnim};
`;

const MainTitle = styled.h3`
  margin-bottom: 1rem;
`;

const Form = styled.form`
  align-items: baseline;
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 16px;
  & label > span {
    display: block;
  }
  margin-bottom: 1rem;
`;

const BaseInput = styled.input`
  width: 100px;
`;

const SquadTitle = styled.h4`
  margin-bottom: 0.5rem;
`;

const SquadSummary = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: baseline;
  gap: 24px;
  & > div {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
`;

export default SingleTestSummary;
