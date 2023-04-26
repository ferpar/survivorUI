import { useEffect, useState } from 'react'
import styled from 'styled-components'
import results from '../../datasets/eth4months/results.json'
import heatMapRaw from '../../datasets/eth4months/marginHeatmap.json'
import useMapMarketData from '../../core/hooks/useMapMarketData'
import CandleChart from '../CandleChart/CandleChart'
import HeatMap from '../HeatMap/HeatMap'

function RunAnalyzer() {

  const [candleData, setCandleData] = useState<any>(null)

  const marketData = useMapMarketData()
  console.log(marketData)

  useEffect(() => {
    if(!!marketData?.length) {
      setCandleData(marketData)
    } else {
      setCandleData(null)
    }
  }, [marketData])


  return (
      <Wrapper>
      { candleData?.length ? <CandleChart marketData={candleData} /> : <p>...Loading</p> }
      <HeatMap rawData={heatMapRaw} /> 
      </Wrapper>
  )
}

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 2rem 32px;
`

export default RunAnalyzer
