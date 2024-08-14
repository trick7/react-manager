import { IAuthLoader } from "@/router/AuthLoader";
import { searchRoute } from "@/utils";
import { Tabs } from "antd";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useRouteLoaderData } from "react-router-dom";

interface TabsItem {
  key: string;
  label: string;
  closable: boolean//是否可以关闭
}
export default function TabsFC() {
  const navgate = useNavigate()
  const { pathname } = useLocation()//获取当前路径
  const [tabsList, setTabsList] = useState<TabsItem[]>([{ key: '/welcome', label: '首页', closable: false }])//创建tabsList
  const [activeKey, setActiveKey] = useState('')//创建activeKey
  //权限判断 判断当前用户includes中是否有当前路径，没有就无法跳转
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const data = useRouteLoaderData('layout') as IAuthLoader
  useEffect(() => {
    addTabs()
  }, [pathname])

  //创建页签的方法
  const addTabs = () => {
    // 根据当前路径查找对应的路由信息。
    const route = searchRoute(pathname, data.menuList)
    if (!route) return
    // 检查标签页列表中是否已经存在当前路由对应的标签页。
    if (!tabsList.find(item => item.key == route.path)) {
      // 如果不存在，则创建一个新的标签页并添加到标签页列表中。
      tabsList.push({
        key: route.path,//设置为当前路由的路径
        label: route.menuName,//设置为当前路由的菜单名称
        closable: pathname !== '/welcome' //根据当前路径名（pathname）是否不等于'/welcome'来决定是否可关闭。如果当前路径不是'/welcome'，则closable为true，表示这个标签页是可关闭的；
      })
    }
    // 更新标签页列表的状态，以确保用户界面能够反映出变化。
    setTabsList([...tabsList])
    setActiveKey(pathname)
  }

  //路由切换的方法
  const handleChange = (path: string) => {
    navgate(path)
  }

  /**
   * 处理标签页的删除操作。
   * 当前标签页被删除时，如果它是激活的标签页，导航到下一个可用的标签页。
   * @param path 被删除标签页的路径。
   */
  const handleDel = (path: string) => {
    // 如果当前路径与被删除的路径相同，则需处理激活标签页的变更
    if (pathname === path) {
      // 遍历标签页列表，寻找下一个或上一个可用的标签页
      tabsList.forEach((item, index: number) => {
        // 如果当前标签页不是被删除的标签页，则继续
        if (item.key != pathname) return
        // 尝试获取下一个标签页，如果不存在，则获取上一个标签页
        const nextTab = tabsList[index + 1] || tabsList[index - 1]
        // 如果没有下一个或上一个标签页，则不进行导航
        if (!nextTab) return
        // 导航到找到的下一个或上一个标签页
        navgate(nextTab.key)
      })
    }
    // 从标签页列表中移除被删除的标签页
    setTabsList(tabsList.filter(item => item.key != path))
  }
  return <Tabs
    activeKey={activeKey}//设置当前激活的标签页
    items={tabsList}//设置标签页列表
    tabBarStyle={{ height: 40, marginBottom: 0, backgroundColor: '#fff' }}
    type='editable-card'
    hideAdd
    onChange={handleChange}//切换标签页
    onEdit={(path) => {
      handleDel(path as string)
    }}//处理标签页的删除操作
  />
}
