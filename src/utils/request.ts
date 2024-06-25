import axios, { AxiosError } from 'axios'
import { hideLoading, showLoading } from './loading'
import storage from './storage'
import { Result } from '@/types/api'
import { message } from 'antd'
//创建实例
// console.log(import.meta.env.VITE_BASE_API)
const instance = axios.create({
  baseURL: import.meta.env.VITE_BASE_API,
  timeout: 8000,
  timeoutErrorMessage: '请求超时，请稍后再试',
  withCredentials: true, //默认跨域
  headers: {
    icode: '750D1E982FEED3AA'
  }
})
// 请求拦截器
instance.interceptors.request.use(
  config => {
    if (config.showLoading) showLoading()
    const token = storage.get('token')
    if (token) {
      //设置请求的头部(header)中的Authorization字段，其值为Bearer加上localStorage中存储的token值
      config.headers.Authorization = 'Bearer ' + token
    }
    return {
      ...config
    }
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

//响应拦截器
instance.interceptors.response.use(
  response => {
    const data: Result = response.data
    hideLoading()
    if (response.config.responseType === 'blob') return response //如果是blob类型数据，直接返回response
    if (data.code === 500001) {
      message.error(data.msg)
      //登录失效后剔除token值，并且切换到登录页
      storage.remove('token')
      location.href = '/login?callback=' + encodeURIComponent(location.href)
    } else if (data.code != 0) {
      if (response.config.showError === false) {
        return Promise.resolve(data)
      } else {
        message.error(data.msg)
        return Promise.reject(data)
      }
    }
    //将登录成功后的token值返回
    return data.data
  },
  error => {
    hideLoading()
    message.error(error.message)
    return Promise.reject(error.message)
  }
)

interface IConfig {
  showLoading?: boolean
  showError?: boolean
}
export default {
  get<T>(url: string, params?: object, option: IConfig = { showLoading: true, showError: true }): Promise<T> {
    return instance.get(url, { params, ...option })
  },
  post<T>(url: string, params?: object, option: IConfig = { showLoading: true, showError: true }): Promise<T> {
    return instance.post(url, params, option)
  },
  downloadFile(url: string, data: any, fileName = 'fileName.xlsx') {
    instance({
      url,
      data,
      method: 'post', //post请求
      responseType: 'blob' //告诉服务器返回的是一个文件流
    }).then(response => {
      const blob = new Blob([response.data], {
        //创建一个blob对象
        type: response.data.type //获取文件类型
      })
      const name = (response.headers['file-name'] as string) || fileName //获取文件名
      const link = document.createElement('a') //创建一个a标签
      link.download = decodeURIComponent(name) //设置下载的文件名  decodeURIComponent对使用 encodeURIComponent 函数编码的 URI 组件进行解码
      link.href = URL.createObjectURL(blob) //创建一个临时的url
      document.body.append(link) //添加到body
      link.click() //触发点击
      document.body.removeChild(link) //移除
      window.URL.revokeObjectURL(link.href) //释放内存
    })
  }
}
