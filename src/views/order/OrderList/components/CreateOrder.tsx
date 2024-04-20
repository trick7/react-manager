import { IModalProp } from '@/types/modal'
import { Modal, Form, Row, Col, Select, Input, DatePicker } from 'antd'
import { useEffect, useImperativeHandle, useState } from 'react'
import api from '@/api/orderApi'
import { Order } from '@/types/api'
import { message } from '@/utils/AntdGlobal'
export default function CreateOrder(props: IModalProp) {
  //控制弹窗显示
  const [visible, setVisible] = useState(false)
  const [form] = Form.useForm()
  const [cityList, setCityList] = useState<Order.DictItem[]>([])
  const [vehicleList, setVehicleList] = useState<Order.DictItem[]>([])
  useEffect(() => {
    getInitData()
  }, [])
  //初始化城市列表和车型列表
  const getInitData = async () => {
    const cityList = await api.getCityList()
    const vehicleList = await api.getVehicleList()
    setCityList(cityList)
    setVehicleList(vehicleList)
  }
  //允许父组件通过 ref 访问子组件的实例上暴露给父组件的特定方法。
  useImperativeHandle(props.mRef, () => {
    return {
      open
    }
  })
  //打开弹窗
  const open = () => {
    setVisible(true)
  }
  //创建订单提交
  const handleOk = async () => {
    //验证字段是否填写
    const valid = await form.validateFields()
    if (valid) {
      await api.createOrder(form.getFieldsValue())
      message.success('创建成功')
      handleCancel()
      props.update() //更新父组件
    }
  }
  //关闭弹窗
  const handleCancel = () => {
    form.resetFields() //重置表单
    setVisible(false)
  }
  return (
    <Modal
      title='创建订单'
      width={800}
      open={visible}
      okText='确定'
      cancelText='取消'
      onOk={handleOk}
      onCancel={handleCancel}
    >
      {/* layout='horizontal'设置表单的布局方式,水平布局
          labelAlign='right' 设置标签的对齐方式。右对齐
          labelCol={{ span: 8 }} 用于配置标签的栅格布局。 表示标签会占据栅格系统中 8 个单位的空间。
          wrapperCol={{ span: 16 }} 另一个对象，用于配置输入内容（如输入框、选择器等）的栅格布局。
      */}
      <Form form={form} layout='horizontal' labelAlign='right' labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
        {/* 设置一行两列 */}
        <Row>
          <Col span={12}>
            <Form.Item name='cityName' label='城市名称' rules={[{ required: true, message: '请选择城市名称' }]}>
              <Select placeholder='请选择城市名称'>
                {cityList.map(item => {
                  return (
                    <Select.Option value={item.name} key={item.id}>
                      {item.name}
                    </Select.Option>
                  )
                })}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name='vehicleName' label='车型名称' rules={[{ required: true, message: '请选择车型' }]}>
              <Select placeholder='请选择车型名称'>
                {vehicleList.map(item => {
                  return (
                    <Select.Option value={item.name} key={item.id}>
                      {item.name}
                    </Select.Option>
                  )
                })}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Form.Item name='userName' label='用户名称' rules={[{ required: true, message: '请输入用户名称' }]}>
              <Input placeholder='请输入用户名称' />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name='mobile' label='手机号'>
              <Input placeholder='请输入下单手机号' />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Form.Item name='startAddress' label='起始地址'>
              <Input placeholder='请输入起始地址' />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name='endAddress' label='结束地址'>
              <Input placeholder='请输入结束地址' />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Form.Item name='orderAmount' label='下单金额' rules={[{ required: true, message: '请输入下单金额' }]}>
              <Input type='number' placeholder='请输入下单金额' />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name='userPayAmount' label='支付金额' rules={[{ required: true, message: '请输入支付金额' }]}>
              <Input type='number' placeholder='请输入支付金额' />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Form.Item name='driverName' label='司机名称' rules={[{ required: true, message: '请输入司机名称' }]}>
              <Input placeholder='请输入司机名称' />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name='driverAmount' label='司机金额' rules={[{ required: true, message: '请输入司机金额' }]}>
              <Input type='number' placeholder='请输入司机金额' />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Form.Item name='payType' label='支付方式'>
              <Select placeholder='请选择支付方式'>
                <Select.Option value={1}>微信</Select.Option>
                <Select.Option value={2}>支付宝</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name='state' label='订单状态'>
              <Select placeholder='请选择订单状态'>
                <Select.Option value={1}>进行中</Select.Option>
                <Select.Option value={2}>已完成</Select.Option>
                <Select.Option value={3}>超时</Select.Option>
                <Select.Option value={4}>取消</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <Form.Item name='useTime' label='用车时间'>
              <DatePicker />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name='endTime' label='结束时间'>
              <DatePicker />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}
