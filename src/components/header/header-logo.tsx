import Link from 'next/link'

export const HeaderLogo = () => {
  return (
    <div className='flex items-center'>
      <Link href={'/'} className='text-2xl text-black no-underline'>
        QA
      </Link>
    </div>
  )
}
