import { Layout, Typography } from 'antd'

const { Content } = Layout
const { Text, Title } = Typography

export const Host = () => {
  return (
    <Content className='host-content'>
      <div className='host__form-header'>
        <Title level={3} className='host__form-title'>
          Let's get started listing your place!
        </Title>
        <Text type='secondary'>
          In this form, we will collect some basic and additional information
          about your listing.
        </Text>
      </div>
    </Content>
  )
}

export default Host
