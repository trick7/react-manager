import { IModalProp } from '@/types/modal'
import { Modal } from 'antd'
import { useEffect, useImperativeHandle, useState } from 'react'
import api from '@/api/orderApi'
import { Order } from '@/types/api'
import { message } from '@/utils/AntdGlobal'
import FormRender, { useForm } from 'form-render'
export default function CreateOrder(props: IModalProp) {
  //控制弹窗显示
  const [visible, setVisible] = useState(false)//弹窗显示
  const form = useForm()//表单

  //初始化城市列表和车型列表
  const getInitData = async () => {
    const cityList = await api.getCityList()
    const vehicleList = await api.getVehicleList()

    form.setSchema({
      cityName: {
        props: {
          options: cityList.map(item => ({ label: item.name, value: item.name }))
        }
      },
      vehicleName: {
        props: {
          options: vehicleList.map(item => ({ label: item.name, value: item.name }))
        }
      }
    })
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
  /**
   * 处理订单创建的确认操作。
   *
   * 该函数被调用时，将执行表单验证，如果验证成功，则创建订单，并显示成功消息。
   * 最后，它会调用取消操作和更新父组件的状态。
   */
  // 创建订单提交
  const handleOk = async () => {
    // 验证表单字段是否符合要求
    // 验证字段是否填写
    const valid = await form.validateFields()
    if (valid) {
      // 如果表单验证成功，调用接口创建订单
      await api.createOrder(form.getValues())
      // 显示创建成功的消息
      message.success('创建成功')
      // 调用取消操作，关闭当前窗口或回到上一状态
      handleCancel()
      // 更新父组件的状态，可能是刷新数据列表等操作
      props.update() // 更新父组件
    }
  }
  const schema = {
    type: 'object',
    displayType: 'row',
    column: 2,
    labelWidth: 120,
    properties: {
      cityName: {
        title: '城市名称',
        type: 'string',
        widget: 'select',
        rules: [{ required: true, message: '请选择城市名称' }]
      },
      vehicleName: {
        title: '车型',
        type: 'string',
        widget: 'select',
        rules: [{ required: true, message: '请选择车型' }]
      },
      userName: {
        title: '用户名称',
        type: 'string',
        widget: 'input',
        required: true,
        placeholder: '请输入用户名称'
      },
      mobile: {
        title: '手机号',
        type: 'string',
        widget: 'inputNumber',//控制输入数字
        placeholder: '请输入手机号',
        rules: [{ pattern: /^1[1-9]\d{9}$/, message: '请输入正确的手机号' }]
      },
      startAddress: {
        title: '起始地址',
        type: 'string',
        widget: 'input',
        placeholder: '请输入起始地址'
      },
      endAddress: {
        title: '结束地址',
        type: 'string',
        widget: 'input',
        placeholder: '请输入下单金额'
      },
      orderAmount: {
        title: '下单金额',
        type: 'number',
        widget: 'inputNumber',
        required: true,
        placeholder: '请输入结束地址'
      },
      userPayAmount: {
        title: '支付金额',
        type: 'number',
        widget: 'inputNumber',
        required: true,
        placeholder: '请输入支付金额'
      },
      driverName: {
        title: '司机名称',
        type: 'string',
        widget: 'input',
        required: true,
        placeholder: '请输入司机名称'
      },
      driverAmount: {
        title: '司机金额',
        type: 'number',
        widget: 'inputNumber',
        required: true,
        placeholder: '请输入司机金额'
      },
      payType: {
        title: '支付方式',
        type: 'number',
        widget: 'select',
        placeholder: '请输入司机金额',
        props: {
          options: [
            { label: '微信', value: 1 },
            { label: '支付宝', value: 2 }
          ]
        }
      },
      state: {
        title: '订单状态',
        type: 'number',
        widget: 'select',
        placeholder: '请选择订单状态',
        props: {
          options: [
            { label: '进行中', value: 1 },
            { label: '已完成', value: 2 },
            { label: '超时', value: 3 },
            { label: '取消', value: 4 }
          ]
        }
      },
      useTime: {
        title: '用车时间',
        type: 'string',
        widget: 'datePicker',
      },
      endTime: {
        title: '结束时间',
        type: 'string',
        widget: 'datePicker',
      }
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
      <FormRender form={form} schema={schema} onMount={getInitData} />
    </Modal>
  )
}
