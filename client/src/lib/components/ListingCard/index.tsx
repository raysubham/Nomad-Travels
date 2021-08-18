import { UserOutlined } from '@ant-design/icons'
import { Card, Typography } from 'antd'
import { Link } from 'react-router-dom'

interface Props {
  listing: {
    id: string
    title: string
    image: string
    address: string
    price: number
    numOfGuests: number
  }
}

const { Text, Title } = Typography

export const ListingCard = ({ listing }: Props) => {
  const { id, title, image, address, price, numOfGuests } = listing

  return (
    <Link to={`/listing/${id}`}>
      <Card
        hoverable
        cover={
          <div
            className='listing-card__cover-img'
            style={{
              backgroundImage: `url(${image})`,
            }}
          />
        }>
        <div className='listing-card__details' style={{ textAlign: 'center' }}>
          <div className='listing-card__description'>
            <Title level={4} className='listing-card__price'>
              {price} <span>/ day</span>
            </Title>
            <Text strong ellipsis className='listing-card__title'>
              {title}
            </Text>
            <Text ellipsis className='listing-card__address'>
              {address}
            </Text>
          </div>
          <div className='listing-card__dimensions listing-card__dimensions--guests'>
            <UserOutlined /> <Text>{numOfGuests} guests</Text>
          </div>
        </div>
      </Card>
    </Link>
  )
}
