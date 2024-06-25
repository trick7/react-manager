import { Select } from "antd";
import { useEffect, useState } from "react";
import api from "@/api/orderApi"
export default function Ordercluster() {
  const [cityid, setCityid] = useState(10001)
  useEffect(() => {
    getCityData()
  }, [cityid])

  const getCityData = async () => {
    const data = await api.getCityData(cityid)
    setTimeout(() => {
      renderMap(data)//渲染地图
    })
  }

  const renderMap = (data: Array<{ lng: string, lat: string }>) => {
    const map = new window.BMapGL.Map("cluserMap");
    map.enableScrollWheelZoom()//启用滚轮缩放
    const zoomCtrl = new window.BMapGL.ZoomControl()//缩放控件
    map.addControl(zoomCtrl)//添加缩放控件
    const cityNames: { [key: number]: string } = {
      10001: '长沙',
      20001: '武汉',
      30001: '杭州',
      40001: '惠州',
      50001: '昆明'
    }
    // 初始化地图
    map.centerAndZoom(cityNames[cityid], 12)

    const markers = []
    for (let i = 0; i < data.length; i++) {
      const { lng, lat } = data[i]
      const point = new window.BMapGL.Point(lng, lat)//生成坐标点
      markers.push(new window.BMapGL.Marker(point))
      //生成聚合图
      if (markers.length > 0) {
        new window.BMapLib.MarkerClusterer(map, { markers: markers });
      }
    }
  }
  // 选择城市
  const handleChange = (value: number) => {
    setCityid(value)
  }
  return (
    <div style={{ backgroundColor: '#fff', padding: 10 }}>
      <Select style={{ width: 100, marginBottom: 10 }} value={cityid} onChange={handleChange}>
        <Select.Option value={10001}>长沙</Select.Option>
        <Select.Option value={20001}>武汉</Select.Option>
        <Select.Option value={30001}>杭州</Select.Option>
        <Select.Option value={40001}>惠州</Select.Option>
        <Select.Option value={50001}>昆明</Select.Option>
      </Select>
      <div id="cluserMap" style={{ height: 'calc(100vh - 192px)' }}></div>
    </div>
  )
}
