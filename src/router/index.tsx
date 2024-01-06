import { Navigate, createBrowserRouter } from 'react-router-dom'
import Login from '@/views/login/Login'
import Welcome from '@/views/welcome'
import User from '@/views/system/user'
import Dept from '@/views/system/dept'
import Menu from '@/views/system/menu'
import Role from '@/views/system/role'
import NotFound from '@/views/NotFound'
import Error403 from '@/views/403'
import Layout from '@/layout'
import Dashboard from '@/views/dashboard'
import AuthLoader from './AuthLoader'

const router = [
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
    loader: AuthLoader,
    children: [
      {
        path: '/welcome',
        element: <Welcome />
      },
      {
        path: '/dashboard',
        element: <Dashboard />
      },
      {
        path: '/userList',
        element: <User />
      },
      {
        path: '/deptList',
        element: <Dept />
      },
      {
        path: '/MenuList',
        element: <Menu />
      },
      {
        path: '/RoleList',
        element: <Role />
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
