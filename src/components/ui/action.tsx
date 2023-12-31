'use client'

import { DotsHorizontalIcon, Pencil2Icon, TrashIcon } from '@radix-ui/react-icons'
import Link from 'next/link'

import { useAction } from '@/common/hooks/useAction'
import type { ActionProps } from '@/common/types'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { ErrorMessage } from './error-message'

export const Action = ({ question, answer, comment }: ActionProps) => {
  const { message, isShowDialog, isLoading, handleShowDialog, handleHideDialog, handleSetData, handleDeleteData } =
    useAction({
      question,
      answer,
      comment,
    })

  return (
    <AlertDialog open={isShowDialog} onOpenChange={handleHideDialog}>
      <div className='flex items-center'>
        <DropdownMenu>
          <DropdownMenuTrigger className='p-1 hover:cursor-pointer hover:rounded-md hover:bg-border dark:brightness-75'>
            <DotsHorizontalIcon />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={handleSetData} className='text-primary hover:cursor-pointer dark:brightness-75'>
              {question ? (
                <Link href={'questions/edit'} className='flex items-center'>
                  <Pencil2Icon className='mr-2' />
                  編集
                </Link>
              ) : (
                <>
                  <Pencil2Icon className='mr-2' />
                  編集
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleShowDialog}
              className='text-primary hover:cursor-pointer dark:brightness-75'
            >
              <TrashIcon className='mr-2' />
              削除
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className='text-primary dark:brightness-75'>削除してもよろしいですか？</AlertDialogTitle>
          <AlertDialogDescription>この手順は取り消すことはできません。</AlertDialogDescription>
          <ErrorMessage message={message} />
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>キャンセル</AlertDialogCancel>
          <AlertDialogAction onClick={handleDeleteData} disabled={isLoading}>
            削除
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
