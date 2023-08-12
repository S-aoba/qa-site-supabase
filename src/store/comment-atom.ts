import { atom } from 'jotai'

export const editedCommentAtom = atom<string>('')
export const isCommentEditModeAtom = atom<boolean>(false)
export const isDisplayCommentsAtom = atom<boolean>(false)
