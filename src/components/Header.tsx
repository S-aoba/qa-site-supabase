import { Navigation } from './Navigation'

export const Header = () => {
  return (
    <header className='min-h-14 flex flex-col items-center justify-center gap-x-5 bg-gray-400 pt-3 font-mono text-xl shadow-lg'>
      <div className='mb-2 flex items-center justify-center gap-x-5'>
        <input type='text' className='rounded-lg px-1 py-2 text-sm text-gray-500 shadow-lg outline-gray-300' />
        <div className='flex h-9 w-9 items-center justify-center rounded-full border bg-white text-gray-500 shadow-lg hover:cursor-pointer hover:bg-gray-200'>
          U
        </div>
        <button className='rounded-lg border bg-white px-2 py-1 text-gray-500 shadow-lg hover:bg-gray-200'>投稿</button>
      </div>
      <Navigation />
    </header>
  )
}
