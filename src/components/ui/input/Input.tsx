/**
 * @package
 */

import type { NextPage } from 'next'

const buttonStyle = {
  default: 'text-sm border border-solid border-slate-300',
  large: 'h-16 text-3xl',
  file: 'border-none',
}

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  variant: keyof typeof buttonStyle
}

export const Input: NextPage<InputProps> = ({ variant, ...props }) => {
  return (
    <input
      className={`w-full rounded px-2 py-2 font-normal placeholder-slate-400 focus:outline-none ${buttonStyle[variant]}`}
      {...props}
    />
  )
}
