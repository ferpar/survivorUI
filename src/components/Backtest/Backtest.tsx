import styled from "styled-components";
import BackOptions from "../BackOptions";
import BackResults from "../BackResults";
import ErrorBoundary from "../../core/ErrorBoundary";
import BacktestProvider from "../../core/Providers/BacktestProvider";
import SideSummary from "../SideSummary";
import MarketsProvider from "../../core/Providers/MarketsProvider";

const Backtest = () => {
  return (
    <Wrapper>
      <ErrorBoundary fallback={<p>"Error on Backtester"</p>}>
        <MarketsProvider>
          <BacktestProvider>
            <BackOptions />
            <BackResults />
            <SideSummary />
          </BacktestProvider>
        </MarketsProvider>
      </ErrorBoundary>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 2rem 32px;
`;

export default Backtest;
