import { createFileRoute } from '@tanstack/react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { extendMembership, getPayments } from '@/services/payment.services'

const AdminPayments = () => {
  const queryClient = useQueryClient()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDuration, setSelectedDuration] = useState<string>('1') // Default to 1 month

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

  const handleExtendMembership = (userId: string) => {
    mutation.mutate({ userId, duration: selectedDuration })
  }

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
      ) : filteredPayments.length === 0 ? (
        <p>No payments found.</p>
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
                  {user.membershipExpiresAt &&
                  new Date(user.membershipExpiresAt) > new Date()
                    ? 'Paid'
                    : 'Unpaid'}
                </td>
                <td className="py-3 px-4">
                  {user.membershipExpiresAt
                    ? new Date(user.membershipExpiresAt).toLocaleDateString()
                    : 'N/A'}
                </td>
                <td className="py-3 px-4 flex items-center space-x-2">
                  <Select
                    value={selectedDuration}
                    onValueChange={setSelectedDuration}
                    className="max-w-xs"
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Month</SelectItem>
                      <SelectItem value="6">6 Months</SelectItem>
                      <SelectItem value="12">1 Year</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    size="sm"
                    onClick={() => handleExtendMembership(user._id)}
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
