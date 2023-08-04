import { useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

export const useContentEditor = ({
  handleOnChange,
  content,
}: {
  handleOnChange?: (...event: string[]) => void
  content: string
}) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    onUpdate({ editor }) {
      if (handleOnChange !== undefined) {
        handleOnChange(editor.getHTML())
      }
    },
  })
  return { editor }
}
