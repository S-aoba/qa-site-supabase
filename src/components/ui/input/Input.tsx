/**
 * @package
 */

import type { NextPage } from 'next'

type InputProps = React.InputHTMLAttributes<HTMLInputElement>

export const Input: NextPage<InputProps> = ({ ...props }) => {
  return (
    <input
      className='w-full rounded border border-solid border-slate-300 px-2 py-2 text-sm font-normal placeholder-slate-400 focus:outline-none'
      {...props}
    />
  )
}
