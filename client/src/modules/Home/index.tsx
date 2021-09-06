import { Col, Layout, Row, Typography } from 'antd'
import { HomeBanner, HomeListings, HomeListingsSkeleton } from './components'
import mapBackground from './assets/map-background.jpg'
import { RouteComponentProps } from 'react-router'
import { displayErrorMessage } from '../../lib/utils'
import { Link } from 'react-router-dom'

import sfImg from './assets/san-fransisco.jpg'
import cancunImg from './assets/cancun.jpg'
import { useQuery } from '@apollo/client'
import { LISTINGS } from '../../lib/graphql/queries'

import {
  Listings as ListingsData,
  ListingsVariables,
} from '../../lib/graphql/queries/Listings/__generated__/Listings'
import { ListingsFilter } from '../../lib/graphql/globalTypes'

const { Content } = Layout
const { Title, Paragraph } = Typography

const PAGE_LIMIT = 4
const PAGE_NUMBER = 1

export const Home = ({ history }: RouteComponentProps) => {
  const { data, loading } = useQuery<ListingsData, ListingsVariables>(
    LISTINGS,
    {
      variables: {
        filter: ListingsFilter.PRICE_HIGH_TO_LOW,
        limit: PAGE_LIMIT,
        page: PAGE_NUMBER,
      },
    }
  )

  const onSearch = (value: string) => {
    const searchValue = value.trim()
    if (searchValue) {
      history.push(`/listings/${searchValue}`)
    } else {
      displayErrorMessage('Please enter a valid search!')
    }
  }

  const renderPremiumlistings = () => {
    if (loading) {
      return <HomeListingsSkeleton />
    }
    if (data) {
      return (
        <HomeListings
          title='Premium Listings'
          listings={data.listings.result}
        />
      )
    }
    return null
  }

  return (
    <Content
      className='home'
      style={{ backgroundImage: `url(${mapBackground})` }}>
      <HomeBanner onSearch={onSearch} />
      <div className='home__cta-section'>
        <Title level={2} className='home__cta-section-title'>
          Your Guide for all things rental!
        </Title>
        <Paragraph>
          Helping you make your best decisions in renting your last minute
          locations!
        </Paragraph>
        <Link
          to='/listings/india'
          className='ant-btn ant-btn-primary ant-btn-lg home__cta-section-button'>
          Popular listings in India
        </Link>
      </div>

      {renderPremiumlistings()}

      <div className='home__listings'>
        <Title level={3} className='home__listings-title'>
          Listings of any kind
        </Title>
        <Row gutter={12}>
          <Col xs={24} sm={12}>
            <Link to='/listings/san%20francisco'>
              <div className='home__listings-img-cover'>
                <img
                  src={sfImg}
                  alt='San Francisco'
                  className='home__listings-img'
                />
              </div>
            </Link>
          </Col>
          <Col xs={24} sm={12}>
            <Link to='/listings/cancun'>
              <div className='home__listings-img-cover'>
                <img
                  src={cancunImg}
                  alt='Cancun '
                  className='home__listings-img'
                />
              </div>
            </Link>
          </Col>
        </Row>
      </div>
    </Content>
  )
}
