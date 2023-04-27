import styled from "styled-components";
import BackOptions from "../BackOptions";
import BackResults from "../BackResults";
import ErrorBoundary from "../../core/ErrorBoundary";

const Backtest = () => {
  return (
    <Wrapper>
      <ErrorBoundary fallback={"Error on the Backtester"}>
        <BackOptions />
        <BackResults />
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
