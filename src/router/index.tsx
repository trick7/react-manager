import React from 'react'
import { Navigate, createBrowserRouter } from 'react-router-dom'
import Login from '@/views/login/Login'
import Welcome from '@/views/welcome'
// import User from '@/views/system/user'
// import Dept from '@/views/system/dept'
// import Menu from '@/views/system/menu'
// import Role from '@/views/system/role'
// import OrderList from '@/views/order/OrderList'
import NotFound from '@/views/NotFound'
import Error403 from '@/views/403'
import Layout from '@/layout'
// import Dashboard from '@/views/dashboard'
import AuthLoader from './AuthLoader'
// import Ordercluster from '@/views/order/Ordercluster'
// import DriverList from '@/views/order/DriverList'
import { LazyLoad } from './LazyLoad'

export const router = [
  {
    path: '/',
    element: <Navigate to='/welcome' />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    //加载页面前，先执行Loader，获取权限列表，再根据权限列表动态生成左侧菜单。
    id: 'layout',
    element: <Layout />,
    loader: AuthLoader,//每个路由都可以定义一个 "loader"函数，以便在路由元素渲染前为其提供数据。
    children: [
      {
        path: '/welcome',
        element: <Welcome />
      },
      {
        path: '/dashboard',
        element: LazyLoad(React.lazy(() => import('@/views/dashboard')))
      },
      {
        path: '/userList',
        element: LazyLoad(React.lazy(() => import('@/views/system/user')))
      },
      {
        path: '/deptList',
        element: LazyLoad(React.lazy(() => import('@/views/system/dept')))
      },
      {
        path: '/MenuList',
        element: LazyLoad(React.lazy(() => import('@/views/system/menu')))
        //mata配置不需要权限认证
        // meta: {
        //   auth: false
        // }
      },
      {
        path: '/RoleList',
        element: LazyLoad(React.lazy(() => import('@/views/system/role')))
      },
      {
        path: '/orderList',
        element: LazyLoad(React.lazy(() => import('@/views/order/OrderList')))
      },
      {
        path: '/cluster',
        element: LazyLoad(React.lazy(() => import('@/views/order/Ordercluster')))
      },
      {
        path: '/driverList',
        element: LazyLoad(React.lazy(() => import('@/views/order/DriverList')))
      }
    ]
  },
  {
    path: '*',
    element: <Navigate to='/404' />
  },
  {
    path: '/404',
    element: <NotFound />
  },
  {
    path: '/403',
    element: <Error403 />
  }
]

// eslint-disable-next-line react-refresh/only-export-components
export default createBrowserRouter(router)
// export default function Router() {
//   return useRoutes(router)
// }
