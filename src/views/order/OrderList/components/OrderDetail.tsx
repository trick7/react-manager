import { IDetailProp } from '@/types/modal'
import { Descriptions, Modal } from 'antd'
import { useImperativeHandle, useState } from 'react'
import api from '@/api/orderApi'
import { Order } from '@/types/api'
import { formatDate, formatMoney, toLocalDate, formateMobile } from '@/utils'
export default function OrderDetail(props: IDetailProp) {
  const [visbile, setVisbile] = useState(false)
  const [detail, setDetail] = useState<Order.OrderItem>()
  //许父组件通过 ref 访问子组件的实例上暴露给父组件的特定方法。
  useImperativeHandle(props.mRef, () => {
    return {
      open
    }
  })
  //打开弹窗，暴露方法
  const open = async (orderId: string) => {
    setVisbile(true)
    //获取订单详情
    const detail = await api.getOrderDetail(orderId)
    //保存订单详情信息
    setDetail(detail)
  }
  //关闭弹窗
  const handleCancel = () => {
    setVisbile(false)
  }
  // 订单状态格式化
  const formateState = (state?: Order.IState) => {
    //为空返回'-'
    if (!state) return '-'
    const stateMap = {
      1: '进行中',
      2: '已完成',
      3: '超时',
      4: '取消'
    }
    //映射对应的状态
    return stateMap[state]
  }
  return (
    <Modal title='订单详情' width={800} open={visbile} footer={false} onCancel={handleCancel}>
      {/*
        column={2}一行两列
    */}
      <Descriptions column={2} style={{ padding: '10px 30px' }}>
        <Descriptions.Item label='订单编号'>{detail?.orderId}</Descriptions.Item>
        <Descriptions.Item label='下单城市'>{detail?.cityName}</Descriptions.Item>
        <Descriptions.Item label='下单用户'>{detail?.userName}</Descriptions.Item>
        <Descriptions.Item label='手机号'>{formateMobile(detail?.mobile)}</Descriptions.Item>
        <Descriptions.Item label='起点'>{detail?.startAddress}</Descriptions.Item>
        <Descriptions.Item label='终点'>{detail?.endAddress}</Descriptions.Item>
        <Descriptions.Item label='订单金额'>{formatMoney(detail?.orderAmount)}</Descriptions.Item>
        <Descriptions.Item label='用户支付金额'>{formatMoney(detail?.userPayAmount)}</Descriptions.Item>
        <Descriptions.Item label='司机到账金额'>{formatMoney(detail?.driverAmount)}</Descriptions.Item>
        <Descriptions.Item label='支付方式'>{detail?.payType == 1 ? '微信' : '支付宝'}</Descriptions.Item>
        <Descriptions.Item label='司机名称'>{detail?.driverName}</Descriptions.Item>
        <Descriptions.Item label='订单车型'>{detail?.vehicleName}</Descriptions.Item>
        <Descriptions.Item label='订单状态'>{formateState(detail?.state)}</Descriptions.Item>
        <Descriptions.Item label='用车时间'>{formatDate(detail?.useTime)}</Descriptions.Item>
        <Descriptions.Item label='订单结束时间'>{toLocalDate(detail?.endTime)}</Descriptions.Item>
        <Descriptions.Item label='订单创建时间'>{toLocalDate(detail?.createTime)}</Descriptions.Item>
      </Descriptions>
    </Modal>
  )
}
