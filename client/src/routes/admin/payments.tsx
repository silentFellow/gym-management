import { createFileRoute } from '@tanstack/react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import { extendMembership, getPayments } from '@/services/payment.services'

const AdminPayments = () => {
  const queryClient = useQueryClient()
  const [searchTerm, setSearchTerm] = useState('')

  const { data: payments = [], isLoading } = useQuery({
    queryKey: ['payments'],
    queryFn: getPayments,
  })

  const mutation = useMutation({
    mutationFn: extendMembership,
    onSuccess: () => {
      toast.success('Membership extended!')
      queryClient.invalidateQueries({ queryKey: ['payments'] })
    },
    onError: () => toast.error('Failed to extend membership'),
  })

  const filteredPayments = payments
    .filter((user: any) => user.role === 'member')
    .filter((user: any) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()),
    )

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold mb-4">Payments & Validity</h1>

      <Input
        placeholder="Search by username"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-sm"
      />

      {isLoading ? (
        <Skeleton className="h-24 w-full" />
      ) : (
        <table className="min-w-full bg-white shadow-lg rounded-lg overflow-hidden text-sm">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className="py-3 px-4 text-left">User</th>
              <th className="py-3 px-4 text-left">Payment Status</th>
              <th className="py-3 px-4 text-left">Validity</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.map((user: any) => (
              <tr key={user._id} className="border-b">
                <td className="py-3 px-4">{user.username}</td>
                <td className="py-3 px-4">
                  {user.hasPaid ? 'Paid' : 'Unpaid'}
                </td>
                <td className="py-3 px-4">
                  {user.membershipExpiresAt
                    ? new Date(user.membershipExpiresAt).toLocaleDateString()
                    : 'N/A'}
                </td>
                <td className="py-3 px-4">
                  <Button
                    size="sm"
                    onClick={() => mutation.mutate(user._id)}
                    disabled={mutation.isLoading}
                  >
                    Extend Validity
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export const Route = createFileRoute('/admin/payments')({
  component: AdminPayments,
})
