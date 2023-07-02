'use client'

import { Menu } from '@mantine/core'
import { IconBell, IconCircle } from '@tabler/icons-react'

import type { NotificationType } from '@/common/types'

import { NoNotification } from './no-notification'
import { WithNotification } from './with-notification'

export const Notification = ({ notifications }: { notifications: NotificationType[] | null }) => {
  return (
    <div className='relative flex items-center'>
      <Menu>
        <Menu.Target>
          <IconBell className='stroke-slate-500 hover:cursor-pointer hover:stroke-slate-600' />
        </Menu.Target>
        <Menu.Dropdown className=' -ml-3 mt-1 rounded-2xl p-4 shadow'>
          <Menu.Label>通知</Menu.Label>
          {notifications && notifications?.length > 0 ? (
            notifications.map((notification) => {
              return <WithNotification key={notification.id} notification={notification} />
            })
          ) : (
            <NoNotification />
          )}
        </Menu.Dropdown>
      </Menu>
      {notifications && notifications?.length > 0 && (
        <IconCircle
          size={15}
          className=' absolute -top-1 right-0'
          style={{
            stroke: '#fde047',
            fill: '#fde047',
          }}
        />
      )}
    </div>
  )
}
