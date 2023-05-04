import styled from "styled-components";
import CandleChart from "../CandleChart/CandleChart";
import HeatMap from "../HeatMap/HeatMap";
import SingleTestSummary from "../SingleTestSummary";
import WalletView from "../WalletView";

function RunAnalyzer() {
  return (
    <Wrapper>
      <CandleChart />
      <SingleTestSummary />
      <WalletView />
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
  overflow-x: hidden;
  overflow-y: visible;
`;

export default RunAnalyzer;
