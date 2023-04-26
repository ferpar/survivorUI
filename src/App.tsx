import { useEffect, useState } from 'react'
import './App.css'
import results from './datasets/eth4months/results.json'
import heatMapRaw from './datasets/eth4months/marginHeatmap.json'
import useMapMarketData from './core/hooks/useMapMarketData'
import CandleChart from './components/CandleChart/CandleChart'
import HeatMap from './components/HeatMap/HeatMap'

function App() {

  const [candleData, setCandleData] = useState<any>(null)

  const marketData = useMapMarketData()
  // const heatMapData = useMapMarketData()

  useEffect(() => {
    if(!!marketData?.length) {
      setCandleData(marketData)
    } else {
      setCandleData(null)
    }
  }, [marketData])


  return (
      <>
      { candleData?.length ? <CandleChart marketData={candleData} /> : <p>...Loading</p> }
      <HeatMap rawData={heatMapRaw} /> 
      </>
  )
}

export default App
