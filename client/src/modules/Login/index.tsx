import googleLogo from './assets/google_logo.jpg'
import { useApolloClient, useMutation } from '@apollo/client'
import { Card, Layout, Spin, Typography } from 'antd'
import { Viewer } from '../../lib/types'
import { AUTH_URL } from '../../lib/graphql/queries'
import { AuthUrl as AuthUrlData } from '../../lib/graphql/queries/AuthUrl/__generated__/AuthUrl'
import { LOG_IN } from '../../lib/graphql/mutations'
import { useEffect, useRef } from 'react'
import {
  LogIn as LogInData,
  LogInVariables,
} from '../../lib/graphql/mutations/LogIn/__generated__/LogIn'
import {
  displayErrorMessage,
  displaySuccessNotification,
} from '../../lib/utils'
import { ErrorBanner } from '../../lib/components'
import { Redirect } from 'react-router-dom'
import { useScrollToTop } from '../../lib/hooks'
const { Content } = Layout
const { Title, Text } = Typography

interface Props {
  setViewer: (viewer: Viewer) => void
}

export const Login = ({ setViewer }: Props) => {
  useScrollToTop()

  const client = useApolloClient()

  const [logIn, { data: logInData, loading: logInLoading, error: logInError }] =
    useMutation<LogInData, LogInVariables>(LOG_IN, {
      onCompleted: (data) => {
        if (data && data.logIn && data.logIn.token) {
          setViewer(data.logIn)
          sessionStorage.setItem('token', data.logIn.token)
          displaySuccessNotification('Log In Successful 🎉')
        }
      },
    })

  const logInRef = useRef(logIn)

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get('code')

    if (code) {
      logInRef.current({
        variables: { input: { code } },
      })
    }
  }, [])

  const HandleAuthorization = async () => {
    try {
      const { data } = await client.query<AuthUrlData>({ query: AUTH_URL })

      window.location.href = data.authUrl
    } catch {
      displayErrorMessage(
        "Sorry! We couldn't log you in. Please try again later!"
      )
    }
  }

  if (logInLoading) {
    return (
      <Content className='log-in'>
        <Spin size='large' tip='Logging you in...' />
      </Content>
    )
  }

  if (logInData && logInData.logIn) {
    const { id: viewerId } = logInData.logIn
    return <Redirect to={`/user/${viewerId}`} />
  }

  const logInErrorBanner = logInError ? (
    <ErrorBanner description="Sorry! We couldn't log you in. Please try again later!" />
  ) : null

  return (
    <Content className='log-in'>
      {logInErrorBanner}
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
          <button
            className='log-in-card__google-button'
            onClick={HandleAuthorization}>
            <img
              src={googleLogo}
              alt='Google Logo'
              className='log-in-card__google-button-logo'
            />
            <span className='log-in-card__google-button-text'>
              Sign in with Google
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
