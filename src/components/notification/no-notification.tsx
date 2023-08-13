import { IconBell } from '@tabler/icons-react'

export const NoNotification = () => {
  return (
    <div className=' flex h-40 w-60 flex-col items-center justify-center gap-y-3'>
      <span className='hover:cursor-default dark:brightness-75'>まだ通知はありません</span>
      <IconBell
        size={50}
        stroke={2}
        style={{
          stroke: '#64748b',
        }}
      />
    </div>
  )
}
