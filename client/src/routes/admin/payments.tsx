import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'

const AdminPayments = () => {
  const [payments, setPayments] = useState([])

  useEffect(() => {
    // Replace with your API call
    const fetchPayments = async () => {
      const response = await fetch('/api/payments')
      const data = await response.json()
      setPayments(data)
    }
    fetchPayments()
  }, [])

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Payments & Validity</h1>
      <table className="min-w-full bg-white shadow-lg rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-800 text-white">
            <th className="py-3 px-6">User</th>
            <th className="py-3 px-6">Payment Status</th>
            <th className="py-3 px-6">Validity</th>
            <th className="py-3 px-6">Actions</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment: any) => (
            <tr key={payment.id} className="border-b">
              <td className="py-3 px-6">{payment.username}</td>
              <td className="py-3 px-6">{payment.status}</td>
              <td className="py-3 px-6">{payment.validity}</td>
              <td className="py-3 px-6">
                <Button>Extend Validity</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export const Route = createFileRoute('/admin/payments')({
  component: AdminPayments,
})
