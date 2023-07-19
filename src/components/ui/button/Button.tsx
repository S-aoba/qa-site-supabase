/**
 * @package
 */

import type { NextPage } from 'next'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode
  loading?: boolean
  variant: keyof typeof buttonColorStyle
}

const buttonColorStyle = {
  submit: 'bg-slate-500 hover:bg-slate-600 text-white border-none',
  link: 'bg-slate-500 hover:bg-slate-600 text-white border-none',
  cancel: 'bg-white hover:border-black text-black border border-solid border-slate-300',
  delete: "bg-red-500 hover:opacity-75 text-white border-none"
}

export const Button: NextPage<ButtonProps> = ({ children, loading, variant, ...props }) => {
  return (
    <button
      className={`m-0 flex h-9 w-auto items-center whitespace-nowrap rounded px-[18px] py-0 text-center text-sm font-semibold shadow-none hover:cursor-pointer ${
        buttonColorStyle[variant]
      } ${loading && 'opacity-10'}`}
      {...props}
    >
      {loading && (
        <i className='mr-2 h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-t-transparent' />
      )}
      {children}
    </button>
  )
}
