import { RouterProvider, BrowserRouter } from 'react-router-dom'
import { ConfigProvider, App as AntdApp } from 'antd'
import './App.css'
import AntdGlobal from './utils/AntdGlobal'
// import router from './router'
// import Router from './router'
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
