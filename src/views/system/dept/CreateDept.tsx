import { useEffect, useImperativeHandle, useState } from 'react'
import { IAction, IModalProp } from '@/types/modal'
import { Form, Input, Modal, Select, TreeSelect } from 'antd'
import { Dept, User } from '@/types/api'
import { useForm } from 'antd/es/form/Form'
import api from '@/api'
import { message } from '@/utils/AntdGlobal'
export default function CreateDept(props: IModalProp<Dept.EditParams>) {
  const [form] = useForm()
  const [action, setAction] = useState<IAction>('create')
  //弹窗开启与关闭
  const [visible, setVisible] = useState(false)
  const [deptList, setDeptList] = useState<Dept.DeptItem[]>([])
  //用户列表
  const [userList, setUserList] = useState<User.UserItem[]>([])

  useEffect(() => {
    // getDeptList()
    getAllUserList()
  }, [])
  //部门列表
  const getDeptList = async () => {
    const data = await api.getDeptList()
    setDeptList(data)
  }
  //用户列表
  const getAllUserList = async () => {
    const data = await api.getAllUserList()
    setUserList(data)
  }
  //暴露open方法
  useImperativeHandle(props.mRef, () => ({
    open
  }))
  //打开弹窗函数
  const open = (type: IAction, data?: Dept.EditParams | { parentId: string }) => {
    setAction(type)
    setVisible(true)
    //打开弹窗重新更新上级部门列表
    getDeptList()
    if (data) {
      //设置修改后的值
      form.setFieldsValue(data)
    }
  }
  //部门提交
  const handleSubmit = async () => {
    //validateFields验证表单字段
    const valid = await form.validateFields()
    if (valid) {
      if (action === 'create') {
        await api.createDept(form.getFieldsValue())
      } else {
        await api.editDept(form.getFieldsValue())
      }
      message.success('操作成功')
      //关闭弹窗关闭弹框并清空表单
      handleCance()
      //更新列表
      props.update()
    }
  }
  //关闭弹框并清空表单
  const handleCance = () => {
    setVisible(false)
    form.resetFields()
  }
  return (
    <Modal
      title={action === 'create' ? '创建部门' : '编辑部门'}
      width={800}
      open={visible}
      okText='确定'
      cancelText='取消'
      onOk={handleSubmit}
      onCancel={handleCance}
    >
      <Form form={form} labelAlign='right' labelCol={{ span: 3 }}>
        {/* 创建隐藏域 */}
        <Form.Item hidden name='_id'>
          <Input />
        </Form.Item>
        <Form.Item label='上级部门' name='parentId'>
          {/* TreeSelect 树选择 */}
          <TreeSelect
            placeholder='请选择上级部门'
            allowClear //允许删除
            treeDefaultExpandAll //默认展开所有字段
            //自定义节点 将label映射到deptName
            fieldNames={{ label: 'deptName', value: '_id' }}
            treeData={deptList}
          />
        </Form.Item>
        <Form.Item label='部门名称' name='deptName' rules={[{ required: true, message: '请输入部门名称' }]}>
          <Input placeholder='请输入部门名称' />
        </Form.Item>
        <Form.Item label='负责人' name='userName' rules={[{ required: true, message: '请输选择负责人' }]}>
          <Select>
            {userList.map(item => {
              return (
                <Select.Option value={item.userName} key={item._id}>
                  {item.userName}
                </Select.Option>
              )
            })}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  )
}
