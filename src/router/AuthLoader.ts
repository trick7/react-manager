import api from '@/api'
import { getMenuPath } from '@/utils'

export default async function AuthLoader() {
  const data = await api.getPermissionList()
  const menuPathList = getMenuPath(data.menuList)
  console.log(data.buttonList)
  console.log(data.menuList)
  console.log(menuPathList)

  return {
    // 获取当前登录用户对应的菜单列表和按钮列表。
    buttonList: data.buttonList,
    menuList: data.menuList,
    menuPathList
  }
}
