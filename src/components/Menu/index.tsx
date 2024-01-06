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
  const [menuList, setMenuList] = useState<MenuItem[]>([])
  const navgate = useNavigate()
  const { collapsed } = useBearStore()
  //加载页面前，先执行layout，获取权限列表，再根据权限列表动态生成左侧菜单。
  const data: any = useRouteLoaderData('layout')
  const [selectedKeys, setSelectedKeys] = useState<string[]>([])
  const { pathname } = useLocation()
  //生成每个菜单项
  type MenuItem = Required<MenuProps>['items'][number]
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
