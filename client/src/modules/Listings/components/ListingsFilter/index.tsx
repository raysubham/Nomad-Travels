import { Select } from 'antd'
import { ListingsFilter } from '../../../../lib/graphql/globalTypes'

const { Option } = Select

interface Props {
  filter: ListingsFilter
  setFilter: (filter: ListingsFilter) => void
}

export const ListingsFilterComponent = ({ filter, setFilter }: Props) => {
  return (
    <div className='listings-filters'>
      <span>Sort By</span>
      <Select
        value={filter}
        onChange={(filter: ListingsFilter) => setFilter(filter)}>
        <Option value={ListingsFilter.PRICE_LOW_TO_HIGH}>
          Price:Low to High
        </Option>
        <Option value={ListingsFilter.PRICE_HIGH_TO_LOW}>
          Price:High to Low
        </Option>
      </Select>
    </div>
  )
}
