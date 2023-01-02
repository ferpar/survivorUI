import './App.css'
import results from '../results.json'
import heatMapRaw from '../marginHeatmap.json'
import useMapMarketData from './core/hooks/useMapMarketData'
import CandleChart from './CandleChart/CandleChart'
import HeatMap from './HeatMap/HeatMap'

function App() {

  const marketData = useMapMarketData(results.marketData || [])
  
  return (
      <>
      <CandleChart marketData={marketData} />
      <HeatMap rawData={heatMapRaw} /> 
      </>
  )
}

export default App
