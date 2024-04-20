import { IAuthLoader } from '@/router/AuthLoader'
import { useBearStore } from '@/store'
import { Button } from 'antd'
import { useRouteLoaderData } from 'react-router-dom'

export default function AuthButton(props: any) {
  const data = useRouteLoaderData('layout') as IAuthLoader
  const role = useBearStore(state => state.userInfo.role)
  //如果 AuthButton 组件的 props 中没有 auth 属性，那么组件将直接渲染一个普通的 Button 组件，
  if (!props.auth) return <Button {...props}>{props.children}</Button>
  /**
   * 如果 data.buttonList（从 useRouteLoaderData 获取的数据中）包含了 props.auth 所指定的权限字符串，
   * 或者当前用户的角色（role）是1那么组件将渲染一个 Button 组件。否则，它将渲染一个空元素（<></>）
   */
  if (data.buttonList.includes(props.auth) || role === 1) {
    return <Button {...props}>{props.children}</Button>
  } else return <></>
}
