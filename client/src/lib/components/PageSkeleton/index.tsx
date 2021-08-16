import { Skeleton } from 'antd'

export const PageSkeleton = () => {
  const skeleton = (
    <Skeleton
      active
      paragraph={{ rows: 4 }}
      className='page-skeleton__paragraph'
    />
  )

  return (
    <>
      {skeleton}
      {skeleton}
      {skeleton}
    </>
  )
}
