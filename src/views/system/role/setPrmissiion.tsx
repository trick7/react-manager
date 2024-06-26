import { Menu, Role } from '@/types/api'
import { IAction, IModalProp } from '@/types/modal'
import { Form, Modal, Tree } from 'antd'
import { useEffect, useImperativeHandle, useState } from 'react'
import api from '@/api/index'
import Roleapi from '@/api/roleApi'
import { message } from '@/utils/AntdGlobal'
export default function SetPrmissiion(prpos: IModalProp<Role.RoleItem>) {
  const [visible, setVisible] = useState(false)
  const [checkedKeys, setCheckedKeys] = useState<string[]>([])
  const [menuList, setMenuList] = useState<Menu.MenuItem[]>([])
  const [roleInfo, setRoleInfo] = useState<Role.RoleItem>()
  const [permission, setPermission] = useState<Role.Permission>()
  useEffect(() => {
    getMenuList()
  }, [])
  const getMenuList = async () => {
    const menuList = await api.getMuneList()
    setMenuList(menuList)
  }
  //暴露组件的方法是open
  useImperativeHandle(prpos.mRef, () => {
    return {
      open
    }
  })

  const open = (type: IAction, data?: Role.RoleItem) => {
    //点击打开弹窗
    setVisible(true)
    setRoleInfo(data)
    setCheckedKeys(data?.permissionList.checkedKeys || [])
  }
  //提交
  const handleOk = async () => {
    if (permission) {
      await Roleapi.updetaPermisson(permission)
    }
    message.success('权限设置成功')
    handleCancel()
  }
  //取消
  const handleCancel = () => {
    //关闭弹窗
    setVisible(false)
    setPermission(undefined)
    prpos.update()
  }

  // checkedKeysValue当前选中节点 item当前选中节点包括父节点
  const onCheck = (checkedKeysValue: any, item: any) => {
    // setCheckedKeys存储是为了保证复选框能够选中
    setCheckedKeys(checkedKeysValue)
    const checkedKeys: string[] = []
    // 父级
    const parentckedKeys: string[] = []
    item.checkedNodes.map((node: Menu.MenuItem) => {
      if (node.menuType === 2) {
        checkedKeys.push(node._id)
      } else {
        parentckedKeys.push(node._id)
      }
    })
    setPermission({
      _id: roleInfo?._id || '',
      permissionList: {
        checkedKeys,
        halfCheckedKeys: parentckedKeys.concat(item.halfCheckedKeys)
      }
    })
  }
  return (
    <Modal
      title='设置权限'
      width={600}
      open={visible}
      okText='确定'
      cancelText='取消'
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Form labelAlign='right' labelCol={{ span: 4 }}>
        <Form.Item label='角色名称'>{roleInfo?.roleName}</Form.Item>
        <Form.Item label='权限'>
          {/* checkedKeys当前选中复选框  treeData列表  defaultExpandAll默认展开所有 */}
          {/* fieldNames自定义节点 title、key、children 的字段 */}
          <Tree
            checkable
            defaultExpandAll
            fieldNames={{
              title: 'menuName',
              key: '_id',
              children: 'children'
            }}
            onCheck={onCheck}
            checkedKeys={checkedKeys}
            treeData={menuList}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}
