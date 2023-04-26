import styled from 'styled-components'
import RunAnalyzer from './components/RunAnalyzer/RunAnalyzer'

function App() {


  return (
      <Main>
      <RunAnalyzer />
      </Main>
  )
}

export default App

const Main = styled.main`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  text-align: center;
`
