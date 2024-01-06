import request from '@/utils/request'
import { Dashboard, Dept, Login, Menu, ResultData, User } from '@/types/api'
export default {
  //登录
  login(params: Login.params) {
    return request.post<string>('/users/login', params, { showLoading: false })
  },
  //获取用户信息
  getUserInfo() {
    return request.get<User.UserItem>('users/getUserInfo')
  },
  //获取权限列表
  getPermissionList() {
    return request.get<{ buttonList: string[]; menuList: Menu.MenuItem[] }>('/users/getPermissionList')
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
  },
  // 获取用户列表  params分页数据
  getUserList(params: User.Params) {
    return request.get<ResultData<User.UserItem>>('/users/list', params)
  },
  //创建用户
  CreateUser(params: User.CreateParams) {
    return request.post('/users/create', params)
  },
  //编辑用户
  editUser(params: User.EditParams) {
    return request.post('/users/edit', params)
  },
  //删除与批量删除用户
  deleteUser(params: { userIds: number[] }) {
    return request.post('/users/delete', params)
  },
  //部门管理
  //部门列表
  getDeptList(params?: Dept.Params) {
    return request.get<Dept.DeptItem[]>('/dept/list', params)
  },
  //获取当前账号下的所有用户
  getAllUserList() {
    return request.get<User.UserItem[]>('/users/all/list')
  },
  //部门创建
  createDept(params: Dept.CreateParams) {
    return request.post('/dept/create', params)
  },
  //部门编辑
  editDept(params: Dept.EditParams) {
    return request.post('/dept/edit', params)
  },
  //部门删除
  deleteDept(params: Dept.DelParams) {
    return request.post('/dept/delete', params)
  },
  //菜单管理
  getMuneList(params?: Menu.Params) {
    return request.get<Menu.MenuItem[]>('/menu/list', params)
  },
  //菜单创建
  createMenu(params?: Menu.CreateParams) {
    return request.post('/menu/create', params)
  },
  //菜单编辑
  editMenu(params?: Menu.EditParams) {
    return request.post('/menu/edit', params)
  },
  //菜单删除
  deleteMenu(params?: Menu.DelParams) {
    return request.post('/menu/delete', params)
  }
}
