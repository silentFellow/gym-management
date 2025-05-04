import API from '@/api'

export interface User {
  id: string
  username: string
  role: 'member' | 'trainer' | 'admin'
}

export const getAllUsers = async (): Promise<Array<User>> => {
  const response = await API.get('/users')
  return response.data
}

export const getUser = async (user_id: string): Promise<User> => {
  const response = await API.get(`/users/${user_id}`)
  return response.data
}

export const removeUser = async (id: string): Promise<void> => {
  await API.delete(`/users/${id}`)
}

export const updateUserRole = async ({
  id,
  role,
}: {
  id: string
  role: 'member' | 'trainer' | 'admin'
}): Promise<void> => {
  await API.put(`/users/${id}`, { role })
}
