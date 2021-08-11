import { Alert, Divider, Skeleton } from 'antd'

interface Props {
  title: string
  error?: boolean
}

export const ListingsSkeleton = ({ title, error = false }: Props) => {
  const errorAlert = error ? (
    <Alert
      type='error'
      message='Oops! Something went Wrong!'
      style={{ marginBottom: '20px', padding: '10px 10px' }}
    />
  ) : null
  return (
    <div>
      {errorAlert}
      <h1>{title}</h1>
      <Skeleton active paragraph={{ rows: 1 }} />
      <Divider />
      <Skeleton active paragraph={{ rows: 1 }} />
      <Divider />
      <Skeleton active paragraph={{ rows: 1 }} />
      <Divider />
      <Skeleton active paragraph={{ rows: 1 }} />
      <Divider />
      <Skeleton active paragraph={{ rows: 1 }} />
    </div>
  )
}
