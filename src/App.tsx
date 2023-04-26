import { useEffect, useState } from 'react'
import styled from 'styled-components'
import results from './datasets/eth4months/results.json'
import heatMapRaw from './datasets/eth4months/marginHeatmap.json'
import useMapMarketData from './core/hooks/useMapMarketData'
import CandleChart from './components/CandleChart/CandleChart'
import HeatMap from './components/HeatMap/HeatMap'
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
