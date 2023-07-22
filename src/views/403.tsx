import { Result, Button } from 'antd'
import { useNavigate } from 'react-router-dom'
function NotFound() {
  const navigate = useNavigate()
  const handleClick = () => {
    navigate('/')
  }
  return (
    <Result
      status={403}
      title='404'
      subTitle='抱歉，您的权限不够'
      extra={
        <Button type='primary' onClick={handleClick}>
          回首页
        </Button>
      }
    />
  )
}
export default NotFound
