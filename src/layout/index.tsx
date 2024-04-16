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
const { Content, Sider } = Layout
const App: React.FC = () => {
  const { collapsed, updateUserInfo } = useBearStore()
  //获取当前路径
  const { pathname } = useLocation()
  useEffect(() => {
    getUserInfo()
  }, [])
  const getUserInfo = async () => {
    const data = await api.getUserInfo()
    //将data存入zustand
    updateUserInfo(data)
  }
  const route = searchRoute(pathname, router)
  if (route && route.meta?.auth === false) {
    //继续执行
  } else {
    //权限判断 判断当前用户includes中是否有当前路径，没有就无法跳转
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const data = useRouteLoaderData('layout') as IAuthLoader
    const staticPath = ['/welcome', '/403', '/404']
    if (!data.menuPathList.includes(pathname) && !staticPath.includes(pathname)) {
      return <Navigate to='/403' />
    }
  }

  return (
    <Watermark content='React'>
      <Layout className={styles.layout}>
        <Sider collapsed={collapsed}>
          <Menu />
        </Sider>
        <Layout>
          <NavHeader />
          <Content className={styles.content}>
            <div className={styles.wrapper}>
              <Outlet />
            </div>
            <NavFooter />
          </Content>
        </Layout>
      </Layout>
    </Watermark>
  )
}

export default App
