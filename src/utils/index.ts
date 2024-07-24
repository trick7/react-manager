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
  // 如果规则为'yyyy-mm-dd'，则返回本地化的日期字符串，并确保使用'-'作为分隔符
  if (rule === 'yyyy-mm-dd') return curDate.toLocaleDateString().replaceAll('/', '-')
  // 如果规则为'HH:mm:ss'，则返回本地化的时间字符串，并确保使用'-'作为分隔符
  if (rule === 'HH:mm:ss') return curDate.toLocaleTimeString().replaceAll('/', '-')
  // 如果没有指定规则或规则不匹配，则返回完整的本地化日期和时间字符串，并确保使用'-'作为分隔符
  return curDate.toLocaleString().replaceAll('/', '-')
}

// 格式化日期函数
// date: 待格式化的日期，可以是Date对象或字符串形式，默认为当前日期
// rule: 格式化规则，默认为'yyyy-MM-dd HH:mm:ss'
export const formatDate = (date?: Date | string, rule?: string) => {
  // 当前日期，默认为当前日期和时间
  let curDate = new Date()
  /*
   * 如果传入的date是Date对象，则直接使用它
   *如果传入的date不是Date对象但存在，则尝试将其转换为Date对象
   */
  if (date instanceof Date) curDate = date
  else if (date) curDate = new Date(date)
  // 格式化规则，如果没有传入，则使用默认的'yyyy-MM-dd HH:mm:ss'
  let fmt = rule || 'yyyy-MM-dd HH:mm:ss'
  // 将格式化规则中的'yyyy'替换为当前年份
  fmt = fmt.replace(/(y+)/, curDate.getFullYear().toString())
  // 定义一个对象，存储日期和时间各个部分的数值
  type OType = {
    [key: string]: number
  }
  const O: OType = {
    'M+': curDate.getMonth() + 1, // 月份，注意JS中月份是从0开始的，所以加1
    'd+': curDate.getDate(), // 日期
    'H+': curDate.getHours(), // 小时
    'm+': curDate.getMinutes(), // 分钟
    's+': curDate.getSeconds() // 秒
  }
  // 遍历对象O，根据规则替换fmt中的占位符
  for (const k in O) {
    // 格式化数字，如果数字大于9则直接转为字符串，否则前面补0
    fmt = fmt.replace(new RegExp(`(${k})`), O[k] > 9 ? O[k].toString() : '0' + O[k].toString())
  }
  // 返回格式化后的日期字符串
  return fmt
}

//用户的状态转换
export const formatState = (state: number) => {
  if (state === 1) return '在职'
  if (state === 2) return '试用期'
  if (state === 3) return '离职'
}

/**
 * 获取菜单路径数组。
 *
 * 该函数通过遍历菜单项列表，构建一个包含所有菜单路径的字符串数组。
 * 菜单项可能包含子菜单，这些子菜单的路径也会被递归地添加到结果中。
 * 如果菜单项包含按钮而不是路径，那么该菜单项将被忽略，不添加到结果中。
 *
 * @param list 菜单项列表，每个菜单项包含路径和可能的子菜单。
 * @returns 返回一个字符串数组，包含所有菜单项的路径。
 */
export const getMenuPath = (list: Menu.MenuItem[]): string[] => {
  return list.reduce((result: string[], item: Menu.MenuItem) => {
    // 根据菜单项是否有子菜单和按钮来决定如何处理当前菜单项的路径
    return result.concat(Array.isArray(item.children) && !item.buttons ? getMenuPath(item.children) : item.path + '')
  }, [])
}

//递归获取路由的对象
/**
 * 在路由配置中搜索匹配特定路径的路由项。
 *
 * 该函数递归地搜索给定路由数组，以找到与指定路径完全匹配的路由项。
 * 如果找到匹配的项，它将返回该项；如果没有找到，它将返回空字符串。
 *
 * @param path 要搜索的路径字符串。
 * @param routes 路由配置数组，默认为空数组。
 * @returns 匹配的路由项或空字符串。
 */
export const searchRoute: any = (path: string, routes: any = []) => {
  // 遍历路由数组，寻找匹配的路由项
  for (const item of routes) {
    // 如果当前项的路径与搜索路径完全匹配，则返回当前项
    if (item.path === path) return item
    // 如果当前项有子项，递归搜索子项
    if (item.children) {
      const result = searchRoute(path, item.children)
      // 如果在子项中找到了匹配的项，则返回该项
      if (result) return result
    }
  }
  // 如果遍历完所有项都没有找到匹配的项，则返回空字符串
  return ''
}

/**
 * 手机号加密
 * @example
 * 17611000011 => 176****0011
 */
export const formateMobile = (mobile?: number) => {
  if (!mobile) return '-'
  const phone = mobile.toString() // 将手机号转换为字符串
  return phone.replace(/(\d{3})\d*(\d{4})/, '$1****$2') // 使用正则表达式替换手机号
}

/**
 *递归查找树的路径
 */
/**
 * 在菜单树中查找指定路径的节点。
 *
 * @param tree 菜单树，由多个菜单项组成的数组。
 * @param pathName 需要查找的路径名称。
 * @param path 当前遍历的路径，作为一个栈来使用。
 * @returns 返回找到的路径数组，如果未找到则返回空数组。
 */
export const findTreeNode = (tree: Menu.MenuItem[], pathName: string, path: string[]): string[] => {
  if (!tree) return [] // 如果树为空，返回空数组

  // 遍历菜单树的每个节点
  for (const data of tree) {
    // 将当前第一级节点的名称添加到路径数组中
    path.push(data.menuName)
    // 如果当前节点的路径与目标路径相同，返回当前路径
    if (data.path === pathName) return path
    // 如果当前节点有子节点，递归查找子节点
    if (data.children?.length) {
      const list = findTreeNode(data.children, pathName, path)
      // 如果在子节点中找到了目标路径，返回该路径
      if (list.length) return list
    }
    // 如果当前节点不是目标节点，且没有子节点或子节点中未找到目标节点，移除当前节点名称 from 路径
    path.pop()
  }
  // 如果遍历完所有节点仍未找到目标路径，返回空数组
  return []
}
