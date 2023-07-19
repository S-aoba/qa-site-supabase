/**
 * @package
 */

import type { NextPage } from 'next'

const buttonStyle = {
  default: 'text-sm',
  large: 'h-16 text-3xl',
}

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  variant: keyof typeof buttonStyle
}

export const Input: NextPage<InputProps> = ({ variant, ...props }) => {
  return (
    <input
      className={`w-full rounded border border-solid border-slate-300 px-2 py-2 font-normal placeholder-slate-400 focus:outline-none ${buttonStyle[variant]}`}
      {...props}
    />
  )
}
