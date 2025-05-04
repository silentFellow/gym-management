import API from '@/api'

export const getMemberDashboard = async () => {
  const userId = localStorage.getItem('user_id')
  const { data } = await API.get('/members/dashboard', {
    params: { userId },
  })
  return data
}
