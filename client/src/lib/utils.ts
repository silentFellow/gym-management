import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import axios from 'axios'
import { getAccessToken, getRefreshToken, isExpired } from './jwt'
import type { ClassValue } from 'clsx'

const cn = (...inputs: Array<ClassValue>) => {
  return twMerge(clsx(inputs))
}

const isAuthenticated = async (): Promise<boolean> => {
  const accessToken = getAccessToken()
  const refreshToken = getRefreshToken()
  if (!accessToken || !refreshToken) return false

  if (!isExpired(accessToken)) return true
  if (isExpired(refreshToken)) return false

  try {
    const newAccessTokenReq = await axios.get(`/users/refresh/${refreshToken}`)
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

type Roles = 'trainner' | 'admin' | 'member'
const isAllowed = (role: Roles, allowes: Roles): boolean => {
  const priority = {
    admin: 0,
    trainner: 1,
    member: 2,
  }

  return priority[role] <= priority[allowes]
}

export { cn, isAuthenticated, isAllowed }
