export const ErrorMessage = ({ message }: { message: string }) => {
  return (
    <div className='mt-5 break-words text-start text-sm font-semibold leading-loose tracking-wide text-red-500'>
      {message}
    </div>
  )
}
