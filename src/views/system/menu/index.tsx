import api from '@/api'
import { Menu } from '@/types/api'
import { Button, Form, Input, Modal, Select, Space, Table } from 'antd'
import { useForm } from 'antd/es/form/Form'
import { useEffect, useRef, useState } from 'react'
import { IAction } from '@/types/modal'
import { ColumnsType } from 'antd/es/table'
import { message } from '@/utils/AntdGlobal'
import { formatDate } from '@/utils'
import CreateMenu from './CreateMenu'
export default function MenuList() {
  const [form] = useForm()
  const menuRef = useRef<{
    open: (type: IAction, data?: Menu.EditParams | { parentId?: string; orderBy?: number }) => void
  }>()
  const [data, setData] = useState<Menu.MenuItem[]>([])
  useEffect(() => {
    getMuneList()
  }, [])
  //获取菜单列表
  const getMuneList = async () => {
    //getFieldsValue获取表单中指定字段的值 获取一组字段名对应的值，会按照对应结构返回。默认返回现存字段值，当调用 getFieldsValue(true) 时返回所有值
    const data = await api.getMuneList(form.getFieldsValue())
    setData(data)
  }
  //重置
  const handleReset = () => {
    form.resetFields()
    getMuneList()
  }
  //创建菜单
  const handleCreate = () => {
    menuRef.current?.open('create', {
      orderBy: data.length + 1
    })
  }
  //创建子部门
  const handleSubCreate = (record: Menu.MenuItem) => {
    menuRef.current?.open('create', { parentId: record._id, orderBy: record.children?.length })
  }
  //编辑菜单
  const handleEdit = (record: Menu.MenuItem) => {
    menuRef.current?.open('edit', record)
  }
  //删除菜单
  const handleDelete = (record: Menu.MenuItem) => {
    let text = ''
    if (record.menuType === 1) text = '删除'
    if (record.menuType === 2) text = '按钮'
    if (record.menuType === 3) text = '页面'
    Modal.confirm({
      title: '确认',
      content: `确认删除该${text}吗？`,
      onOk() {
        handleDelSubmit(record._id)
      }
    })
  }
  //删除提交
  const handleDelSubmit = async (_id: string) => {
    await api.deleteMenu({
      _id
    })
    message.success('删除成功')
    getMuneList()
  }

  const columns: ColumnsType<Menu.MenuItem> = [
    {
      title: '菜单名称',
      dataIndex: 'menuName',
      key: 'menuName',
      width: 150
    },
    {
      title: '菜单图标',
      dataIndex: 'icon',
      key: 'icon',
      width: 185
    },
    {
      title: '菜单类型',
      dataIndex: 'menuType',
      key: 'menuType',
      align: 'center',
      width: 100,
      render(menuType: number) {
        return {
          1: '菜单',
          2: '按钮',
          3: '页面'
        }[menuType]
      }
    },
    {
      title: '权限标识',
      dataIndex: 'menuCode',
      key: 'menuCode',
      width: 150
    },
    {
      title: '路由地址',
      dataIndex: 'path',
      key: 'path',
      width: 145
    },
    {
      title: '组件名称',
      dataIndex: 'component',
      key: 'component',
      width: 120
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 195,
      render(createTime) {
        return formatDate(createTime)
      }
    },
    {
      title: '操作',
      key: 'action',
      width: 229.4,
      render(_, record) {
        return (
          <Space>
            <Button type='text' onClick={() => handleSubCreate(record)}>
              新增
            </Button>
            <Button type='text' onClick={() => handleEdit(record)}>
              编辑
            </Button>
            <Button type='text' danger onClick={() => handleDelete(record)}>
              删除
            </Button>
          </Space>
        )
      }
    }
  ]
  return (
    <div>
      <Form className='serch-form' layout='inline' form={form} initialValues={{ menuState: 1 }}>
        <Form.Item label='菜单名称' name='menuName'>
          <Input placeholder='部门名称' />
        </Form.Item>
        <Form.Item label='菜单状态' name='menuState'>
          <Select style={{ width: 100 }}>
            <Select.Option value={1}>正常</Select.Option>
            <Select.Option value={2}>停用</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item>
          {/* 自动给搜索添加边距等样式 */}
          <Space>
            <Button type='primary' onClick={getMuneList}>
              搜索
            </Button>
            <Button type='default' onClick={handleReset}>
              重置
            </Button>
          </Space>
        </Form.Item>
      </Form>
      <div className='base-table'>
        <div className='header-wrapper'>
          <div className='title'>菜单列表</div>
          <div className='action'>
            <Button type='primary' onClick={handleCreate}>
              新增
            </Button>
          </div>
        </div>
        <Table bordered rowKey='_id' columns={columns} dataSource={data} pagination={false} />
      </div>
      {/* update={getDeptList} 重新获取列表 */}
      <CreateMenu mRef={menuRef} update={getMuneList} />
    </div>
  )
}
