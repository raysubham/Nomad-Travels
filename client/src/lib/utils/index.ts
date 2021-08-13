import { message, notification } from 'antd'

export const displaySuccessNotification = (
  message: string,
  description?: string
) => {
  return notification['success']({
    message,
    description,
    placement: 'topRight',
    style: {
      marginTop: 30,
      verticalAlign: 'baseline',
    },
  })
}

export const displayErrorMessage = (error: string) => {
  return message.error(error)
}
