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

export const createRazorpayOrder = async (amount: number) => {
  const res = await API.post('/payments/create-order', { amount })
  return res.data
}

export const verifyRazorpayPayment = async (payload: {
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
  userId: string
  periodInDays: number
}) => {
  const res = await API.post('/payments/verify', payload)
  return res.data
}

export const getMembershipStatus = async (userId: string) => {
  const res = await API.get(`/users/${userId}`)
  return res.data
}
