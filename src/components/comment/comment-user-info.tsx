import Image from 'next/image'

export const CommentUserInfo = ({ avatar_url, username }: { avatar_url: string | null; username: string }) => {
  return (
    <div className='flex space-x-2'>
      <div className='relative h-6 w-6'>
        <Image
          src={avatar_url !== null ? avatar_url : '/default.png'}
          className='rounded-full object-cover'
          alt='avatar'
          fill
          sizes='auto'
          priority
        />
      </div>
      <span>{username}</span>
    </div>
  )
}
