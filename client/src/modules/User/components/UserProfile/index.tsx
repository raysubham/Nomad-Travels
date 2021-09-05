import { useMutation } from '@apollo/client'
import { Avatar, Button, Card, Divider, Tag, Typography } from 'antd'
import { DISCONNECT_STRIPE } from '../../../../lib/graphql/mutations'
import { DisconnectStripe as DisconnectStripeData } from '../../../../lib/graphql/mutations/DisconnectStripe/__generated__/DisconnectStripe'
import { User as UserData } from '../../../../lib/graphql/queries/User/__generated__/User'
import { Viewer } from '../../../../lib/types'
import {
  displayErrorMessage,
  displaySuccessNotification,
} from '../../../../lib/utils'

interface Props {
  user: UserData['user']
  viewerIsUser: boolean
  viewer: Viewer
  setViewer: (viewer: Viewer) => void
  handleRefetchUser: () => void
}

const { Paragraph, Text, Title } = Typography

const stripeAuthUrl = `https://connect.stripe.com/oauth/authorize?response_type=code&client_id=ca_KALzWNt3h1WIE8vs77BMsrh8DdBCpRvd&scope=read_write`

export const UserProfile = ({
  user,
  viewerIsUser,
  viewer,
  setViewer,
  handleRefetchUser,
}: Props) => {
  const [disconnectStripe, { loading }] = useMutation<DisconnectStripeData>(
    DISCONNECT_STRIPE,
    {
      onCompleted: (data) => {
        if (data && data.disconnectStripe) {
          setViewer({ ...viewer, hasWallet: data.disconnectStripe.hasWallet })
          displaySuccessNotification(
            'You have successfully disconnected from stripe!',
            'You have to reconnect with stripe to created listings!'
          )

          handleRefetchUser()
        }
      },
      onError: () => {
        displayErrorMessage(
          "Sorry we couldn't disconnect you from stripe.Please Try again later!"
        )
      },
    }
  )

  const redirectToStripe = () => {
    window.location.href = stripeAuthUrl
  }

  const additionalDetailsIfStripeConnected = user.hasWallet ? (
    <>
      <Paragraph>
        <Tag color='green'>Stripe Connected</Tag>
      </Paragraph>
      <Paragraph>
        Income earned: ₹ <Text strong>{user.income ? user.income : 0}</Text>
      </Paragraph>
      <Button
        type='primary'
        className='user-profile__details-cta'
        loading={loading}
        onClick={() => disconnectStripe()}>
        Disconnect Stripe
      </Button>
      <Paragraph type='secondary'>
        By disconnecting, you won't be able receive{' '}
        <Text strong>any further payments.</Text>
        This will prevent users from bookings any listings that you have
        created.
      </Paragraph>
    </>
  ) : (
    <>
      {' '}
      <Paragraph>
        Interested in becoming a Nomad Host? Register with Stripe Now!
      </Paragraph>
      <Button
        type='primary'
        className='user-profile__details-cta'
        onClick={redirectToStripe}>
        Connect with Stripe
      </Button>
      <Paragraph type='secondary'>
        Nomad Travels uses{' '}
        <a
          href='https://stripe.com/en-in/connect'
          target='_blank'
          rel='noopener noreferrer'>
          Stripe
        </a>{' '}
        to help transfer your earnings in a secure and trusted way.
      </Paragraph>
    </>
  )

  const additionalDetails = (
    <>
      <Divider />
      <div className='user-profile__details'>
        <Title level={4}>Additional Details</Title>
        {additionalDetailsIfStripeConnected}
      </div>
    </>
  )

  return (
    <div className='user-profile'>
      <Card className='user-profile__card'>
        <div className='user-profile__avatar'>
          <Avatar size={100} src={user.avatar} />
        </div>
        <Divider />
        <div className='user-profile__details'>
          <Title level={4}>Your Profile</Title>
          <Paragraph>
            Name: <Text strong>{user.name}</Text>
          </Paragraph>
          <Paragraph>
            Email: <Text strong>{user.email}</Text>
          </Paragraph>
        </div>
        {viewerIsUser && additionalDetails}
      </Card>
    </div>
  )
}
