import googleLogo from './assets/google_logo.jpg'
import { Card, Layout, Typography } from 'antd'
const { Content } = Layout
const { Title, Text } = Typography

export const Login = () => {
  return (
    <Content className='log-in'>
      <Card className='log-in-card'>
        <div className='log-in-card__intro'>
          <Title className='log-in-card__intro-title' level={3}>
            <span role='img' aria-label='wave'>
              👋
            </span>
          </Title>
          <Title className='log-in-card__intro-title' level={3}>
            Log in to Nomad Travels 🌏
          </Title>
          <Text>Sign in with Google to start booking available rentals!</Text>
          <button className='log-in-card__google-button'>
            <img
              src={googleLogo}
              alt='Google Logo'
              className='log-in-card__google-button-logo'
            />
            <span className='log-in-card__google-button-text'>
              Sign in with Google!
            </span>
          </button>
          <Text type='secondary'>
            Note: By signing in, you'll be redirected to the Google consent form
            to sign in with your Google account.
          </Text>
        </div>
      </Card>
    </Content>
  )
}
