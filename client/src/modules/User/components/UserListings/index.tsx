import { Typography, List } from 'antd'
import { ListingCard } from '../../../../lib/components'
import { User } from '../../../../lib/graphql/queries/User/__generated__/User'

interface Props {
  userName: string | undefined
  userListings: User['user']['listings']
  limit: number
  listingsPage: number
  setListingsPage: (page: number) => void
}

const { Paragraph, Title } = Typography

export const UserListings = ({
  userName,
  userListings,
  limit,
  listingsPage,
  setListingsPage,
}: Props) => {
  const { total, result } = userListings

  const userListingsElement = (
    <List
      grid={{ gutter: 8, xs: 1, sm: 2, lg: 4 }}
      locale={{ emptyText: 'No Listings Found!' }}
      pagination={{
        position: 'top',
        current: listingsPage,
        defaultPageSize: limit,
        hideOnSinglePage: true,
        showLessItems: true,
        total,
        onChange: (page: number) => setListingsPage(page),
      }}
      dataSource={result}
      renderItem={(userListing) => (
        <List.Item>
          <ListingCard listing={userListing} />
        </List.Item>
      )}
    />
  )

  return (
    <div className='user-listings'>
      <Title level={4} className='user-listings__title'>
        {userName} Listings
      </Title>
      <Paragraph className='user-listings__description  '>
        All of {userName} available listings!
      </Paragraph>
      {userListingsElement}
    </div>
  )
}
