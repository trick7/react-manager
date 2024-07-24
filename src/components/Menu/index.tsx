import { Menu } from 'antd'
import styles from './index.module.css'
import { useLocation, useNavigate, useRouteLoaderData } from 'react-router-dom'
import useBearStore from '@/store'
import type { MenuProps, MenuTheme } from 'antd'
import { useEffect, useState } from 'react'
import { Menu as IMenu } from '@/types/api'
import * as Icons from '@ant-design/icons'
import React from 'react'
const SidMenu = () => {
  const [menuList, setMenuList] = useState<MenuItem[]>([])//菜单列表
  const navgate = useNavigate()
  const { collapsed } = useBearStore()
  //加载页面前，先执行layout，获取权限列表，再根据权限列表动态生成左侧菜单。
  const data: any = useRouteLoaderData('layout')
  const [selectedKeys, setSelectedKeys] = useState<string[]>([])//当前选中的菜单
  const { pathname } = useLocation()//当前路径
  //生成每个菜单项
  type MenuItem = Required<MenuProps>['items'][number]
  /**
 * 创建一个菜单项对象。
 *
 * 该函数用于生成一个符合MenuItem类型的对象，用于表示菜单结构中的一个项。
 * 菜单项包含标签、键值、图标和子菜单项等信息，用于在UI中展示和交互。
 *
 * @param label 菜单项的显示文本，可以是任何React节点。
 * @param key 菜单项的唯一标识符，用于React中的列表渲染。
 * @param icon 菜单项的图标，可选参数，用于美化菜单项。
 * @param children 菜单项的子菜单项数组，可选参数，用于创建嵌套菜单结构。
 * @returns 返回一个符合MenuItem类型的对象，包含传入的属性。
 */
  function getItem(
    label: React.ReactNode, //菜单名称
    key: React.Key, //路径
    icon?: React.ReactNode, //图标
    children?: MenuItem[]
  ): MenuItem {
    return {
      label,
      key,
      icon,
      children
    } as MenuItem
  }
  //创建图标
  function createIcon(name?: string) {
    if (!name) return <></>
    const customerIcons: { [key: string]: any } = Icons
    const Icon = customerIcons[name]
    if (!Icon) return <></>
    return React.createElement(Icon)
  }
  //递归生成菜单
  const getTreeMenu = (menuList: IMenu.MenuItem[], treeList: MenuItem[] = []) => {
    menuList.forEach((item, index) => {
      //item.menuState === 1表示正常状态的菜单
      if (item.menuType === 1 && item.menuState === 1) {
        if (item.buttons) return treeList.push(getItem(item.menuName, item.path || index, createIcon(item.icon)))
        treeList.push(
          getItem(item.menuName, item.path || index, createIcon(item.icon), getTreeMenu(item.children || []))
        )
      }
    })
    return treeList
  }
  //初始化获取菜单列表数据
  useEffect(() => {
    const treeMenuList = getTreeMenu(data.menuList)
    setMenuList(treeMenuList)
    setSelectedKeys([pathname])
  }, [])
  //logo点击
  const handleClickLogo = () => {
    navgate('/welcome')
    setSelectedKeys([])  /**
   * 生成树形菜单结构。
   *
   * 通过遍历菜单列表，将满足条件的菜单项转换为树形结构的菜单项，并递归处理其子菜单。
   * 只有类型为1且状态为1的菜单项才会被包含在树形菜单中。
   *
   * @param menuList 菜单列表，包含所有菜单项的信息。
   * @param treeList (可选) 已经处理过的树形菜单列表，默认为空数组。
   * @returns 返回处理后的树形菜单列表。
   */
    //递归生成菜单
    const getTreeMenu = (menuList: IMenu.MenuItem[], treeList: MenuItem[] = []) => {
      menuList.forEach((item, index) => {
        // 只处理类型为1且状态为1的菜单项
        //item.menuState === 1表示正常状态的菜单
        if (item.menuType === 1 && item.menuState === 1) {
          // 如果菜单项包含按钮，则不处理子菜单，直接添加到树形菜单列表
          if (item.buttons) return treeList.push(getItem(item.menuName, item.path || index, createIcon(item.icon)))
          // 否则，添加菜单项及其子菜单到树形菜单列表
          treeList.push(
            getItem(item.menuName, item.path || index, createIcon(item.icon), getTreeMenu(item.children || []))
          )
        }
      })
      return treeList
    }
  }
  //菜单点击
  const handleClickMenu = ({ key }: { key: string }) => {
    setSelectedKeys([key])
    navgate(key)
  }
  return (
    <div>
      <div className={styles.logo} onClick={handleClickLogo}>
        <img src='/img/logo.png' alt='' className={styles.img} />
        {collapsed ? '' : <span>游戏交易</span>}
      </div>
      <Menu
        defaultSelectedKeys={['1']}
        mode='inline'
        theme='dark'
        // style={{
        //   width: collapsed ? 80 : 'auto'
        // }}
        //selectedKeys使其变为受控组件
        selectedKeys={selectedKeys}
        onClick={handleClickMenu}
        items={menuList}
      />
    </div>
  )
}

export default SidMenu
