import { useEffect, useState } from 'react'
import results from '../../datasets/eth4months/results.json'
import heatMapRaw from '../../datasets/eth4months/marginHeatmap.json'
import useMapMarketData from '../../core/hooks/useMapMarketData'
import CandleChart from '../CandleChart/CandleChart'
import HeatMap from '../HeatMap/HeatMap'

function RunAnalyzer() {

  const [candleData, setCandleData] = useState<any>(null)

  const marketData = useMapMarketData()

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

export default RunAnalyzer
