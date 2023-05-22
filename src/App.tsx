import styled from "styled-components";
import BackTest from "./components/Backtest";
import { Routes, Route, Link, Outlet } from "react-router-dom";

function App() {
  return (
    <>
      <Header>
        <div>
          <Title>Survivor</Title>
          <Version>Alpha 3</Version>
        </div>
        <Nav>
          <ol>
            <StLink to="/">Home</StLink> {/* acquire datasets */}
            <StLink to="/backtest">Backtest</StLink>
            <StLink to="/live">Live</StLink>
          </ol>
        </Nav>
      </Header>
      <Main>
        <Routes>
          <Route path="/" element={<h1>Home</h1>} />
          <Route path="/backtest" element={<BackTest />} />
          <Route path="/live" element={<h1>Live</h1>} />
        </Routes>
      </Main>
    </>
  );
}

export default App;

const Main = styled.main`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
  padding: 0 32px 2rem;
`;

const Header = styled.header`
  display: flex;
  width: 100%;
  & h1 {
    flex: 1;
    font-size: 2rem;
    font-weight: 600;
  }
  padding: 0 32px;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 600;
`;

const Version = styled.p`
  font-size: calc(14 / 16 * 1rem);
  font-weight: 400;
  text-align: right;
`;

const Nav = styled.nav`
  flex: 3;
  width: 100%;
  & ol {
    display: flex;
    justify-content: space-around;
    align-items: center;
    list-style: none;
    width: 100%;
  }
`;

const StLink = styled(Link)`
  color: black;
  font-size: 1.5rem;
  font-weight: 600;
  cursor: pointer;
  &:hover {
    color: #ff0000;
  }
`;
