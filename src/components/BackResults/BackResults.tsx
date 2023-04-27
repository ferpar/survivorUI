import styled from "styled-components";
import CandleChart from "../CandleChart/CandleChart";
import HeatMap from "../HeatMap/HeatMap";

function RunAnalyzer() {
  return (
    <Wrapper>
      <CandleChart />
      <HeatMap />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

export default RunAnalyzer;
