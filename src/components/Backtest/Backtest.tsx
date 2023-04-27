import styled from "styled-components";
import BackOptions from "../BackOptions";
import BackResults from "../BackResults";

const Backtest = () => {
  return (
    <Wrapper>
      <BackOptions />
      <BackResults />
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
