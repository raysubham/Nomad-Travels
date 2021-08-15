import { displaySuccessNotification } from '../../lib/utils'

export const Home = () => {
  return (
    <div>
      <a href='/login'>Login</a>{' '}
      <button
        onClick={() => displaySuccessNotification('Log In Successful 🎉')}>
        notification
      </button>
    </div>
  )
}
