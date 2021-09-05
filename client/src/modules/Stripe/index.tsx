import { useMutation } from '@apollo/client'
import { Layout, Spin } from 'antd'
import { useEffect, useRef } from 'react'
import { Redirect, RouteComponentProps } from 'react-router-dom'
import { CONNECT_STRIPE } from '../../lib/graphql/mutations'
import {
  ConnectStripe as ConnectStripeData,
  ConnectStripeVariables,
} from '../../lib/graphql/mutations/ConnectStripe/__generated__/ConnectStripe'
import { Viewer } from '../../lib/types'
import { displaySuccessNotification } from '../../lib/utils'

const { Content } = Layout

interface Props {
  viewer: Viewer
  setViewer: (viewer: Viewer) => void
}

export const Stripe = ({
  viewer,
  setViewer,
  history,
}: Props & RouteComponentProps) => {
  const [connectStripe, { loading, data, error }] = useMutation<
    ConnectStripeData,
    ConnectStripeVariables
  >(CONNECT_STRIPE, {
    onCompleted: (data) => {
      if (data && data.connectStripe) {
        setViewer({ ...viewer, hasWallet: data.connectStripe.hasWallet })
        displaySuccessNotification(
          "You've successfully connected to your stripe account!, You can now start to create listings on the host page!"
        )
      }
    },
  })
  const connectStripeRef = useRef(connectStripe)

  useEffect(() => {
    const code = new URLSearchParams(window.location.href).get('code')

    if (code) {
      connectStripeRef.current({
        variables: { input: { code } },
      })
    } else {
      history.replace('/login')
    }
  }, [history])

  if (data && data?.connectStripe) {
    return <Redirect to={`/user/${viewer.id}`} />
  }

  if (loading) {
    return (
      <Content className='stripe'>
        <Spin size='large' tip='Connectiing to your stripe account...' />
      </Content>
    )
  }

  if (error) {
    return <Redirect to={`/user/${viewer.id}?stripe_error=true`} />
  }
  return null
}
