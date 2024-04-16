/*
工具函数封装
*/

import { Menu } from '@/types/api'

//格式化金额
export const formatMoney = (num?: number | string) => {
  // 如果传入的num是undefined或者null，则返回0
  if (!num) return 0
  // 将num转换为字符串，然后再转换为浮点数，确保可以处理数字和字符串类型的输入
  const a = parseFloat(num.toString())
  // 使用toLocaleString方法将浮点数转换为带有中文格式和人民币符号的字符串
  // 'zh-cn' 表示使用中文（简体，中国）的地区设置
  // { style: 'currency', currency: 'CNY' } 表示使用货币格式，并指定货币为人民币
  return a.toLocaleString('zh-cn', { style: 'currency', currency: 'CNY' })
}
//格式化数字
export const formatNum = (num?: number | string) => {
  if (!num) return 0
  const a = num.toString()
  if (a.indexOf('.') > -1) return a.replace(/(\d)(?=(\d{3})+\.)/g, '$1,')
  return a.replace(/(\d)(?=(\d{3})+$)/g, '$1,')
}
//格式化日期
export const toLocalDate = (date?: Date | string, rule?: string) => {
  let curDate = new Date()
  //判断date类型 如果不是Date 就创建个Date来转换接受的值
  if (date instanceof Date) curDate = date
  else if (date) curDate = new Date(date)

  if (rule === 'yyyy-mm-dd') return curDate.toLocaleDateString().replaceAll('/', '-')
  if (rule === 'HH:mm:ss') return curDate.toLocaleTimeString().replaceAll('/', '-')
  return curDate.toLocaleString().replaceAll('/', '-')
}
// 格式化日期
export const formatDate = (date?: Date | string, rule?: string) => {
  let curDate = new Date()
  if (date instanceof Date) curDate = date
  else if (date) curDate = new Date(date)

  let fmt = rule || 'yyyy-MM-dd HH:mm:ss'
  fmt = fmt.replace(/(y+)/, curDate.getFullYear().toString())
  type OType = {
    [key: string]: number
  }
  const O: OType = {
    'M+': curDate.getMonth() + 1,
    'd+': curDate.getDate(),
    'H+': curDate.getHours(),
    'm+': curDate.getMinutes(),
    's+': curDate.getSeconds()
  }
  for (const k in O) {
    // const val = O[k].toString()
    fmt = fmt.replace(new RegExp(`(${k})`), O[k] > 9 ? O[k].toString() : '0' + O[k].toString())
    // fmt = fmt.replace(new RegExp(`(${k})`), ('00' + val).substring(val.length))
  }
  return fmt
}

//用户的状态转换
export const formatState = (state: number) => {
  if (state === 1) return '在职'
  if (state === 2) return '试用期'
  if (state === 3) return '离职'
}

//获取页面路径
export const getMenuPath = (list: Menu.MenuItem[]): string[] => {
  return list.reduce((result: string[], item: Menu.MenuItem) => {
    return result.concat(Array.isArray(item.children) && !item.buttons ? getMenuPath(item.children) : item.path + '')
  }, [])
}

//递归获取路由的对象
export const searchRoute: any = (path: string, routes: any = []) => {
  for (const item of routes) {
    if (item.path === path) return item
    if (item.children) {
      return searchRoute(path, item.children)
    }
  }
  return ''
}
