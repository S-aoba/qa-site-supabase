import { atom } from 'jotai'

export const editedAnswerAtom = atom<string>('')
export const isAnswerEditModeAtom = atom<boolean>(false)
