import API from '@/api'

export const getPayments = async () => {
  const res = await API.get('/payments')
  return res.data
}

export const extendMembership = async (userId: string) => {
  const res = await API.post(`/payments/extend/${userId}`)
  return res.data
}
