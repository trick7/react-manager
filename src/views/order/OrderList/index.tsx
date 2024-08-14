import api from '@/api/orderApi'
import { Order } from '@/types/api'
import { useAntdTable } from 'ahooks'
import { Button, Form, Input, Modal, Select, Space, Table, message } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { useRef } from 'react'
// import CreateOrder from './components/CreateOrder'
import CreateOrder from './components/CreateOrderNEW'
import OrderDetail from './components/OrderDetail'
import { formatDate, formatMoney } from '@/utils'
import OrderMarker from './components/OrderMarker'
import OrderRoute from './components/OrderRoute'

export default function OrderList() {
  const [form] = Form.useForm()
  const orderRef = useRef<{ open: () => void }>()//创建订单
  const detailrRef = useRef<{ open: (orderId: string) => void }>()//订单详情
  const markerRef = useRef<{ open: (orderId: string) => void }>()//订单打点
  const routeRef = useRef<{ open: (orderId: string) => void }>()//订单轨迹
  const getTableData = ({ current, pageSize }: { current: number; pageSize: number }, formData: Order.SearchParams) => {
    return api
      .getOrderList({
        ...formData,//搜索条件
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
  // 获取表格数据
  //tableProps是封装了分页、搜索、排序等操作的Props。
  const { tableProps, search } = useAntdTable(getTableData, {
    // 分页参数 订单状态默认显示state为1的参数
    defaultParams: [{ current: 1, pageSize: 10 }, { state: 1 }],
    form
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
            <Button type='text' onClick={() => handleMarker(record.orderId)}>打点</Button>
            <Button type='text' onClick={() => handleRoute(record.orderId)}>轨迹</Button>
            <Button type='text' danger onClick={() => handledel(record._id)}>删除</Button>
          </Space>
        )
      }
    }
  ]

  //创建订单
  const handleCreate = () => {
    orderRef.current?.open()
  }
  //订单详情
  const handleDetail = (orderId: string) => {
    detailrRef.current?.open(orderId)
  }
  //订单打点
  const handleMarker = (orderId: string) => {
    markerRef.current?.open(orderId)
  }
  //行驶轨迹
  const handleRoute = (orderId: string) => {
    routeRef.current?.open(orderId)
  }
  //删除确认
  const handledel = (_Id: string) => {
    Modal.confirm({
      title: '确认',
      content: <span>确认删除订单吗</span>,
      onOk: async () => {
        await api.delOrder(_Id)
        message.success('删除成功')
        search.submit()//刷新表格
      }
    })
  }
  //文件导出
  const handleExport = () => {
    api.exprotData(form.getFieldsValue())
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
            <Button type='primary' onClick={handleCreate}>
              新增
            </Button>
            <Button type='primary' onClick={handleExport}>
              导出
            </Button>
          </div>
        </div>
        {/* rowSelection={{ type: 'checkbox' }} 选择框 */}
        <Table bordered rowKey='_id' columns={columns} {...tableProps} />
      </div>
      {/* 创建订单组件 */}
      <CreateOrder mRef={orderRef} update={search.submit} />
      {/* 订单详情 */}
      <OrderDetail mRef={detailrRef} />
      {/* 地图打点*/}
      <OrderMarker mRef={markerRef} />
      {/* 行驶轨迹 */}
      <OrderRoute mRef={routeRef} />
    </div>
  )
}
