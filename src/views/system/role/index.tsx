import api from '@/api/roleApi'
import { Role } from '@/types/api'
import { formatDate } from '@/utils'
import { useAntdTable } from 'ahooks'
import { Button, Form, Input, Space, Table, message } from 'antd'
import { useForm } from 'antd/es/form/Form'
import CreateRole from './CreateRole'
import SetPrmissiion from './setPrmissiion'
import { useRef } from 'react'
import { IAction } from '@/types/modal'
import { ColumnsType } from 'antd/es/table'
import { modal } from '@/utils/AntdGlobal'

export default function RoleList() {
  const [form] = useForm()
  const roleRef = useRef<{
    open: (type: IAction, data?: Role.RoleItem) => void
  }>()
  // 角色的ref
  const pormissionRef = useRef<{
    open: (type: IAction, data?: Role.RoleItem) => void
  }>()
  /**
   * 获取表格数据
   *
   * 该函数用于从API获取角色列表数据，为前端表格展示提供数据支持
   * 它根据分页信息和搜索条件获取相应数据，并将其格式化为表格组件所需的格式
   *
   * @param {Object} params - 包含当前页码和页面大小的对象
   * @param {number} params.current - 当前页码
   * @param {number} params.pageSize - 页面大小
   * @param {Role.Params} formData - 搜索表单数据，作为查询参数的一部分用于过滤结果
   * @returns {Promise<Object>} 返回一个Promise对象，包含总记录数和数据列表
   */
  const getTabeData = ({ current, pageSize }: { current: number; pageSize: number }, formData: Role.Params) => {
    return api
      .getRoleList({
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
  const { tableProps, search } = useAntdTable(getTabeData, { form })

  const columns: ColumnsType<Role.RoleItem> = [
    {
      title: '角色名称',
      dataIndex: 'roleName',
      key: 'roleName'
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark'
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
      render(updateTime: string) {
        return formatDate(updateTime)
      }
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      render(createTime: string) {
        return formatDate(createTime)
      }
    },
    {
      title: '操作',
      key: 'action',
      render(_id, record) {
        return (
          <Space>
            <Button type='text' onClick={() => handleEdit(record)}>
              编辑
            </Button>
            <Button type='text' onClick={() => handleSetPermission(record)}>
              设置权限
            </Button>
            <Button type='text' danger onClick={() => handelDelete(record._id)}>
              删除
            </Button>
          </Space>
        )
      }
    }
  ]
  //创建
  const handleCreate = () => {
    roleRef.current?.open('create')
  }
  //编辑
  const handleEdit = (data: Role.RoleItem) => {
    roleRef.current?.open('edit', data)
  }
  //删除确认
  const handelDelete = (_id: string) => {
    modal.confirm({
      title: '确认删除',
      content: <span>确认删除该角色吗？</span>,
      async onOk() {
        await api.delRoleList({ _id })
        message.success('删除成功')
        search.submit()
      }
    })
  }
  // 设置权限
  const handleSetPermission = (record: Role.RoleItem) => {
    pormissionRef.current?.open('edit', record)
  }
  return (
    <div className='role-wrap'>
      <Form form={form} className='serch-form' layout='inline'>
        <Form.Item name='roleName' label='角色名称'>
          <Input placeholder='请输入角色名称' />
        </Form.Item>
        <Form.Item>
          <Space>
            {/* search.submit 提交 */}
            <Button type='primary' onClick={search.submit}>
              搜索
            </Button>
            {/* search.reset 重置 */}
            <Button type='default' onClick={search.reset}>
              重置
            </Button>
          </Space>
        </Form.Item>
      </Form>
      <div className='base-table'>
        {/*  */}
        <div className='header-wrapper'>
          <div className='title'>角色列表</div>
          <div className='action'>
            <Button type='primary' onClick={handleCreate}>
              新增
            </Button>
          </div>
        </div>
        {/* rowSelection={{ type: 'checkbox' }} 选择框 */}
        <Table bordered rowKey='_id' columns={columns} {...tableProps} />
      </div>
      {/* 创建角色组件弹窗 */}
      <CreateRole mRef={roleRef} update={search.submit} />
      {/* s设置权限 */}
      <SetPrmissiion mRef={pormissionRef} update={search.submit}></SetPrmissiion>
    </div>
  )
}
