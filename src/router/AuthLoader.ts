import api from '@/api'
import { Menu } from '@/types/api'
import { getMenuPath } from '@/utils'

export interface IAuthLoader {
  buttonList: string[]
  menuList: Menu.MenuItem[]
  menuPathList: string[]
}

export default async function AuthLoader() {
  const data = await api.getPermissionList() // 获取当前登录用户对应的菜单列表和按钮列表。
  const menuPathList = getMenuPath(data.menuList) // 获取菜单路径列表
  // console.log(data.buttonList)
  // console.log(data.menuList)
  // console.log(menuPathList)

  return {
    // 获取当前登录用户对应的菜单列表和按钮列表。
    buttonList: data.buttonList,
    menuList: data.menuList,
    menuPathList //菜单路径列表
  }
}
