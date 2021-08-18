import { Avatar, Button, Menu } from 'antd'
import { HomeOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import { Viewer } from '../../../../lib/types'
import { useMutation } from '@apollo/client'
import { LOG_OUT } from '../../../../lib/graphql/mutations'
import { LogOut as LogOutData } from '../../../../lib/graphql/mutations/LogOut/__generated__/LogOut'
import {
  displayErrorMessage,
  displaySuccessNotification,
} from '../../../../lib/utils'

const { Item, SubMenu } = Menu

interface Props {
  viewer: Viewer
  setViewer: (viewer: Viewer) => void
}

export const MenuItems = ({ viewer, setViewer }: Props) => {
  const [logOut] = useMutation<LogOutData>(LOG_OUT, {
    onCompleted: (data) => {
      if (data && data.logOut) {
        setViewer(data.logOut)
        sessionStorage.removeItem('token')
        displaySuccessNotification('Log out successful 🎉')
      }
    },
    onError: (data) => {
      displayErrorMessage("Sorry! Couldn't log you out! Please try again later")
    },
  })

  const handleLogout = async () => {
    await logOut()
  }

  const SubMenuDropDown =
    viewer.id && viewer.avatar ? (
      <SubMenu title={<Avatar src={viewer.avatar} />} key='profile-dropdown '>
        <Item key='/user'>
          <Link to={`/user/${viewer.id}`} />
          <UserOutlined />
          <span>Profile</span>
        </Item>
        <Item key='/logout'>
          <div onClick={handleLogout}>
            <LogoutOutlined />
            <span>Logout</span>
          </div>
        </Item>
      </SubMenu>
    ) : (
      <Item key='/login'>
        <Link to='/login'>
          <Button>Sign In </Button>
        </Link>
      </Item>
    )

  return (
    <Menu mode='horizontal' className='menu' selectable={false}>
      <Item key='/host'>
        <Link to='/host'>
          <HomeOutlined />
          <span>Host</span>
        </Link>
      </Item>
      {SubMenuDropDown}
    </Menu>
  )
}
