import { MutableRefObject } from 'react'
import { Dept, Menu, User } from './api'
/**
 * 创建 create
 * 编辑 edit
 * 删除 delete
 */
export type IAction = 'create' | 'edit' | 'delete'
//默认为 User.UserItem 类型
export interface IModalProp<T = User.UserItem> {
  mRef: MutableRefObject<{ open: (type: IAction, data: T) => void } | undefined>
  update: () => void
}
export interface IDetailProp {
  mRef: MutableRefObject<{ open: (orderId: string) => void } | undefined>
}
