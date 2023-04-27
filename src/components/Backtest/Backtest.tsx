import styled from "styled-components";
import BackOptions from "../BackOptions";
import BackResults from "../BackResults";
import ErrorBoundary from "../../core/ErrorBoundary";
import BacktestProvider from "../../core/Providers/BacktestProvider";

const Backtest = () => {
  return (
    <Wrapper>
      <ErrorBoundary fallback={<p>"Error on the Backtester"</p>}>
        <BacktestProvider>
          <BackOptions />
          <BackResults />
        </BacktestProvider>
      </ErrorBoundary>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 2rem 32px;
`;

export default Backtest;
