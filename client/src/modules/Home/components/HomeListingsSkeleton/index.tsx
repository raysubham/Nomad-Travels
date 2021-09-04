import { Card, Skeleton, List } from 'antd'

import listingLoadingCoverImage from '../../assets/listing-loading-card-cover.jpg'

export const HomeListingsSkeleton = () => {
  const fourEmptyObject = [{}, {}, {}, {}]

  return (
    <div className='home-listings-skeleton'>
      <Skeleton paragraph={{ rows: 0 }} />

      <List
        grid={{ gutter: 8, xs: 1, sm: 2, lg: 4 }}
        dataSource={fourEmptyObject}
        renderItem={(listing) => (
          <List.Item>
            <Card
              loading
              className='home-listings-skelton__card'
              cover={
                <div
                  style={{
                    backgroundImage: `url(${listingLoadingCoverImage})`,
                  }}
                  className='home-listings-skeleton__card-cover-img'></div>
              }
            />
          </List.Item>
        )}
      />
    </div>
  )
}
