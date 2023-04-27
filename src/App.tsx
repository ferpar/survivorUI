import styled from "styled-components";
import BackTest from "./components/Backtest";

function App() {
  return (
    <Main>
      <Header>
        <h1>Survivor Alpha 0.1</h1>
        <Nav>
          <ol>
            <li>Home</li> {/* acquire datasets */}
            <li>Backtest</li>
            <li>Live</li>
          </ol>
        </Nav>
      </Header>
      <BackTest />
    </Main>
  );
}

export default App;

const Main = styled.main`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem 32px;
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

const Nav = styled.nav`
  flex: 3;
  width: 100%;
  & ol {
    display: flex;
    justify-content: space-around;
    align-items: center;
    list-style: none;
    width: 100%;
    & li {
      font-size: 1.5rem;
      font-weight: 600;
      cursor: pointer;
      &:hover {
        color: #ff0000;
      }
    }
  }
`;
