import { Form, Input, Modal, Select, Upload } from 'antd'
import { useImperativeHandle, useState } from 'react'
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import storage from '@/utils/storage'
import type { UploadChangeParam } from 'antd/es/upload'
import type { RcFile, UploadProps, UploadFile } from 'antd/es/upload/interface'
import { message } from '@/utils/AntdGlobal'
import { IAction, IModalProp } from '@/types/modal'
import { User } from '@/types/api'
import api from '@/api'
export default function CreateUser(props: IModalProp) {
  const [form] = Form.useForm()
  //弹窗开启与关闭
  const [visible, setVisible] = useState(false)
  const [action, setAction] = useState<IAction>('create')
  const [img, setImg] = useState('')
  const [loading, setLoading] = useState(false)
  //暴露子组件open方法
  useImperativeHandle(props.mRef, () => {
    return {
      open
    }
  })
  //调用弹框显示方法
  const open = (type: IAction, data?: User.UserItem) => {
    setAction(type)
    setVisible(true)
    if (type === 'edit' && data) {
      //setFieldsValue 设置表单的值
      form.setFieldsValue(data)
      setImg(data.userImg)
    }
  }
  //验证
  const handleSubmit = async () => {
    // validateFields 触发表单验证
    const valid = await form.validateFields()
    console.log(valid)
    if (valid) {
      const params = {
        //表单中的所有值
        ...form.getFieldsValue(),
        //单独保存的头像
        userImg: img
      }
      if (action === 'create') {
        await api.CreateUser(params)
        //success 成功
        message.success('创建成功')
      } else if (action === 'edit') {
        await api.editUser(params)
        message.success('修改成功')
      }
      handleCancel()
      props.update()
    }
  }
  const handleCancel = () => {
    //创建成功后关闭表单
    setVisible(false)
    //清空头像
    setImg('')
    //重置表单
    form.resetFields()
  }
  /**
   * 在文件上传之前进行验证。
   * @param file 需要验证的文件对象。
   * @returns 返回一个布尔值，表示文件是否符合要求。
   *
   * 此函数用于在用户上传图片之前检查图片的类型和大小是否符合规定。
   * 它首先检查图片类型是否为JPEG或PNG，如果不是，则显示错误消息并阻止上传。
   * 接着检查图片大小是否小于500KB，如果大于500KB，则显示错误消息。
   * 最后，函数返回一个布尔值，指示文件是否同时满足类型和大小的要求。
   */
  //上传之前的接口处理
  const beforeUpload = (file: RcFile) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
    if (!isJpgOrPng) {
      message.error('图片类型必须是JPG或PNG ')
      //return 防止2个提升同时触发
      return false
    }
    // 0.5表示500k
    const isLt500k = file.size / 1024 / 1024 < 0.5
    if (!isLt500k) {
      message.error('图片大小不能大于500k')
    }
    return isJpgOrPng && isLt500k
  }
  /**
   * 处理文件上传的变化事件。
   *
   * 此函数是上传组件的onChange处理器，负责处理上传过程中的各种状态，如上传中、上传成功和上传失败。
   * @param info 上传文件的变化参数，包含文件的状态和响应信息。
   */
  //上传后图片处理
  const handleChange: UploadProps['onChange'] = (info: UploadChangeParam<UploadFile>) => {
    // 当文件处于上传中状态时，设置加载状态为true，提升用户体验
    //上传中
    if (info.file.status === 'uploading') {
      setLoading(true)
      return
    }
    // 当文件上传成功时，处理上传结果
    //上传完成
    if (info.file.status === 'done') {
      setLoading(false)
      // 解析上传成功的文件响应，通常包含处理后的文件URL或其他必要信息
      const { code, data, msg } = info.file.response
      // 根据响应码判断上传是否成功，成功则更新图片URL，失败则显示错误消息
      if (code === 0) {
        setImg(data.file)
      } else {
        message.error(msg)
      }
    } else if (info.file.status === 'error') {
      // 当文件上传失败时，显示错误消息
      message.error('服务器异常请稍后重试')
    }
  }
  return (
    <Modal
      title={action === 'create' ? '创建用户' : '编辑用户'}
      okText='确定'
      cancelText='取消 '
      width={800}
      open={visible}
      onOk={handleSubmit}
      onCancel={handleCancel}
    >
      <Form form={form} labelCol={{ span: 4 }} labelAlign='right'>
        {/*
         name表单名称，会作为表单字段 id 前缀使用
         rules校验规则，设置字段的校验逻辑
        */}
        {/* hidden 添加后就不显示 因为修改必须要userId可是我们页面不显示就可以通过这种方法添加隐藏域 */}
        <Form.Item name='userId' hidden>
          <Input />
        </Form.Item>
        <Form.Item
          label='用户名称'
          name='userName'
          rules={[
            { required: true, message: '请输入用户名称' },
            { min: 5, max: 12, message: '用户名称必须在5-12个字符之间' }
          ]}
        >
          <Input placeholder='请输入用户名称'></Input>
        </Form.Item>
        <Form.Item
          label='用户邮箱'
          name='userEmail'
          rules={[
            { required: true, message: '请输入用户邮箱' },
            { type: 'email', message: '请输入正确邮箱' }
            // /^\w+@mars.com$/,字母数字开头 +表示多个数字字母  @mars.com结尾
            // { pattern: /^\w+@mars.com$/, message: '邮箱必须以@mars.com结尾' }
          ]}
        >
          {/* disabled={action === 'edit'}  如果是编辑的话影响不能更改 */}
          <Input placeholder='请输入用户邮箱' disabled={action === 'edit'}></Input>
        </Form.Item>
        <Form.Item
          label='手机号'
          name='mobile'
          rules={[
            { len: 11, message: '请输入11位手机号' },
            // /1[1-9]\d{9}/  第一个字必须是1 第二个数字为1-9之间任意数字  最后9位数为任意数字
            { pattern: /1[1-9]\d{9}/, message: '请输入正确格式的手机号' }
          ]}
        >
          <Input type='number' placeholder='请输入手机号'></Input>
        </Form.Item>
        <Form.Item label='部门' name='deptId'>
          <Input placeholder='请输入部门'></Input>
        </Form.Item>
        <Form.Item label='岗位' name='job'>
          <Input placeholder='请输入岗位'></Input>
        </Form.Item>
        <Form.Item label='状态' name='state'>
          <Select>
            <Select.Option value={1}>在职</Select.Option>
            <Select.Option value={2}>离职</Select.Option>
            <Select.Option value={3}>试用期</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label='系统角色' name='roleList'>
          <Input placeholder='请输入角色'></Input>
        </Form.Item>
        <Form.Item label='用户头像'>
          {/* listType 上传文件的类型  showUploadLis是否展示文件列表，默认是true*/}
          <Upload
            listType='picture-circle'
            showUploadList={false}
            headers={{
              Authorization: 'Bearer ' + storage.get('token'),
              icode: 'B6052FAD1255B95F'
            }}
            // 接口上传地址
            action='/api/users/upload'
            //上传之前的接口处理
            beforeUpload={beforeUpload}
            //上传后图片处理
            onChange={handleChange}
          >
            {img ? (
              <img src={img} style={{ width: '100%', borderRadius: '100%' }} />
            ) : (
              // 用div 包裹2个元素 使他变成一个元素 就会在页面上上下显示
              <div>
                {loading ? <LoadingOutlined /> : <PlusOutlined />}
                <div style={{ marginTop: 5 }}>上传头像</div>
              </div>
            )}
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  )
}
