/*
import { EditParams } from './api';
接口类型定义
*/

export interface Result<T = any> {
  code: number
  data: T
  msg: string
}

export interface ResultData<T = any> {
  list: T[]
  page: {
    pageNum: number
    pageSize: number
    total: number | 0
  }
}

//分页参数
export interface pageParams {
  pageNum: number
  pageSize?: number
}

//登录
export namespace Login {
  export interface params {
    userName: string
    userPwd: string
  }
}

//用户管理
export namespace User {
  //查询
  export interface Params extends pageParams {
    userId?: number
    userName?: string
    state?: number
  }
  //列表返回项 用户列表
  export interface UserItem {
    _id: string
    userId: number
    userName: string
    userEmail: string
    deptId: string
    state: number
    mobile: string
    job: string
    role: number
    roleList: string
    createId: number
    deptName: string
    userImg: string
  }
  //创建参数
  export interface CreateParams {
    userName: string
    userEmail: string
    mobile?: number
    deptId: string
    job?: string
    state?: number
    roleList: string[]
    userImg: string
  }
  //编辑参数
  export interface EditParams extends CreateParams {
    userId: number
  }
}

//部门管理
export namespace Dept {
  export interface Params {
    deptName?: string
  }
  //创建
  export interface CreateParams {
    parentId?: string
    deptName: number
    userName: string
  }
  export interface DeptItem extends CreateParams {
    _id: string
    userId: number
    createTime: string
    updateTime: string
    children: DeptItem[]
  }
  //编辑
  export interface EditParams extends CreateParams {
    _id: string
  }
  //删除
  export interface DelParams {
    _id: string
  }
}

//
export namespace Menu {
  export interface Params {
    menuName?: string // 菜单名称
    menuState?: number // 菜单状态
  }

  // 菜单创建
  export interface CreateParams {
    menuName: string // 菜单名称
    icon?: string // 菜单图标
    menuType: number // 1: 菜单 2：按钮 3：页面
    menuState: number // 1：正常 2：停用
    menuCode?: string // 按钮权限标识
    parentId?: string // 父级菜单ID
    path?: string // 菜单路径
    component?: string // 组件名称
    orderBy: number // 组件排序
  }
  // 菜单列表
  export interface MenuItem extends CreateParams {
    _id: string
    createTime: string
    buttons?: MenuItem[]
    children?: MenuItem[]
  }

  // 菜单编辑
  export interface EditParams extends CreateParams {
    _id?: string
  }

  // 删除
  export interface DelParams {
    _id: string
  }
}

//图表
export namespace Dashboard {
  export interface ReportDat {
    driverCount: number
    totalMoney: number
    orderCount: number
    cityNum: number
  }
  //折现图接口类型定义
  export interface LineData {
    label: string
    order: number
    money: number
  }
  //饼图接口类型定义
  export interface PieData {
    value: number
    name: number
  }
  //雷达图接口数据定义
  export interface RadarData {
    indicator: Array<{ name: string; max: number }>
    data: {
      name: string
      value: number[]
    }
  }
}

export namespace Role {
  //搜索条件
  export interface Params extends pageParams {
    roleName?: string
  }
  //创建的参数
  export interface CreateParams {
    roleName: string
    remark?: string
  }
  //列表的参数
  export interface RoleItem extends CreateParams {
    _id: string
    permissionList: {
      checkedKeys: string[]
      halfCheckedKeys: string[]
    }
    updateTime: string
    createTime: string
  }
  //编辑的参数
  export interface EditParams extends CreateParams {
    _id: string
  }
  // 删除
  export interface DelParams {
    _id: string
  }
}
