/**
 * loaclStorage模块封装
 */
export default {
  /**
   * storage存储
   * @param key{string} 参数的名称
   * @param value{any}  写入的值
   * value可能会写入对象 所以将value用JSON.stringify做一个序列化
   */
  set(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value))
  },
  /**
   * storage读取
   * @param key{string} 参数的名称
   * @return storage值
   *
   */
  get(key: string) {
    const value = localStorage.getItem(key)
    //没有值直接返回空字符串
    if (!value) return ''
    //如果value是序列化后的值就使用JSON.parse反序列化，反之就直接返回
    try {
      return JSON.parse(value)
    } catch (error) {
      return value
    }
  },

  /**
   * 删除localStorage值
   * @param key{string} 参数的名称
   */
  remove(key: string) {
    localStorage.removeItem(key)
  },
  /**
   * 清空所有localStorage值
   */
  clear() {
    localStorage.clear()
  }
}
