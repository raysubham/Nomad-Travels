import { gql, useMutation, useQuery } from '@apollo/client'
import { Listings as ListingsData } from './__generated__/Listings'
import {
  DeleteListing as DeleteListingData,
  DeleteListingVariables,
} from './__generated__/DeleteListing'
import '../../styles/listings.css'
import { List, Avatar, Button, Spin, Alert } from 'antd'
import { ListingsSkeleton } from './components/ListingsSkeleton'

const LISTINGS = gql`
  query Listings {
    listings {
      id
      title
      image
      address
      price
      numOfGuests
      numOfBaths
      numOfBeds
      rating
    }
  }
`

const DELETE_LISTING = gql`
  mutation DeleteListing($id: ID!) {
    deleteListing(id: $id) {
      id
    }
  }
`

interface Props {
  title: string
}

export const ListingsComponent = ({ title }: Props) => {
  const { data, loading, error } = useQuery<ListingsData>(LISTINGS)
  const listings = data ? data.listings : null

  const [
    deleteListing,
    { loading: deleteListingLoading, error: deleteListingError },
  ] = useMutation<DeleteListingData, DeleteListingVariables>(DELETE_LISTING)

  const handleDeleteListing = async (id: string) => {
    await deleteListing({ variables: { id }, refetchQueries: [LISTINGS] })
  }

  if (loading) {
    return (
      <div className='listings'>
        <ListingsSkeleton title={title} />
      </div>
    )
  }
  if (error) {
    return (
      <div className='listings'>
        <ListingsSkeleton title={title} error />
      </div>
    )
  }

  const errorAlert = deleteListingError ? (
    <Alert
      type='error'
      message='Oops! Something went Wrong!'
      style={{ marginBottom: '20px', padding: '10px' }}
    />
  ) : null

  return (
    <div className='listings'>
      {errorAlert}
      <h1>{title}</h1>
      <Spin spinning={deleteListingLoading}>
        {listings ? (
          <List
            itemLayout='horizontal'
            dataSource={listings}
            renderItem={(listing) => (
              <List.Item
                actions={[
                  <Button onClick={() => handleDeleteListing(listing.id)}>
                    Delete
                  </Button>,
                ]}>
                <List.Item.Meta
                  title={listing.title}
                  description={listing.address}
                  avatar={
                    <Avatar src={listing.image} shape='square' size={64} />
                  }
                />
              </List.Item>
            )}
          />
        ) : null}
      </Spin>
    </div>
  )
}
