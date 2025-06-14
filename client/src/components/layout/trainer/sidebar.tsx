import { useState } from 'react'
import { Link, useMatchRoute, useNavigate } from '@tanstack/react-router'
import { FaBars, FaTimes } from 'react-icons/fa'
import { signout } from '@/services/auth.services'

const TrainerSidebar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()
  const matchRoute = useMatchRoute()

  const isActive = (path: string) => {
    return matchRoute({ to: path })
  }

  return (
    <>
      {/* Topbar for small screens */}
      <div className="md:hidden fixed top-4 left-4 z-50 bg-gray-800 text-white p-2 rounded shadow-lg">
        <button onClick={() => setIsOpen(true)} className="text-2xl">
          <FaBars />
        </button>
      </div>

      {/* Sidebar for md+ */}
      <div className="hidden md:flex flex-col w-64 bg-gray-800 text-white p-5 h-screen">
        <h2 className="text-2xl font-bold text-center mb-6">
          Samson Gym Trainer
        </h2>
        <div className="flex-1 overflow-y-auto">
          <ul className="space-y-4">
            {[
              ['/trainer/trainees', 'My Trainees'],
              ['/trainer/assign-work', 'Assign Workouts'],
            ].map(([path, label]) => (
              <li key={path}>
                <Link
                  to={path}
                  className={`block p-2 rounded ${
                    isActive(path) ? 'bg-gray-700' : 'hover:bg-gray-700'
                  }`}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <button
          onClick={() => {
            signout()
            navigate({ to: '/login' })
          }}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-medium p-2 rounded mt-6"
        >
          Logout
        </button>
      </div>

      {/* Mobile Sidebar */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black opacity-50 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed top-0 left-0 w-64 h-full bg-gray-800 text-white p-5 z-50 shadow-lg flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Samson Gym Admin</h2>
              <button onClick={() => setIsOpen(false)} className="text-2xl">
                <FaTimes />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <ul className="space-y-4">
                {[
                  ['/trainer/trainees', 'My Trainees'],
                  ['/trainer/assign-work', 'Assign Workouts'],
                ].map(([path, label]) => (
                  <li key={path}>
                    <Link
                      to={path}
                      onClick={() => setIsOpen(false)}
                      className={`block p-2 rounded ${
                        isActive(path) ? 'bg-gray-700' : 'hover:bg-gray-700'
                      }`}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <button
              onClick={() => {
                setIsOpen(false)
                signout()
                navigate('/login')
              }}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-medium p-2 rounded mt-6"
            >
              Logout
            </button>
          </div>
        </>
      )}
    </>
  )
}

export default TrainerSidebar
