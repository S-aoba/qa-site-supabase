export const useTimer = () => {
  // 1秒待たせる関数
  const waitSeconds = (ms: number) => {
    return new Promise((resolve) => {
      return setTimeout(resolve, ms)
    })
  }

  return { waitSeconds }
}
