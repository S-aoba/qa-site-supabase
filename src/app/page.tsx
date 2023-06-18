import { Card } from '@/components/card'

export default function Home() {
  return (
    <main className='flex flex-1 justify-center bg-stone-200'>
      <div className='flex w-full max-w-[800px] flex-col gap-y-3 px-2 py-3'>
        <Card />
        <Card />
        <Card />
      </div>
    </main>
  )
}
