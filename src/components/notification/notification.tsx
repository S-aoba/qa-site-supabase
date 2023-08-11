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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

import { NoNotification } from './no-notification'
import { WithNotification } from './with-notification'

export const Notification = ({ notifications }: { notifications: NotificationType[] | null }) => {
  return (
    <div className='relative flex items-center'>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className='rounded border border-input bg-background px-2 shadow-sm hover:cursor-pointer hover:bg-accent hover:text-accent-foreground'>
                  <IconBell className='h-5 w-5 text-muted-foreground' />
                </div>
              </TooltipTrigger>
              <TooltipContent side='right' sideOffset={10} align='start'>
                <p>通知</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
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
            className=' absolute -right-1 -top-1'
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
