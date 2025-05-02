import API from '@/api'

export const getPayments = async () => {
  const res = await API.get('/payments')
  return res.data
}

export const extendMembership = async ({
  userId,
  duration,
}: {
  userId: string
  duration: string
}) => {
  const response = await API.post('/payments/extend-membership', {
    userId,
    duration,
  })
  return response.data
}
