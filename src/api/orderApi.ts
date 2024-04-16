import request from '@/utils/request'
import { Order, ResultData } from '@/types/api'

export default {
  //获取订单列表
  getOrderList(params: Order.Params) {
    // ResultData中定义了中括号不需要再添加中括号了
    return request.get<ResultData<Order.OrderItem>>('/order/list', params)
  },
  //获取司机列表
  getCityList() {
    return request.get<Order.DictItem[]>('/order/cityList')
  },
  //获取车型列表
  getVehicleList() {
    return request.get<Order.DictItem[]>('/order/vehicleList')
  },
  // 创建订单
  createOrder(params: Order.CreateParams) {
    return request.post('/order/create', params)
  }
}
