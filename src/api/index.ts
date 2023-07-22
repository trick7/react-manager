import request from '@/utils/request'
import { Dashboard, Login, User } from '@/types/api'
export default {
  //登录
  login(params: Login.params) {
    return request.post<string>('/users/login', params, { showLoading: false })
  },
  //获取用户信息
  getUserInfo() {
    return request.get<User.UserItem>('users/getUserInfo')
  },
  //获取工作台汇总数据
  getReporData() {
    return request.get<Dashboard.ReportDat>('/order/dashboard/getReportData')
  },
  // 获取折线图数据
  getLineData() {
    return request.get<Dashboard.LineData>('/order/dashboard/getLineData')
  },
  // 获取饼图城市分布数据
  getpieCityData() {
    return request.get<Dashboard.PieData[]>('/order/dashboard/getPieCityData')
  },
  // 获取饼图年龄分布数据
  getpieAgeData() {
    return request.get<Dashboard.PieData[]>('/order/dashboard/getPieCityData')
  },
  // 获取雷达图数据
  getRadarData() {
    return request.get<Dashboard.RadarData>('/order/dashboard/getRadarData')
  }
}
