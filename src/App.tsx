import './App.css'
import results from '../results.json'
import useMapMarketData from './core/hooks/useMapMarketData'
import CandleChart from './CandleChart/CandleChart'

function App() {

  const marketData = useMapMarketData(results.marketData || [])
  
  return (
      <CandleChart marketData={marketData} />
  )
}

export default App
