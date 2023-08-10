import {
  IconAt,
  IconFriends,
  IconLogout,
  IconMail,
  IconMessage,
  IconPassword,
  IconQuestionMark,
  IconSettings,
  IconUserCircle,
  IconUserQuestion,
} from '@tabler/icons-react'

export const mainNavigation = [
  {
    name: '質問',
    icon: IconQuestionMark,
    href: '/',
    hrefList: ['/', '/question-waiting-answers', '/settings/my-questions', '/settings/questions-answered'],
  },
  {
    name: '設定',
    icon: IconSettings,
    href: '/settings/profile',
    hrefList: ['/settings/profile', '/settings/email', '/settings/password', '/settings/logout'],
  },
]

export const subQuestionNavigation = [
  {
    name: '新着の質問',
    icon: IconFriends,
    href: '/',
  },
  {
    name: '回答募集中',
    icon: IconAt,
    href: '/question-waiting-answers',
  },
]

export const subSettingNavigation = [
  {
    name: 'プロフィール',
    icon: IconUserCircle,
    href: '/settings/profile',
  },
  {
    name: '自分の質問',
    icon: IconUserQuestion,
    href: '/settings/my-questions',
  },
  {
    name: '自分の回答',
    icon: IconMessage,
    href: '/settings/questions-answered',
  },
  {
    name: 'メールアドレス',
    icon: IconMail,
    href: '/settings/email',
  },
  {
    name: 'パスワード',
    icon: IconPassword,
    href: '/settings/password',
  },
  {
    name: 'ログアウト',
    icon: IconLogout,
    href: '/settings/logout',
  },
]


export const shouldShowNavList = mainNavigation[0].hrefList.concat(mainNavigation[1].hrefList)
