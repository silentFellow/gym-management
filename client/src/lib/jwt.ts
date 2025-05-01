const getAccessToken = (): string | null => localStorage.getItem('access_token')

const getRefreshToken = (): string | null =>
  localStorage.getItem('refresh_token')

const isExpired = (token: string): boolean => {
  try {
    const decoded = JSON.parse(atob(token.split('.')[1]))
    const expiration = decoded.exp * 1000

    return Date.now() >= expiration
  } catch (error: unknown) {
    console.log(error)
    return true
  }
}

export { getAccessToken, getRefreshToken, isExpired }
