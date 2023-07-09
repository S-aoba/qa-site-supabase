import Image from 'next/image'
import Link from 'next/link'

export const HeaderLogo = () => {
  return (
    <Link href={'/'}>
      <Image src={'/qa-logo.svg'} width={45} height={45} alt='Logo' priority/>
    </Link>
  )
}
