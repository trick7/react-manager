import { IDetailProp } from "@/types/modal";
import { Modal, message } from "antd";
import { useImperativeHandle, useState } from "react";
import api from "@/api/orderApi";
import { Order } from "@/types/api";

export default function OrderMarker(props: IDetailProp) {
  const [visble, setVisble] = useState(false)
  const [orderId, setOrderId] = useState('')//订单id
  const [markers, setMarkers] = useState<{ lng: string, lat: string, id: number }[]>([]) //存储marker,打点的经纬度
  useImperativeHandle(props.mRef, () => {
    return {
      open
    }
  })
  //弹框
  const open = async (orderId: string) => {
    setOrderId(orderId)
    setVisble(true)
    const detail = await api.getOrderDetail(orderId)//获取orderId
    renderMap(detail)//渲染对应id的地图
  }
  //渲染地图
  const renderMap = (detail: Order.OrderItem) => {
    const map = new window.BMapGL.Map("markerMap");
    map.centerAndZoom(detail.cityName, 12)//渲染对应城市的地图 与展示级别
    const scaleCtrl = new window.BMapGL.ScaleControl();  // 添加比例尺控件
    map.addControl(scaleCtrl);
    const zoomCtrl = new window.BMapGL.ZoomControl();  // 添加缩放控件
    map.addControl(zoomCtrl);
    map.enableScrollWheelZoom(true);//鼠标缩放
    detail.route?.map(item => {
      createMarker(map, item.lng, item.lat)//渲染marker
    })
    //绑定事件
    map.addEventListener('click', (e: any) => {
      createMarker(map, e.latlng.lng, e.latlng.lat)
    })
  }
  //创建Marker  接收地图 和 经纬度
  const createMarker = (map: any, lng: string, lat: string) => {
    const id = Math.random()//随机id
    const marker = new window.BMapGL.Marker(new window.BMapGL.Point(lng, lat));//创建marker
    markers.push({ lng, lat, id })//存储marker
    marker.id = id//添加id
    const markerMenu = new window.BMapGL.ContextMenu();//创建右键菜单
    //右键清楚覆盖物（打点）
    markerMenu.addItem(new window.BMapGL.MenuItem('删除', () => {
      map.removeOverlay(marker)//删除覆盖物
      const index = markers.findIndex(item => item.id === marker.id)//找到marker在数组中的索引
      markers.splice(index, 1)//根据索引删除
      setMarkers([...markers])//更新
    }))
    setMarkers([...markers])
    marker.addContextMenu(markerMenu)//给marker绑定右键菜单
    map.addOverlay(marker)//添加覆盖物(打点)
  }
  //更新打点
  const handleOk = async () => {
    await api.updateOrderInfo({ orderId, route: markers })
    message.success('打点成功')
    handleCancel()//关闭弹窗
  }
  //关闭弹窗
  const handleCancel = () => {
    setVisble(false)
    setMarkers([])
  }

  return <Modal title='地图打点' width={1100} open={visble} okText='确定' cancelText='取消' onOk={handleOk} onCancel={handleCancel}>
    <div id="markerMap" style={{ height: 500 }}></div>
  </Modal>
}
