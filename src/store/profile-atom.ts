import { atom } from 'jotai'

import type { Database } from '@/lib/database.types'

type ProfileType = Database['public']['Tables']['profiles']['Row']

export const profileAtom = atom<ProfileType>({
  id: '',
  username: '',
  email: '',
  avatar_url: '',
  introduce: '',
  twitter_url: '',
  github_url: '',
  website_url: '',
})
