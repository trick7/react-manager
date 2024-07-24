import { Suspense } from "react"
import { Spin } from "antd";

/**
 * 组件懒加载，结合Suspense实现
 * @param Component 组件对象
 * @returns 返回新组件
 */
export const LazyLoad = (Component: React.LazyExoticComponent<() => JSX.Element>): React.ReactNode => {
  return <Suspense fallback={<Spin style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }} />}>
    <Component />
  </Suspense>
}
