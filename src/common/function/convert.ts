export const capitalizeFirstLetter = (language: string) => {
  if (language.length === 0) {
    return language // 空文字列の場合はそのまま返す
  }

  const firstLetter = language.charAt(0).toLowerCase()
  const restOfString = language.slice(1)

  return firstLetter + restOfString
}
