import { Layout, Typography, Empty } from 'antd'
import { Link } from 'react-router-dom'
import { useScrollToTop } from '../../lib/hooks'

const { Content } = Layout
const { Text } = Typography

export const NotFound = () => {
  useScrollToTop()

  return (
    <Content className='not-found'>
      <Empty
        description={
          <>
            <Text className='not-found__description-title'>
              Uh Oh! Something went wrong 😕
            </Text>
            <Text className='not-found__description-subtitle'>
              The page you are looking for can't be found.
            </Text>
          </>
        }
      />

      <Link
        to='/'
        className='not-found__cta ant-btn ant-btn-primary ant-btn-lg'>
        Go to Home
      </Link>
    </Content>
  )
}
