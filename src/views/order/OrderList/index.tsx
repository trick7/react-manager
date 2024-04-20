import api from '@/api/orderApi'
import { Order, User } from '@/types/api'
import { useAntdTable } from 'ahooks'
import { Button, Form, Input, Select, Space, Table } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { useRef } from 'react'
import CreateOrder from './components/CreateOrder'
import OrderDetail from './components/OrderDetail'
import { formatDate, formatMoney } from '@/utils'

export default function OrderList() {
  const [form] = Form.useForm()
  const orderRef = useRef<{ open: () => void }>()
  const detailrRef = useRef<{ open: (orderId: string) => void }>()
  const getTabeData = ({ current, pageSize }: { current: number; pageSize: number }, formData: Order.SearchParams) => {
    return api
      .getOrderList({
        ...formData,
        pageNum: current,
        pageSize: pageSize
      })
      .then(data => {
        return {
          total: data.page.total, //获取总记录数。
          list: data.list // 获取当前页的数据列表。
        }
      })
  }
  const { tableProps, search } = useAntdTable(getTabeData, {
    form,
    // 分页参数 订单状态默认显示state为1的参数
    defaultParams: [{ current: 1, pageSize: 10 }, { state: 1 }]
  })

  const columns: ColumnsType<Order.OrderItem> = [
    {
      title: '订单编号',
      dataIndex: 'orderId',
      key: 'orderId'
    },
    {
      title: '城市',
      dataIndex: 'cityName',
      key: 'cityName'
    },
    {
      title: '下单地址',
      dataIndex: 'startAddress',
      key: 'startAddress',
      width: 160,
      render(_, record) {
        return (
          <div>
            <p>开始地址：{record.startAddress}</p>
            <p>结束地址：{record.endAddress}</p>
          </div>
        )
      }
    },
    {
      title: '下单时间',
      dataIndex: 'createTime',
      key: 'createTime',
      render(createTime) {
        return formatDate(createTime)
      }
    },
    {
      title: '订单价格',
      dataIndex: 'orderAmount',
      key: 'orderAmount',
      render(orderAmount) {
        return formatMoney(orderAmount)
      }
    },
    {
      title: '订单状态',
      dataIndex: 'state',
      key: 'state',
      render(state) {
        if (state === 1) return '进行中'
        if (state === 2) return '已完成'
        if (state === 3) return '超时'
        if (state === 4) return '取消'
      }
    },
    {
      title: '用户名称',
      dataIndex: 'userName',
      key: 'userName'
    },
    {
      title: '司机名称',
      dataIndex: 'driverName',
      key: 'driverName'
    },
    {
      title: '操作',
      key: 'action',
      render(_, record) {
        return (
          <Space>
            <Button type='text' onClick={() => handleDetail(record.orderId)}>
              详情
            </Button>
            <Button type='text'>打点</Button>
            <Button type='text'>轨迹</Button>
            <Button type='text' danger>
              删除
            </Button>
          </Space>
        )
      }
    }
  ]
  //创建订单
  const hadleCreate = () => {
    orderRef.current?.open()
  }
  //订单详情
  const handleDetail = (orderId: string) => {
    detailrRef.current?.open(orderId)
  }
  return (
    <div className='OrderList'>
      <Form className='serch-form' form={form} layout='inline'>
        <Form.Item name='orderId' label='订单ID'>
          <Input placeholder='请输入用户ID' />
        </Form.Item>
        <Form.Item name='userName' label='用户名称'>
          <Input placeholder='请输入用户名称' />
        </Form.Item>
        <Form.Item name='state' label='订单状态'>
          <Select style={{ width: '120px' }}>
            <Select.Option value={1}>进行中</Select.Option>
            <Select.Option value={2}>已完成</Select.Option>
            <Select.Option value={3}>超时</Select.Option>
            <Select.Option value={4}>取消</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Space>
            <Button type='primary' onClick={search.submit}>
              搜索
            </Button>
            <Button type='default' onClick={search.reset}>
              重置
            </Button>
          </Space>
        </Form.Item>
      </Form>
      <div className='base-table'>
        <div className='header-wrapper'>
          <div className='title'>用户列表</div>
          <div className='action'>
            <Button type='primary' onClick={hadleCreate}>
              新增
            </Button>
          </div>
        </div>
        {/* rowSelection={{ type: 'checkbox' }} 选择框 */}
        <Table bordered rowKey='_id' columns={columns} {...tableProps} />
      </div>
      {/* 创建订单组件 */}
      <CreateOrder mRef={orderRef} update={search.submit} />
      {/* 订单详情 */}
      <OrderDetail mRef={detailrRef}></OrderDetail>
    </div>
  )
}
