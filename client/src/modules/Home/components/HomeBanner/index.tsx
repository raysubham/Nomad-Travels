import { Card, Col, Input, Row, Typography } from 'antd'
import { Link } from 'react-router-dom'

import sikkimImg from '../../assets/sikkim.jpg'
import goaImg from '../../assets/goa.jpg'
import manaliImg from '../../assets/manali.jpg'
import keralaImg from '../../assets/kerala.jpg'

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
          placeholder='Search your favourite holiday spots'
          enterButton
          size='large'
          className='home-hero__search-input'
          onSearch={onSearch}
        />
      </div>
      <Row gutter={12} className='home-hero__cards'>
        <Link to='/listings/manali'>
          <Col xs={12} md={6}>
            <Card cover={<img width={100} src={manaliImg} alt='Manali' />}>
              Manali
            </Card>
          </Col>
        </Link>
        <Link to='/listings/goa'>
          <Col xs={12} md={6}>
            <Card cover={<img src={goaImg} alt='Goa' />}>Goa</Card>
          </Col>
        </Link>
        <Link to='/listings/sikkim'>
          <Col xs={0} md={6}>
            <Card cover={<img src={sikkimImg} alt='Sikkim' />}>Sikkim</Card>
          </Col>
        </Link>
        <Link to='/listings/kerala'>
          <Col xs={0} md={6}>
            <Card cover={<img src={keralaImg} alt='Kerala' />}>Kerala</Card>
          </Col>
        </Link>
      </Row>
    </div>
  )
}
