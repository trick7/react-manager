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
    icode: '5245E336FD24ADB7'
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
  }
}
