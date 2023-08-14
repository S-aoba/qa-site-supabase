import { zodResolver } from '@hookform/resolvers/zod'
import type { Session } from '@supabase/auth-helpers-nextjs'
import { useAtom } from 'jotai'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import type { z } from 'zod'

import { questionSearchSchema } from '@/common/schemas'
import { displayMainNavNameAtom } from '@/store/navigation-atom'
import { profileAtom } from '@/store/profile-atom'

import { mainNavigation, settingsPathList, subQuestionNavigation, subSettingNavigation } from './nav-list-data'

export const useNavigation = () => {
  const [isShowSearchBar, setIsShowSearchBar] = useState(false)

  const pathname = usePathname()

  const router = useRouter()

  const [displayMainNavName, setDisplayMainNavName] = useAtom(displayMainNavNameAtom)
  const [user, setUser] = useAtom(profileAtom)

  const navList = displayMainNavName === '質問' ? subQuestionNavigation : subSettingNavigation

  const onHandleQuestionSearchForm = useForm<z.infer<typeof questionSearchSchema>>({
    resolver: zodResolver(questionSearchSchema),
    defaultValues: {
      q: '',
    },
  })

  const navigationListener = (session: Session | null) => {
    const questionNav = [mainNavigation[0]]
    const authenticatedNavList = session ? mainNavigation : questionNav
    const selectedNav = settingsPathList.includes(pathname) ? '設定' : '質問'

    setDisplayMainNavName(selectedNav)
    return authenticatedNavList
  }

  const searchQuestion = (values: z.infer<typeof questionSearchSchema>) => {
    const { q } = values
    router.push('/questions/search' + '?q=' + q)
    onHandleQuestionSearchForm.reset()
    setIsShowSearchBar(false)
  }

  const handleShowSearchBar = () => {
    setIsShowSearchBar(!isShowSearchBar)
  }
  return {
    pathname,
    displayMainNavName,
    setDisplayMainNavName,
    navigationListener,
    navList,
    user,
    setUser,
    onHandleQuestionSearchForm,
    searchQuestion,
    handleShowSearchBar,
    isShowSearchBar
  }
}
