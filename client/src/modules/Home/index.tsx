import { displaySuccessNotification } from '../../lib/utils'

export const Home = () => {
  return (
    <div>
      <button
        onClick={() => displaySuccessNotification('Log In Successfull 🎉')}>
        {' '}
        <a href='/login'>Login</a>
      </button>
    </div>
  )
}
