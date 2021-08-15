import { Layout } from 'antd'
import { Link } from 'react-router-dom'
import { Viewer } from '../../lib/types'
import logo from './assets/logo.png'
import { MenuItems } from './components'

const { Header } = Layout

interface Props {
  viewer: Viewer
  setViewer: (viewer: Viewer) => void
}

export const AppHeader = ({ viewer, setViewer }: Props) => {
  return (
    <Header className='app-header'>
      <div className='app-header__logo-search-section'>
        <div className='app-header__logo'>
          <Link to='/'>
            <img src={logo} alt='Nomad Travels' />
          </Link>
        </div>
      </div>
      <MenuItems viewer={viewer} setViewer={setViewer} />
    </Header>
  )
}
