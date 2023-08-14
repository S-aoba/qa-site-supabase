export const ErrorMessage = ({ message }: { message: string }) => {
  return (
    <div className='mt-5 break-words bg-red-50 text-start text-sm font-semibold leading-loose tracking-wide text-red-500'>
      {message}
    </div>
  )
}
