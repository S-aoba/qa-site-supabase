import { getNotification } from '@/common/utils/get-notification'

import { NotificationContent } from './notification-content'

export const Notification = async ({ user_id }: { user_id: string }) => {
  const { notifications } = await getNotification(user_id)
  if (notifications === null) return null

  return <NotificationContent notifications={notifications} />
}
