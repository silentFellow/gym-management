import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { fetchAttendanceSummaries } from '@/services/attendance.services'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'

const AdminAttendance = () => {
  const [searchTerm, setSearchTerm] = useState('')

  const { data = [], isLoading } = useQuery({
    queryKey: ['attendance', 'summaries'],
    queryFn: fetchAttendanceSummaries,
  })

  const filteredData = data.filter((user: any) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Attendance Monitoring</h1>

      <Input
        placeholder="Search by username"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-sm"
      />

      {isLoading ? (
        <div className="text-center text-muted-foreground mt-6">
          Loading data...
        </div>
      ) : filteredData.length === 0 ? (
        <div className="text-center text-muted-foreground mt-6">
          No users found.
        </div>
      ) : (
        <table className="min-w-full bg-white shadow-lg rounded-lg overflow-hidden text-sm">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className="py-3 px-4 text-left">User</th>
              <th className="py-3 px-4 text-left">Attendance %</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((user: any) => (
              <tr key={user.id} className="border-b">
                <td className="py-3 px-4">{user.username}</td>
                <td className="py-3 px-4">{user.attendancePercentage}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export const Route = createFileRoute('/admin/attendance')({
  component: AdminAttendance,
})
