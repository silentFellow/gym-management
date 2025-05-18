import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { getUser } from '@/services/user.services'
import API from '@/api'

dayjs.extend(relativeTime)

export const Route = createFileRoute('/member/payments')({
  component: MemberPaymentsPage,
})

const periods = [
  { label: '1 Month', days: 30, price: 499 },
  { label: '6 Months', days: 180, price: 2599 },
  { label: '1 Year', days: 365, price: 4999 },
]

function MemberPaymentsPage() {
  const userId = localStorage.getItem('user_id') as string
  const [selected, setSelected] = useState(periods[0])
  const [membershipExpiresAt, setMembershipExpiresAt] = useState<Date | null>(
    null,
  )

  const { data: user, isLoading } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => getUser(userId),
  })

  // Update membership expiration when user data loads
  useEffect(() => {
    if (user?.membershipExpiresAt) {
      setMembershipExpiresAt(new Date(user.membershipExpiresAt))
    }
  }, [user?.membershipExpiresAt])

  const handlePayment = async () => {
    try {
      const { data } = await API.post('/payments/create-order', {
        amount: selected.price * 100, // Razorpay expects paise
      })

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        order_id: data.id,
        name: 'Samson Gym Membership',
        description: selected.label,
        handler: async function (response: any) {
          await API.post('/payments/verify', {
            ...response,
            userId,
            periodInDays: selected.days,
          })
          toast.success('Payment successful and membership updated')
          setMembershipExpiresAt(
            new Date(Date.now() + selected.days * 24 * 60 * 60 * 1000),
          )
        },
        theme: {
          color: '#4ade80',
        },
      }

      const rzp = new (window as any).Razorpay(options)
      rzp.open()
    } catch (err) {
      console.error(err)
      toast.error('Payment failed')
    }
  }

  const status = membershipExpiresAt
    ? dayjs(membershipExpiresAt).isBefore(dayjs())
      ? 'Expired'
      : `Expires ${dayjs().to(membershipExpiresAt)}`
    : 'No membership'

  if (isLoading || !user) return <div className="p-6">Loading...</div>

  return (
    <div className="p-6 space-y-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold">Membership Payments</h2>

      <Card>
        <CardContent className="p-4">
          <p className="mb-2 text-lg">
            Current Status:{' '}
            <span
              className={`font-medium ${status === 'Expired' ? 'text-red-600' : 'text-green-600'}`}
            >
              {status}
            </span>
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 space-y-4">
          <h3 className="text-lg font-semibold">Choose Duration</h3>
          <div className="flex gap-4 flex-wrap">
            {periods.map((p) => (
              <Button
                key={p.label}
                variant={selected.label === p.label ? 'default' : 'outline'}
                onClick={() => setSelected(p)}
              >
                {p.label} - ₹{p.price}
              </Button>
            ))}
          </div>
          <Button onClick={handlePayment} className="mt-4 w-full">
            Pay ₹{selected.price} with Razorpay
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
