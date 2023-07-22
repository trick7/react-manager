import { Button, Card, Descriptions } from 'antd'
import styles from './index.module.less'
import { useEffect, useState } from 'react'
import { useBearStore } from '@/store'
import { formatMoney, formatNum, formatState } from '@/utils'
import api from '@/api'
import { Dashboard } from '@/types/api'
import { useCharts } from '@/hook/useCharts'

export default function DashBoard() {
  const userInfo = useBearStore(state => state.userInfo)
  const [report, setRepor] = useState<Dashboard.ReportDat>()
  //初始化折线图
  const [lineRef, lineChart] = useCharts()
  //初始化饼图
  const [pieRef1, pieChart1] = useCharts()
  const [pieRef2, pieChart2] = useCharts()
  //初始化雷达
  const [radarRef, radarChart] = useCharts()
  useEffect(() => {
    renderLineChart()
    renderpieChart1()
    renderpieChart2()
    renderRadarChart()
  }, [lineChart, pieChart1, pieChart2, radarChart])
  //折线图数据
  const renderLineChart = async () => {
    if (!lineChart) return
    const data = await api.getLineData()
    //加载折现图数据
    lineChart?.setOption({
      // title: {
      //   text: '订单与流水走势图'
      // },
      //鼠标触碰悬浮图
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['订单', '流水']
      },
      //网格容器
      grid: {
        left: '2%',
        right: '15%',
        bottom: '10%'
      },
      //
      xAxis: {
        type: 'category',
        data: data.label
      },
      yAxis: {
        //数值轴，用于连续数据
        type: 'value'
      },
      series: [
        {
          name: '订单',
          data: data.order,
          //折现图type: 'line'
          type: 'line'
        },
        {
          name: '流水',
          data: data.money,
          //折现吐type: 'line'
          type: 'line'
        }
      ]
    })
  }
  //加载饼图城市分布数据
  const renderpieChart1 = async () => {
    if (!pieChart1) return
    const data = await api.getpieCityData()
    //饼图
    pieChart1?.setOption({
      title: {
        text: '司机城市分布',
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          name: '城市分布',
          type: 'pie',
          radius: '55%',
          data
        }
      ]
    })
  }
  //加载饼图年龄分布数据
  const renderpieChart2 = async () => {
    if (!pieChart2) return
    const data = await api.getpieAgeData()
    //饼图
    pieChart2?.setOption({
      title: {
        text: '司机年龄分布',
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          name: '年龄分布',
          type: 'pie',
          radius: [50, 180],
          roseType: 'ara',
          data
        }
      ]
    })
  }
  //加载雷达图年龄分布数据
  const renderRadarChart = async () => {
    if (!radarChart) return
    const data = await api.getRadarData()
    //雷达
    radarChart?.setOption({
      // title: {
      //   text: '司机模型诊断',
      //   left: 'center'
      // },
      legend: {
        data: ['司机模型诊断']
      },
      radar: {
        indicator: data.indicator
      },
      series: [
        {
          name: '模型诊断',
          type: 'radar',
          data: data.data
        }
      ]
    })
  }
  //刷新饼图
  const handelRefresh = () => {
    renderpieChart1()
    renderpieChart2()
  }
  useEffect(() => {
    getReportData()
  }, [])

  const getReportData = async () => {
    const data = await api.getReporData()
    setRepor(data)
  }
  return (
    <div className={styles.dashboard}>
      <div className={styles['user-info']}>
        <img src={userInfo.userImg} alt='' className={styles.userImg} />
        <Descriptions title='欢迎新朋友，要天天开心哦！'>
          <Descriptions.Item label='用户id'>{userInfo.userId}</Descriptions.Item>
          <Descriptions.Item label='邮箱'>{userInfo.userEmail}</Descriptions.Item>
          <Descriptions.Item label='状态'>{formatState(userInfo.state)}</Descriptions.Item>
          <Descriptions.Item label='手机号'>{userInfo.mobile}</Descriptions.Item>
          <Descriptions.Item label='岗位'>{userInfo.job}</Descriptions.Item>
          <Descriptions.Item label='部门'>{userInfo.deptName}</Descriptions.Item>
        </Descriptions>
      </div>
      <div className={styles.report}>
        <div className={styles.card}>
          <div className='title'>司机数量</div>
          <div className={styles.data}>{formatNum(report?.driverCount)}位</div>
        </div>
        <div className={styles.card}>
          <div className='title'>总流水</div>
          <div className={styles.data}>{formatMoney(report?.totalMoney)}元</div>
        </div>
        <div className={styles.card}>
          <div className='title'>总订单</div>
          <div className={styles.data}>{formatNum(report?.orderCount)}单</div>
        </div>
        <div className={styles.card}>
          <div className='title'>开通城市</div>
          <div className={styles.data}>{formatNum(report?.cityNum)}座</div>
        </div>
      </div>
      <div className={styles.chart}>
        <Card
          title='订单与流水走势图'
          extra={
            <Button type='primary' onClick={renderLineChart}>
              刷新
            </Button>
          }
        >
          <div ref={lineRef} className={styles['item-line']}></div>
        </Card>
      </div>
      <div className={styles.chart}>
        <Card
          title='司机分布'
          extra={
            <Button type='primary' onClick={handelRefresh}>
              刷新
            </Button>
          }
        >
          <div className={styles.peiChart}>
            <div ref={pieRef1} className={styles.itmPie}></div>
            <div ref={pieRef2} className={styles.itmPie}></div>
          </div>
        </Card>
      </div>
      <div className={styles.chart}>
        <Card
          title='模型诊断'
          extra={
            <Button type='primary' onClick={renderRadarChart}>
              刷新
            </Button>
          }
        >
          <div ref={radarRef} className={styles['item-line']}></div>
        </Card>
      </div>
    </div>
  )
}
