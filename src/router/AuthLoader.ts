import api from '@/api'
import { Menu } from '@/types/api'
import { getMenuPath } from '@/utils'

export interface IAuthLoader {
  buttonList: string[] //按钮列表
  menuList: Menu.MenuItem[] //菜单列表
  menuPathList: string[] //菜单路径列表
}

export default async function AuthLoader() {
  const data = await api.getPermissionList() // 获取当前登录用户对应的菜单列表和按钮列表。
  const menuPathList = getMenuPath(data.menuList) // 获取菜单路径列表

  return {
    // 获取当前登录用户对应的菜单列表和按钮列表。
    buttonList: data.buttonList,
    menuList: data.menuList,
    menuPathList //菜单路径列表
  }
}
