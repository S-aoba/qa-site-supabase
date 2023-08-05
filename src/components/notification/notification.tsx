'use client'

import { IconBell, IconCircle } from '@tabler/icons-react'

import type { NotificationType } from '@/common/types'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { NoNotification } from './no-notification'
import { WithNotification } from './with-notification'

export const Notification = ({ notifications }: { notifications: NotificationType[] | null }) => {
  return (
    <div className='relative flex items-center'>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <IconBell className='stroke-slate-500 hover:cursor-pointer hover:stroke-slate-600' />
        </DropdownMenuTrigger>
        <DropdownMenuContent className=' -ml-3 mt-1 rounded-2xl p-4 shadow'>
          <DropdownMenuLabel>通知</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {notifications && notifications?.length > 0 ? (
            notifications.map((notification) => {
              return (
                <DropdownMenuItem key={notification.id}>
                  <WithNotification key={notification.id} notification={notification} />
                </DropdownMenuItem>
              )
            })
          ) : (
            <NoNotification />
          )}
        </DropdownMenuContent>
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
      </DropdownMenu>
    </div>
  )
}
