import { useQuery } from '@apollo/client'
import { Col, Layout, Row } from 'antd'
import { RouteComponentProps } from 'react-router'
import { ErrorBanner, PageSkeleton } from '../../lib/components'
import { USER } from '../../lib/graphql/queries'
import {
  User as UserData,
  UserVariables,
} from '../../lib/graphql/queries/User/__generated__/User'
import { Viewer } from '../../lib/types'
import { UserProfile } from './components'

const { Content } = Layout

interface Props {
  viewer: Viewer
}

interface MatchParams {
  id: string
}

export const User = ({
  viewer,
  match,
}: Props & RouteComponentProps<MatchParams>) => {
  const { data, loading, error } = useQuery<UserData, UserVariables>(USER, {
    variables: { id: match.params.id },
  })

  const user = data?.user
  const viewerIsUser = viewer.id === match.params.id
  const userProfileElement = user ? (
    <UserProfile user={user} viewerIsUser={viewerIsUser} />
  ) : null

  if (loading) {
    return (
      <Content className='user'>
        <PageSkeleton />
      </Content>
    )
  }

  if (error) {
    return (
      <Content className='user'>
        <ErrorBanner description="The user doesn't exists or we have encountered an error. Please try again later!" />
        <PageSkeleton />
      </Content>
    )
  }

  return (
    <Content className='user'>
      <Row gutter={12} justify='space-between'>
        <Col xs={24}>{userProfileElement}</Col>
      </Row>
    </Content>
  )
}
