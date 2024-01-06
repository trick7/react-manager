import { MutableRefObject } from 'react'
import { Dept, Menu, User } from './api'
/**
 * 创建 create
 * 编辑 edit
 * 删除 delete
 */
export type IAction = 'create' | 'edit' | 'delete'

export interface IModalProp<T = User.UserItem> {
  mRef: MutableRefObject<{ open: (type: IAction, data: T) => void } | undefined>
  update: () => void
}
// export interface IModalProp2 {
//   mRef: MutableRefObject<{ open: (type: IAction, data: Dept.DeptItem) => void } | undefined>
//   update: () => void
// }
