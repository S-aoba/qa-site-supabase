import {
  AvatarIcon,
  ChatBubbleIcon,
  EnvelopeClosedIcon,
  ExitIcon,
  GearIcon,
  HomeIcon,
  LockClosedIcon,
  QuestionMarkCircledIcon,
  QuestionMarkIcon,
  RocketIcon,
} from '@radix-ui/react-icons'

export const mainNavigation = [
  {
    name: '質問',
    icon: QuestionMarkIcon,
    href: '/',
    hrefList: ['/', '/question-waiting-answers'],
  },
  {
    name: '設定',
    icon: GearIcon,
    href: '/settings/profile',
    hrefList: [
      '/settings/profile',
      '/settings/email',
      '/settings/password',
      '/settings/logout',
      '/settings/my-questions',
      '/settings/questions-answered',
    ],
  },
]

export const subQuestionNavigation = [
  {
    name: '新着の質問',
    icon: HomeIcon,
    href: '/',
  },
  {
    name: '回答募集中',
    icon: RocketIcon,
    href: '/question-waiting-answers',
  },
]

export const subSettingNavigation = [
  {
    name: 'プロフィール',
    icon: AvatarIcon,
    href: '/settings/profile',
  },
  {
    name: '自分の質問',
    icon: QuestionMarkCircledIcon,
    href: '/settings/my-questions',
  },
  {
    name: '自分の回答',
    icon: ChatBubbleIcon,
    href: '/settings/questions-answered',
  },
  {
    name: 'メールアドレス',
    icon: EnvelopeClosedIcon,
    href: '/settings/email',
  },
  {
    name: 'パスワード',
    icon: LockClosedIcon,
    href: '/settings/password',
  },
  {
    name: 'ログアウト',
    icon: ExitIcon,
    href: '/settings/logout',
  },
]

export const settingsPathList = mainNavigation[1].hrefList
