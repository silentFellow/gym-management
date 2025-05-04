import { useEffect } from 'react'
import { Outlet, useNavigate } from '@tanstack/react-router'
import Sidebar from './sidebar'

const MemberLayout = () => {
  const navigate = useNavigate()

  useEffect(() => {
    navigate({ to: '/member/dashboard' })
  }, [navigate])

  return (
    <div className="flex h-screen bg-gray-100 relative">
      <Sidebar />
      <div className="flex-1 overflow-auto px-4 py-4 md:p-6 pt-18 md:pt-6">
        <Outlet />
      </div>
    </div>
  )
}

export default MemberLayout
