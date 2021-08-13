import { Alert } from 'antd'

interface ErrorProps {
  message?: string
  description?: string
}

export const ErrorBanner = ({
  message = 'Oops! Something Went Wrong!',
  description = 'Please Try again Later!',
}: ErrorProps) => {
  return (
    <Alert
      className='error-banner'
      banner
      closable
      message={message}
      description={description}
      type='error'
    />
  )
}
