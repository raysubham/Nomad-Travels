import { Input, Layout } from 'antd'
import { useEffect, useState } from 'react'
import { Link, withRouter, RouteComponentProps } from 'react-router-dom'
import { Viewer } from '../../lib/types'
import { displayErrorMessage } from '../../lib/utils'
import logo from './assets/nomad-logo.png'
import { MenuItems } from './components'

const { Header } = Layout
const { Search } = Input

interface Props {
  viewer: Viewer
  setViewer: (viewer: Viewer) => void
}

export const AppHeader = withRouter(
  ({ viewer, setViewer, history, location }: Props & RouteComponentProps) => {
    const [search, setSearch] = useState('')

    useEffect(() => {
      const { pathname } = location
      const pathnameStrings = pathname.split('/')

      if (!pathname.includes('/listings')) {
        setSearch('')
        return
      }

      if (pathname.includes('/listings') && pathnameStrings.length === 3) {
        setSearch(pathnameStrings[2])
        return
      }
    }, [location])

    const onSearch = (value: string) => {
      const searchValue = value.trim()

      if (searchValue) {
        history.push(`/listings/${searchValue}`)
      } else {
        displayErrorMessage('Please enter a valid search!')
      }
    }

    return (
      <Header className='app-header'>
        <div className='app-header__logo-search-section'>
          <div className='app-header__logo'>
            <Link to='/'>
              <img src={logo} alt='Nomad Travels' />
            </Link>
          </div>
          <div className='app-header__search-input'>
            <Search
              placeholder={`Search 'Manali'`}
              onSearch={onSearch}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              enterButton
            />
          </div>
        </div>

        <div className='app-header__menu-section'>
          <MenuItems viewer={viewer} setViewer={setViewer} />
        </div>
      </Header>
    )
  }
)
