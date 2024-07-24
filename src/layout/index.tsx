import React, { useEffect } from 'react'
import { Layout, Watermark } from 'antd'
import NavHeader from '@/components/NavHeader'
import NavFooter from '@/components/NavFooter'
import Menu from '@/components/Menu'
import { Navigate, Outlet, useLocation, useRouteLoaderData } from 'react-router-dom'
import styles from './index.module.less'
import api from '@/api'
import useBearStore from '@/store'
import { IAuthLoader } from '@/router/AuthLoader'
import { searchRoute } from '@/utils'
import { router } from '@/router'
import TabsFC from '@/components/Tabs'

const { Content, Sider } = Layout
const App: React.FC = () => {
  const { collapsed, userInfo, updateUserInfo } = useBearStore()
  //获取当前路径
  const { pathname } = useLocation()
  useEffect(() => {
    getUserInfo()
  }, [])
  //获取用户信息
  const getUserInfo = async () => {
    const data = await api.getUserInfo()
    //将用户信息存入zustand
    updateUserInfo(data)
  }
  //权限判断 判断当前用户includes中是否有当前路径，没有就无法跳转
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const data = useRouteLoaderData('layout') as IAuthLoader
  const route = searchRoute(pathname, router)
  if (route && route.meta?.auth === false) {
    //继续执行
  } else {
    const staticPath = ['/welcome', '/403', '/404']
    if (!data.menuPathList.includes(pathname) && !staticPath.includes(pathname)) {
      return <Navigate to='/403' />
    }
  }

  return (
    <Watermark content='React'>
      {
        userInfo._id ? (
          <Layout className={styles.layout}>
            <Sider collapsed={collapsed}>
              <Menu />
            </Sider>
            <Layout>
              <NavHeader />
              <TabsFC />
              <Content className={styles.content}>
                <div className={styles.wrapper}>
                  <Outlet />
                </div>
                <NavFooter />
              </Content>
            </Layout>
          </Layout>
        )
          : null
      }

    </Watermark >
  )
}

export default App
