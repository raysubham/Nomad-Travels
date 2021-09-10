import { KeyOutlined } from '@ant-design/icons'
import { Button, Divider, Modal, Typography } from 'antd'
import moment, { Moment } from 'moment'
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { StripeCardElement } from '@stripe/stripe-js'
import {
  displayErrorMessage,
  displaySuccessNotification,
} from '../../../../lib/utils'
import { useMutation } from '@apollo/client'
import {
  CreateBooking as CreateBookingData,
  CreateBookingVariables,
} from '../../../../lib/graphql/mutations/CreateBooking/__generated__/CreateBooking'
import { CREATE_BOOKING } from '../../../../lib/graphql/mutations'

interface Props {
  modalVisible: boolean
  setModalVisible: (modalVisible: boolean) => void
  id: string
  price: number
  checkInDate: Moment
  checkOutDate: Moment
  clearBookingData: () => void
  handleRefetchListing: () => Promise<void>
}

const { Paragraph, Text, Title } = Typography

export const ListingCreateBookingModal = ({
  modalVisible,
  setModalVisible,
  price,
  id,
  checkInDate,
  checkOutDate,
  clearBookingData,
  handleRefetchListing,
}: Props) => {
  const [createBooking, { loading }] = useMutation<
    CreateBookingData,
    CreateBookingVariables
  >(CREATE_BOOKING, {
    onCompleted: () => {
      clearBookingData()
      displaySuccessNotification(
        'You have successfully booked the listing!',
        'Booking history can always be found on your user page!'
      )
      handleRefetchListing()
    },
    onError: () => {
      displayErrorMessage(
        "Sorry! We couldn't book the listing. Please try again later!"
      )
    },
  })

  const daysBooked = checkOutDate.diff(checkInDate, 'days') + 1
  const listingPrice = price * daysBooked
  const totalPrice = listingPrice

  const stripe = useStripe()
  const elements = useElements()

  const handleCreateBooking = async () => {
    if (!stripe || !elements) {
      return displayErrorMessage("Sorry! We couldn't connect with stripe.")
    }

    const card = elements.getElement(CardElement)
    const { token: stripeToken, error: stripeError } = await stripe.createToken(
      card as StripeCardElement
    )

    console.log(stripeToken)
    console.log(stripeError)

    if (stripeToken) {
      createBooking({
        variables: {
          input: {
            id,
            source: stripeToken.id,
            checkIn: moment(checkInDate).format('YYYY-MM-DD'),
            checkOut: moment(checkOutDate).format('YYYY-MM-DD'),
          },
        },
      })
    } else {
      displayErrorMessage(
        stripeError && stripeError.message
          ? stripeError.message
          : `Sorry! We couldn't book the listing. Please try again later!`
      )
    }
  }

  return (
    <Modal
      visible={modalVisible}
      centered
      footer={null}
      onCancel={() => setModalVisible(false)}>
      <div className='listing-booking-modal'>
        <div className='listing-booking-modal__intro'>
          <Title className='listing-booking-modal'>
            <KeyOutlined />
          </Title>
          <Title className='listing-booking-modal' level={3}>
            Book your Trip
          </Title>
          <Paragraph>
            Enter your payment information to book the listing from the dates
            between{' '}
            <Text strong mark>
              {moment(checkInDate).format('Do MMMM YYYY')}
            </Text>{' '}
            and{' '}
            <Text strong mark>
              {moment(checkOutDate).format('Do MMMM YYYY')}
            </Text>
            , inclusive.
          </Paragraph>
        </div>

        <Divider />

        <div className='listing-booking-modal__charge-summary'>
          <Paragraph>
            ₹{price} * {daysBooked} days = <Text strong>₹{listingPrice}</Text>
          </Paragraph>
          <Paragraph className='listing-booking-modal__charge-summary-total'>
            Total = <Text mark>₹{totalPrice}</Text>
          </Paragraph>
        </div>

        <Divider />

        <div className='listing-booking-modal__stripe-section'>
          <CardElement
            options={{ hidePostalCode: true }}
            className='listing-booking-modal__stripe-card'
          />
          <Button
            type='primary'
            size='large'
            disabled={!stripe}
            loading={loading}
            className='listing-booking-modal__cta'
            onClick={handleCreateBooking}>
            Book
          </Button>
        </div>
      </div>
    </Modal>
  )
}
