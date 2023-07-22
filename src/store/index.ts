import { User } from '@/types/api'
import { create } from 'zustand'
export const useBearStore = create<{
  token: string
  userInfo: User.UserItem
  collapsed: boolean
  updateCollapsed: (collapsed: boolean) => void
  updateToken: (token: string) => void
  updateUserInfo: (userInfo: User.UserItem) => void
}>(set => ({
  token: '',
  userInfo: {
    _id: '',
    userId: 0,
    userName: '',
    userEmail: '',
    deptId: '',
    mobile: '',
    job: '',
    state: 0,
    role: 0,
    roleList: '',
    createId: 0,
    deptName: '',
    userImg: ''
  },
  collapsed: false,
  //({}) 代表返回一个object对象
  updateToken: token => set({ token }),
  updateUserInfo: (userInfo: User.UserItem) => set({ userInfo }),
  updateCollapsed: collapsed => set({ collapsed: !collapsed })
  // updateCollapsed: () =>
  //   set(state => {
  //     return {
  //       collapsed: !state.collapsed
  //     }
  //   })
  // updateUserInfo(userInfo: User.UserItem) {
  //   set({
  //     userInfo
  //   })
  // }
}))
export default useBearStore
