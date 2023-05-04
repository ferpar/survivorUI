import React from "react";
import styled, { keyframes, css } from "styled-components";
import { BacktestContext } from "../../core/Providers/BacktestProvider";

const SideSummary = () => {
  const [visible, setVisible] = React.useState(null);
  const context = React.useContext(BacktestContext);

  if (!context?.heatMapData?.stats) return null;
  const {
    heatMapData: {
      stats: { min, max, mean, median, std },
    },
  } = context;

  return (
    <Wrapper visible={visible}>
      <ToggleButton onClick={() => setVisible((innerVisible) => !innerVisible)}>
        {visible ? ">>" : "<<"}
      </ToggleButton>
      <h3>Profit Loss</h3>
      {visible ? (
        <>
          <p>max: {max.toFixed(2)}</p>
          <p>min: {min.toFixed(2)}</p>
          <p>mean: {mean.toFixed(2)}</p>
          <p>median: {median.toFixed(2)}</p>
          <p>std dev:{std.toFixed(2)}</p>
        </>
      ) : (
        <>
          <p>{max.toFixed(2)}</p>
          <p>{min.toFixed(2)}</p>
          <p>{mean.toFixed(2)}</p>
          <p>{median.toFixed(2)}</p>
          <p>{std.toFixed(2)}</p>
        </>
      )}
    </Wrapper>
  );
};

const slideOut = keyframes`
  from {
    transform: translateX(0%);
  }
  to {
    transform: translateX(+80%);
  }
`;

const slideIn = keyframes`
  from {
    transform: translateX(+80%);
  }
  to {
    transform: translateX(0%);
  }
`;

const entry = keyframes`
  from {
    transform: translateX(+120%);
  }
  to {
    transform: translateX(+80%);
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

const Wrapper = styled.div`
  position: absolute;
  background-color: #eee;
  right: 0;
  top: 0;
  transform: translateX(80%);
  ${(props) =>
    props?.visible === null
      ? entryAnim
      : props?.visible
      ? slideInAnim
      : slideOutAnim};
  display: flex;
  flex-direction: column;
  padding: 1rem 16px;
  border-radius: 0 5px 5px 5px;
`;

const ToggleButton = styled.button`
  background: #aaa;
  border-radius 5px 0 0 5px;
  position: absolute;
  left: 0;
  top: 0;
  padding: 9px;
  transform: translateX(-100%);
`;

export default SideSummary;
