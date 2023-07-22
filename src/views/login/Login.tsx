import { useState } from 'react'
import styles from './index.module.less'
import { Button, Form, Input, message } from 'antd'
import api from '@/api'
import { Login } from '@/types/api'
import storage from '@/utils/storage'
import useBearStore from '@/store'
export default function LoginFc() {
  // const { message } = App.useApp()
  const updateToken = useBearStore(start => start.updateToken)
  const [loading, setLoading] = useState(false)
  const onFinish = async (values: Login.params) => {
    try {
      setLoading(true)
      const data = await api.login(values)
      setLoading(false)
      //登录成功记录token值
      storage.set('token', data)
      //通过zustand更新token值
      updateToken(data)
      message.success('登录成功')
      const params = new URLSearchParams(location.search)
      setTimeout(() => {
        //跳转到上一次登录的地址 如果没有 就到welcome
        location.href = params.get('callback') || '/welcome'
      })
    } catch (error) {
      setLoading(false)
    }
  }
  return (
    <div className={styles.login}>
      <div className={styles['login-wrapper']}>
        <div className={styles.title}>系统登录</div>
        <Form name='basic' initialValues={{ remember: true }} onFinish={onFinish} autoComplete='off'>
          <Form.Item
            // label='Username'
            name='userName'
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            // label='Password'
            name='userPwd'
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button type='primary' htmlType='submit' block loading={loading}>
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}
