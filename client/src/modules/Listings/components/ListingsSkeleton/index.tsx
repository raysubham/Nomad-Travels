import { Card, Skeleton, List } from 'antd'

import listingLoadingCoverImage from '../../assets/listing-loading-card-cover.jpg'

export const ListingsSkeleton = () => {
  const eightEmptyObject = [{}, {}, {}, {}, {}, {}, {}, {}]

  return (
    <div className='listings-skeleton'>
      <Skeleton paragraph={{ rows: 1 }} />

      <List
        grid={{ gutter: 8, xs: 1, sm: 2, lg: 4 }}
        dataSource={eightEmptyObject}
        renderItem={(listing) => (
          <List.Item style={{ width: '320px' }}>
            <Card
              loading
              className='listings-skelton__card'
              cover={
                <div
                  style={{
                    backgroundImage: `url(${listingLoadingCoverImage})`,
                  }}
                  className='listings-skeleton__card-cover-img'></div>
              }
            />
          </List.Item>
        )}
      />
    </div>
  )
}
