import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

const AdminAttendance = () => {
  const [attendance, setAttendance] = useState([])

  useEffect(() => {
    // Replace with your API call
    const fetchAttendance = async () => {
      const response = await fetch('/api/attendance')
      const data = await response.json()
      setAttendance(data)
    }
    fetchAttendance()
  }, [])

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Attendance Monitoring</h1>
      <table className="min-w-full bg-white shadow-lg rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-800 text-white">
            <th className="py-3 px-6">User</th>
            <th className="py-3 px-6">Date</th>
            <th className="py-3 px-6">Status</th>
          </tr>
        </thead>
        <tbody>
          {attendance.map((record: any) => (
            <tr key={record.id} className="border-b">
              <td className="py-3 px-6">{record.username}</td>
              <td className="py-3 px-6">{record.date}</td>
              <td className="py-3 px-6">{record.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export const Route = createFileRoute('/admin/attendance')({
  component: AdminAttendance,
})
