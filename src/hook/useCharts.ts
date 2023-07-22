import * as echarts from 'echarts'
import { useEffect, useRef, useState, RefObject } from 'react'

export const useCharts = (): [RefObject<HTMLDivElement>, echarts.EChartsType | undefined] => {
  const chartRef = useRef<HTMLDivElement>(null)
  const [chartInstance, setChartInstance] = useState<echarts.EChartsType>()
  useEffect(() => {
    //获取dom节点的实例
    const chart = echarts.init(chartRef.current as HTMLElement)
    setChartInstance(chart)
  }, [])

  return [chartRef, chartInstance]
}
