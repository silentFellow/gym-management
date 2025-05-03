import { useEffect } from 'react'
import { Outlet, useNavigate } from '@tanstack/react-router'
import TrainerSidebar from './sidebar'

const TrainerLayout = () => {
  const navigate = useNavigate()

  useEffect(() => {
    navigate({ to: '/trainer/trainees' })
  }, [navigate])

  return (
    <div className="flex h-screen bg-gray-100 relative">
      <TrainerSidebar />
      <div className="flex-1 overflow-auto px-4 py-4 md:p-6 pt-18 md:pt-6">
        <Outlet />
      </div>
    </div>
  )
}

export default TrainerLayout
