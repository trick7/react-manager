import api from '@/api'
import { User } from '@/types/api'
import { toLocalDate } from '@/utils'
import { Button, Form, Input, Modal, Select, Space, Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useRef, useState } from 'react'
import CreateUser from './CreateUser'
import { IAction } from '@/types/modal'
import { message } from '@/utils/AntdGlobal'
import { useAntdTable } from 'ahooks'
import AuthButton from '@/components/AuthButton'
export default function UserList() {
  //初始化form
  const [form] = Form.useForm()
  //用户列表数据
  // const [data, setData] = useState<User.UserItem[]>([])
  //分页数据（总条数）
  // const [total, setTotal] = useState(0)
  const [userIds, setUserIds] = useState<number[]>([])
  const userRef = useRef<{
    open: (type: IAction, data?: User.UserItem) => void
  }>()

  //分页变量
  // const [pagination, setPagination] = useState({
  //   current: 1, //当前页数
  //   pageSize: 10
  // })
  // useEffect(() => {
  //   getUserList({
  //     // 默认初始化的数据 第一页  一页10个数据
  //     pageNum: pagination.current,
  //     pageSize: pagination.pageSize
  //   })
  // }, [pagination.current, pagination.pageSize])

  /**
   *
   * @param current 总数
   * @param pageSize 每页数据
   * @param formData 表单数据 搜索用
   */
  const getTabeData = ({ current, pageSize }: { current: number; pageSize: number }, formData: User.Params) => {
    return api
      .getUserList({
        ...formData,
        pageNum: current,
        pageSize: pageSize
      })
      .then(data => {
        return {
          total: data.page.total,
          list: data.list
        }
      })
  }
  // search中自带搜索(submit)和重置(reset)  tableProps 是列表数据
  const { tableProps, search } = useAntdTable(getTabeData, {
    form,
    defaultPageSize: 10
  })
  //搜索
  const handleSearch = () => {
    search.submit()
    //点击搜索后默认跳转到筛选结果的第一页
    // getUserList({
    //   pageNum: 1
    // pageSize: pagination.pageSize
    // })
  }

  //重置表单
  const handleReset = () => {
    search.reset()
    //form自带的重置方法
    // form.resetFields()
  }
  //获取用户列表
  //params 分页参数
  // const getUserList = async (params: pageParams) => {
  //   //getFieldsValue获取表单中所有的值  点击搜索按钮的时候会触发更新values来完成搜索
  //   const values = form.getFieldsValue()
  //   console.log(values)
  //   const data = await api.getUserList({
  //     ...values,
  //     pageNum: params.pageNum,
  //     pageSize: params.pageSize || pagination.pageSize
  //   })
  //   //生成50条模拟数据
  //   // const list = Array.from({ length: 50 })
  //   //   .fill({})
  //   //   .map((item: any) => {
  //   //     item = { ...data.list[0] }
  //   //     item.userId = Math.random()
  //   //     return item
  //   //   })
  //   setData(data.list)
  //   setTotal(data.page.total)
  //   setPagination({
  //     current: data.page.pageNum,
  //     pageSize: data.page.pageSize
  //   })
  // }
  //创建用户
  const handeCreate = () => {
    userRef.current?.open('create')
  }
  //编辑用户 reaord值在编辑按钮处传递过来
  const handleEdit = (record: User.UserItem) => {
    userRef.current?.open('edit', record)
  }

  // 删除用户
  const handleDel = (userId: number) => {
    Modal.confirm({
      title: '确认',
      content: <span>确认删除该用户吗？</span>,
      onOk: async () => {
        handelUserSubmit([userId])
      }
    })
  }
  //批量删除
  const handlePatchConfirm = () => {
    if (userIds.length === 0) {
      message.error('请选择要删除的用户')
      return
    }
    Modal.confirm({
      title: '确认',
      content: <span>确认删除该批量用户吗？</span>,
      onOk: async () => {
        handelUserSubmit(userIds)
      }
    })
  }
  //公共删除用户接口
  const handelUserSubmit = async (ids: number[]) => {
    try {
      await api.deleteUser({
        userIds: ids
      })
      message.success('删除成功')
      setUserIds([])
      search.reset()
      // getUserList({
      //   pageNum: 1
      //   // pageSize: pagination.pageSize
      // })
    } catch (error) {
      console.log('报错')
    }
  }

  const columns: ColumnsType<User.UserItem> = [
    {
      title: '用户ID',
      dataIndex: 'userId',
      key: 'userId'
    },
    {
      title: '用户名称',
      dataIndex: 'userName',
      key: 'userName'
    },
    {
      title: '用户邮箱',
      dataIndex: 'userEmail',
      key: 'userEmail'
    },
    {
      title: '用户角色',
      dataIndex: 'role',
      key: 'role',
      render(role: number) {
        return {
          0: '超级管理员',
          1: '管理员',
          2: '体验管理员',
          3: '普通用户'
        }[role]
      }
    },
    {
      title: '用户状态',
      dataIndex: 'state',
      key: 'state',
      render(state: number) {
        return {
          1: '在职',
          2: '离职',
          3: '试用期'
        }[state]
      }
    },
    {
      title: '注册时间',
      dataIndex: 'crateTime',
      key: 'crateTime',
      render(createTime: string) {
        return toLocalDate(createTime)
      }
    },
    {
      title: '操作',
      // dataIndex: 'address',
      key: 'address',
      //第一个参数是当前列的值 第二个是当前行的值 没有dataIndex属性第一个参数就不是当前列的值是当前行的值
      render(record: User.UserItem) {
        return (
          <Space>
            <AuthButton auth='user@create' type='text' onClick={() => handleEdit(record)}>
              编辑
            </AuthButton>
            <Button type='text' danger onClick={() => handleDel(record.userId)}>
              删除
            </Button>
          </Space>
        )
      }
    }
  ]

  return (
    <div className='user-list'>
      <Form className='serch-form' form={form} layout='inline' initialValues={{ state: 1 }}>
        <Form.Item name='userId' label='用户ID'>
          <Input placeholder='请输入用户ID' />
        </Form.Item>
        <Form.Item name='userName' label='用户名称'>
          <Input placeholder='请输入用户名称' />
        </Form.Item>
        <Form.Item name='state' label='状态'>
          <Select style={{ width: '120px' }}>
            <Select.Option value={0}>所有</Select.Option>
            <Select.Option value={1}>在职</Select.Option>
            <Select.Option value={2}>离职</Select.Option>
            <Select.Option value={3}>试用期</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Space>
            <Button type='primary' onClick={handleSearch}>
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
          <div className='title'>用户列表</div>
          <div className='action'>
            <Button type='primary' onClick={handeCreate}>
              新增
            </Button>
            <Button type='primary' danger onClick={handlePatchConfirm}>
              批量删除
            </Button>
          </div>
        </div>
        {/* rowSelection={{ type: 'checkbox' }} 选择框 */}
        <Table
          bordered
          rowKey='userId'
          // 全选 checkbox | 单选 radio
          rowSelection={{
            type: 'checkbox',
            // 通过selectedRowKeys 将其变为受控组件
            selectedRowKeys: userIds,
            onChange: (selectedRowKeys: React.Key[]) => {
              setUserIds(selectedRowKeys as number[])
            }
          }}
          // dataSource={data}
          columns={columns}
          {...tableProps}
          // pagination={{
          //   //分页框位置
          //   position: ['bottomRight'],
          //   //当前页码
          //   current: pagination.current,
          //   //分页条数
          //   pageSize: pagination.pageSize,
          //   //总条数   key和value一样可以省略 total   ===  total:total
          //   total,
          //   //是否跳转
          //   showQuickJumper: true,
          //   //显示页码切换器
          //   showSizeChanger: true,
          //   //显示总条数
          //   showTotal: function (total) {
          //     return `总共:${total}条`
          //   },
          //   onChange: (page, pageSize) => {
          //     setPagination({
          //       current: page,
          //       pageSize
          //     })
          //   }
          // }}
        />
      </div>
      <CreateUser
        mRef={userRef}
        update={() => {
          // getUserList({
          //   pageNum: 1,
          //   pageSize: pagination.pageSize
          // })
          search.reset()
        }}
      />
    </div>
  )
}
