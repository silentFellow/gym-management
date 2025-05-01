import axios from 'axios'

const getAccessToken = (): string | null => localStorage.getItem('access_token')

const getRefreshToken = (): string | null =>
  localStorage.getItem('refresh_token')

const isExpired = (token: string): boolean => {
  try {
    const decoded = JSON.parse(atob(token.split('.')[1]))
    const expiration = decoded.exp

    return Date.now() >= expiration
  } catch (error: unknown) {
    console.log(error)
    return true
  }
}

const isAuthenticated = async (): Promise<boolean> => {
  const accessToken = getAccessToken()
  const refreshToken = getRefreshToken()
  if (!accessToken || !refreshToken) return false

  if (!isExpired(accessToken)) return true
  if (isExpired(refreshToken)) return false

  try {
    const newAccessTokenReq = await axios.get(`/token/refresh/${refreshToken}`)
    if (newAccessTokenReq.status === 200) {
      localStorage.setItem('access_token', newAccessTokenReq.data.access_token)
      localStorage.setItem(
        'refresh_token',
        newAccessTokenReq.data.refresh_token,
      )
    }

    return true
  } catch (error: unknown) {
    console.log(error)
    return false
  }
}

export default isAuthenticated
