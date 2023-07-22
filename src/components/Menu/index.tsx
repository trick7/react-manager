import { Menu } from 'antd'
import { DesktopOutlined, SettingOutlined, TeamOutlined } from '@ant-design/icons'
import styles from './index.module.css'
import { useNavigate } from 'react-router-dom'
import useBearStore from '@/store'

const SidMenu = () => {
  const navgate = useNavigate()
  const { collapsed } = useBearStore()
  const items = [
    {
      label: '工作台',
      key: '1',
      icon: <DesktopOutlined />
    },
    {
      label: '系统管理',
      key: '2',
      icon: <SettingOutlined />,
      children: [
        {
          label: '用户管理',
          key: '3',
          icon: <TeamOutlined />
        }
      ]
    }
  ]
  const handleClickLogo = () => {
    navgate('/welcome')
  }
  return (
    <div>
      <div className={styles.logo} onClick={handleClickLogo}>
        <img src='/img/logo.png' alt='' className={styles.img} />
        {collapsed ? '' : <span>同性交易</span>}
      </div>
      <Menu
        defaultSelectedKeys={['1']}
        mode='inline'
        theme='dark'
        // style={{
        //   width: collapsed ? 80 : 'auto'
        // }}
        items={items}
      />
    </div>
  )
}

export default SidMenu
