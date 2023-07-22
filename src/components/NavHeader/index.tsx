import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'
import { Breadcrumb, Dropdown, Switch } from 'antd'
import type { MenuProps } from 'antd'
import styles from './index.module.less'
import useBearStore from '@/store'
import storage from '@/utils/storage'
const NavHeader = () => {
  // const userInfo = useBearStore(state => state.userInfo)
  // const collapsed = useBearStore(state => state.collapsed)
  const { userInfo, collapsed, updateCollapsed } = useBearStore()
  console.log(collapsed)

  const breadList = [
    {
      title: '首页'
    },
    {
      title: '工作台'
    }
  ]
  const items: MenuProps['items'] = [
    {
      key: 'email',
      label: '邮箱: ' + userInfo.userEmail
    },
    {
      key: 'logout',
      label: '退出'
    }
  ]
  const onClick: MenuProps['onClick'] = ({ key }) => {
    if (key === 'logout') {
      storage.remove('token')
      //encodeURIComponent将url编码
      location.href = '/login?callback=' + encodeURIComponent(location.href)
    }
  }
  //控制菜单图标关闭和展开
  const toggleCollapsed = () => {
    updateCollapsed(collapsed)
  }
  return (
    <div className={styles.navHeader}>
      <div className={styles.left}>
        <div onClick={toggleCollapsed}>{collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}</div>
        <Breadcrumb items={breadList} style={{ marginLeft: 10 }} />
      </div>
      <div id='right'>
        <Switch checkedChildren='暗黑' unCheckedChildren='默认' style={{ marginRight: 10 }} />
        <Dropdown menu={{ items, onClick }} trigger={['click']}>
          <span className={styles.nickName}>{userInfo.userName}</span>
        </Dropdown>
      </div>
    </div>
  )
}

export default NavHeader
