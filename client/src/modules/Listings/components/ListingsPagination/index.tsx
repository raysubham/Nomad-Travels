import { Pagination } from 'antd'

interface Props {
  total: number
  limit: number
  page: number
  setPage: (page: number) => void
}

export const ListingsPagination = ({ total, limit, page, setPage }: Props) => {
  return (
    <Pagination
      className='listings-pagination'
      current={page}
      defaultPageSize={limit}
      total={total}
      onChange={(page: number) => setPage(page)}
      showLessItems
      hideOnSinglePage
    />
  )
}
