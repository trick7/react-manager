import { RouterProvider } from 'react-router-dom'
import { ConfigProvider, App as AntdApp } from 'antd'
import './App.less'
import AntdGlobal from './utils/AntdGlobal'
import router from './router'

function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#ed6c00'
        }
      }}
    >
      <AntdApp>
        <AntdGlobal />
        <RouterProvider router={router} />
      </AntdApp>
    </ConfigProvider>
  )

  // return (
  //   <BrowserRouter>
  //     <Router />
  //   </BrowserRouter>
  // )
}

export default App
