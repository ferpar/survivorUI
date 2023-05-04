import React from "react";
import styled, { keyframes, css } from "styled-components";
import { BacktestContext } from "../../core/Providers/BacktestProvider";

const StopLimitInput = () => {
  const [visible, setVisible] = React.useState(false);
  const context = React.useContext(BacktestContext);

  if (!context?.marketData) return null;
  console.log(context);
  const {
    formState: { stop, limit },
    setStop,
    setLimit,
    marketData,
  } = context;

  return (
    <Wrapper visible={visible}>
      <ToggleButton onClick={() => setVisible((innerVisible) => !innerVisible)}>
        {visible ? "<<" : ">>"}
      </ToggleButton>
      <h3>Single Backtest Inputs</h3>
    </Wrapper>
  );
};

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
  transform: translateX(-100%);
`;

export default StopLimitInput;
