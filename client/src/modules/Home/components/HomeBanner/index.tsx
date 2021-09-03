import { Card, Col, Input, Row, Typography } from 'antd'
import { Link } from 'react-router-dom'

import dubaiImg from '../../assets/dubai.jpg'
import londonImg from '../../assets/london.jpg'
import losAngelesImg from '../../assets/los-angeles.jpg'
import torontoImg from '../../assets/toronto.jpg'

const { Title } = Typography
const { Search } = Input

interface Props {
  onSearch: (searchValue: string) => void
}

export const HomeBanner = ({ onSearch }: Props) => {
  return (
    <div className='home-hero'>
      <div className='home-hero__search'>
        <Title className='home-hero__title'>
          Find a place you'll love to stay at!
        </Title>
        <Search
          placeholder='Search you favourite holiday spots'
          enterButton
          size='large'
          className='home-hero__search-input'
          onSearch={onSearch}
        />
      </div>
      <Row gutter={12} className='home-hero__cards'>
        <Link to='/listings/dubai'>
          <Col xs={12} md={6}>
            <Card cover={<img width={100} src={dubaiImg} alt='dubai' />}>
              Dubai
            </Card>
          </Col>
        </Link>
        <Link to='/listings/los%20angeles'>
          <Col xs={12} md={6}>
            <Card cover={<img src={losAngelesImg} alt='la' />}>
              Los Angeles
            </Card>
          </Col>
        </Link>
        <Link to='/listings/london'>
          <Col xs={0} md={6}>
            <Card cover={<img src={londonImg} alt='london' />}>London</Card>
          </Col>
        </Link>
        <Link to='/listings/toronto'>
          <Col xs={0} md={6}>
            <Card cover={<img src={torontoImg} alt='toronto' />}>Toronto</Card>
          </Col>
        </Link>
      </Row>
    </div>
  )
}
