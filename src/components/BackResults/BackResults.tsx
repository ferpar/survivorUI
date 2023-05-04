import styled from "styled-components";
import CandleChart from "../CandleChart/CandleChart";
import HeatMap from "../HeatMap/HeatMap";
import StopLimitInput from "../SingleTestSummary";

function RunAnalyzer() {
  return (
    <Wrapper>
      <CandleChart />
      <StopLimitInput />
      <HeatMap />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

export default RunAnalyzer;
