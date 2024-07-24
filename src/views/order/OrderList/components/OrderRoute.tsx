import { IDetailProp } from "@/types/modal";
import { Modal } from "antd";
import { useImperativeHandle, useState } from "react";
import api from "@/api/orderApi";
import { message } from "@/utils/AntdGlobal";
import { Order } from "@/types/api";

export default function OrderRoute(prpos: IDetailProp) {
  const [visble, setVisble] = useState(false)//控制弹窗开关
  const [trackAni, setTrackAni] = useState<{
    cancel: () => void
  }>()
  useImperativeHandle(prpos.mRef, () => {
    return {
      open
    }
  })
  const open = async (orderId: string) => {
    const detail = await api.getOrderDetail(orderId)
    if (detail.route.length > 0) {
      setVisble(true)
      setTimeout(() => {
        renderMap(detail)
      })

    } else {
      message.info('请先完成打点上报')
    }
  }
  //渲染地图
  const renderMap = (detail: Order.OrderItem) => {
    const map = new window.BMapGL.Map('orderRouteMap')//创建地图
    map.centerAndZoom(detail.cityName, 17);  // 初始化地图,设置中心点坐标和地图级别
    map.enableScrollWheelZoom(true);//鼠标缩放
    //存放坐标点
    const path = detail.route || [];//point是detail.route 默认是空数组
    const point = [];
    for (let i = 0; i < path.length; i++) {
      point.push(new window.BMapGL.Point(path[i].lng, path[i].lat));
    }
    //画折线图
    const polyline = new window.BMapGL.Polyline(point, {
      strokeWeight: 8,//线宽,以px为单位
      srtrokeOpacity: 0.5,//透明度
      strokeColor: '#ff0000'//颜色
    })
    //启动动画
    setTimeout(start, 1000);
    function start() {
      const trackAni = new window.BMapGLLib.TrackAnimation(map, polyline, {
        overallView: true,//缩放地图
        tilt: 30,//倾斜角度
        duration: 20000,//持续时间
        delay: 300//延迟时间
      });
      trackAni.start();//开始动画
      setTrackAni(trackAni)
    }
  }
  //关闭弹窗
  const handleCancel = () => {
    setVisble(false)
    trackAni?.cancel()//取消动画
  }
  return <Modal
    title='地图轨迹'
    width={1100}
    open={visble}
    footer={false}
    onCancel={handleCancel}>
    <div id="orderRouteMap" style={{ height: 500 }}></div>
  </Modal>
}
