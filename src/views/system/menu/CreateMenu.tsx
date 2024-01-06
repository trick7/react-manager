import { useImperativeHandle, useState } from 'react'
import { IAction, IModalProp } from '@/types/modal'
import { Form, Input, InputNumber, Modal, Radio, TreeSelect } from 'antd'
import { Menu } from '@/types/api'
import { useForm } from 'antd/es/form/Form'
import api from '@/api'
import { message } from '@/utils/AntdGlobal'
import { InfoCircleOutlined } from '@ant-design/icons'
export default function CreateMenu(props: IModalProp<Menu.EditParams>) {
  const [form] = useForm()
  const [action, setAction] = useState<IAction>('create')
  //弹窗开启与关闭
  const [visible, setVisible] = useState(false)
  const [menuList, setMenuList] = useState<Menu.MenuItem[]>([])
  //获取菜单列表
  const getMuneList = async () => {
    //getFieldsValue获取表单中指定字段的值
    const data = await api.getMuneList()
    setMenuList(data)
  }

  //暴露open方法
  useImperativeHandle(props.mRef, () => ({
    open
  }))
  //打开弹窗函数
  const open = (type: IAction, data?: Menu.EditParams | { parentId: string }) => {
    setAction(type)
    setVisible(true)
    //打开弹窗重新更新上级部门列表
    getMuneList()
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
        await api.createMenu(form.getFieldsValue())
      } else {
        await api.editMenu(form.getFieldsValue())
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
      title={action === 'create' ? '创建菜单' : '编辑菜单'}
      width={800}
      open={visible}
      okText='确定'
      cancelText='取消'
      onOk={handleSubmit}
      onCancel={handleCance}
    >
      {/* initialValues 添加初始化值 */}
      <Form form={form} labelAlign='right' labelCol={{ span: 3 }} initialValues={{ menuType: 1, menuState: 1 }}>
        {/* 创建隐藏域 */}
        <Form.Item hidden name='_id'>
          <Input />
        </Form.Item>
        <Form.Item label='上级菜单' name='parentId'>
          {/* TreeSelect 树选择 */}
          <TreeSelect
            placeholder='请选择父级菜单'
            allowClear //允许删除
            treeDefaultExpandAll //默认展开所有字段
            //自定义节点 将label映射到deptName
            fieldNames={{ label: 'menuName', value: '_id' }}
            treeData={menuList}
          />
        </Form.Item>
        <Form.Item label='菜单类型' name='menuType'>
          <Radio.Group>
            <Radio value={1}>菜单</Radio>
            <Radio value={2}>按钮</Radio>
            <Radio value={3}>页面</Radio>
          </Radio.Group>
        </Form.Item>
        {/* name表单名称，会作为表单字段 id 前缀使用 */}
        <Form.Item label='菜单名称' name='menuName' rules={[{ required: true, message: '请输入菜单名称' }]}>
          <Input placeholder='请输入菜单名称' />
        </Form.Item>
        {/* shouldUpdate 自定义渲染 当 shouldUpdate 为 true 时，Form 的任意变化都会使该 Form.Item 重新渲染
          noStyle 不要样式
        */}
        <Form.Item noStyle shouldUpdate>
          {() => {
            return form.getFieldValue('menuType') === 2 ? (
              <Form.Item label='权限标识' name='menuCode'>
                <Input placeholder='请输入权限标识' />
              </Form.Item>
            ) : (
              <>
                <Form.Item label='菜单图标' name='icon'>
                  <Input placeholder='请输入菜单图标' />
                </Form.Item>
                <Form.Item label='路由地址' name='path'>
                  <Input placeholder='请输入路由地址' />
                </Form.Item>
              </>
            )
          }}
        </Form.Item>

        <Form.Item label='组件名称' name='component'>
          <Input placeholder='请输入组件名称' />
        </Form.Item>
        <Form.Item label='排序' name='orderBy' tooltip={{ title: '排序值越大越靠后', icon: <InfoCircleOutlined /> }}>
          <InputNumber placeholder='请输入排序值' />
        </Form.Item>
        <Form.Item label='菜单状态' name='menuState'>
          <Radio.Group>
            <Radio value={1}>启用</Radio>
            <Radio value={2}>停用</Radio>
          </Radio.Group>
        </Form.Item>
      </Form>
    </Modal>
  )
}
