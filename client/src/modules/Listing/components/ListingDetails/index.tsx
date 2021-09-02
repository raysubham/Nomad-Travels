import { EnvironmentOutlined } from '@ant-design/icons'
import { Typography, Divider, Avatar, Tag } from 'antd'
import { Link } from 'react-router-dom'

import { Listing as ListingData } from '../../../../lib/graphql/queries/Listing/__generated__/Listing'

interface ListingDetailsProps {
  listing: ListingData['listing']
}

const { Title, Paragraph } = Typography

export const ListingDetails = ({ listing }: ListingDetailsProps) => {
  const { title, description, image, type, address, city, numOfGuests, host } =
    listing

  return (
    <div className='listing-details'>
      <div
        style={{ backgroundImage: `url(${image})` }}
        className='listing-details__image'
      />

      <div className='listing-details__information'>
        <Paragraph
          type='secondary'
          ellipsis
          className='listing-details__city-address'>
          <Link to={`/listings/${city}`}>
            <EnvironmentOutlined /> {city}
          </Link>
          <Divider type='vertical' />
          {address}
        </Paragraph>
        <Title level={3} className='listing-details__title'>
          {title}
        </Title>
      </div>

      <Divider />

      <div className='listing-details__section'>
        <Link to={`/user/${host.id}`}>
          <Avatar src={host.avatar} size={64} />
          <Title level={4} className='listing-details__host-name'>
            {host.name}
          </Title>
        </Link>
      </div>

      <Divider />

      <div className='listing-details__section'>
        <Title level={3}>About this Place</Title>
        <div className='listing-details__about-items'>
          <Tag color='red'>{type}</Tag>
          <Tag color='red'>{numOfGuests} Guests</Tag>
        </div>
        <Paragraph ellipsis={{ rows: 3, expandable: true }}>
          {description}
        </Paragraph>
      </div>
    </div>
  )
}
