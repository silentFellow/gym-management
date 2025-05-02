import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'

const AdminTrainers = () => {
  const [trainers, setTrainers] = useState([])

  useEffect(() => {
    // Replace with your API call
    const fetchTrainers = async () => {
      const response = await fetch('/api/trainers')
      const data = await response.json()
      setTrainers(data)
    }
    fetchTrainers()
  }, [])

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Manage Trainers</h1>
      <table className="min-w-full bg-white shadow-lg rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-800 text-white">
            <th className="py-3 px-6">Name</th>
            <th className="py-3 px-6">Specialization</th>
            <th className="py-3 px-6">Actions</th>
          </tr>
        </thead>
        <tbody>
          {trainers.map((trainer: any) => (
            <tr key={trainer.id} className="border-b">
              <td className="py-3 px-6">{trainer.name}</td>
              <td className="py-3 px-6">{trainer.specialization}</td>
              <td className="py-3 px-6">
                <Button>Edit</Button>
                <Button className="ml-2">Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export const Route = createFileRoute('/admin/trainers')({
  component: AdminTrainers,
})
