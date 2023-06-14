import Link from 'next/link'

export const Card = () => {
  return (
    <div className='flex h-fit w-full items-center gap-x-3 rounded-lg bg-white px-2 py-4'>
      <div className='flex h-9 w-9 items-center justify-center rounded-full border bg-white text-amber-500 shadow-lg hover:cursor-pointer hover:bg-gray-200'>
        P
      </div>
      <div className='flex w-full flex-col justify-center'>
        <div className='flex items-center gap-x-2 text-xs'>
          <span className='line-clamp-1 w-fit max-w-[500px] rounded-lg bg-cyan-300 px-2 py-1 leading-5 text-stone-500'>
            問題309: パスカルの三角形の底辺
          </span>
          <div className='flex flex-col gap-y-1 text-gray-500'>
            <span>投稿日: 2023/06/14</span>
            <div className=' flex items-center gap-x-2'>
              <div className='flex h-5 w-5 items-center justify-center rounded-full border bg-white shadow-lg hover:cursor-pointer hover:bg-gray-200'>
                U
              </div>
              <span className='line-clamp-1 w-fit max-w-[150px]'>aoba</span>
            </div>
          </div>
        </div>
        <Link href={'/'} className='line-clamp-1 hover:underline hover:underline-offset-4'>
          コンピュータサイエンスの基礎・中級 / 制御フロー / パーフェクトナンバー
        </Link>
      </div>
    </div>
  )
}
