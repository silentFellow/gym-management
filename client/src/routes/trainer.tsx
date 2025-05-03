import { createFileRoute, redirect } from '@tanstack/react-router'
import TrainerLayout from '@/components/layout/trainer/layout'

export const Route = createFileRoute('/trainer')({
  beforeLoad: () => {
    const isAdmin = localStorage.getItem('role') === 'trainer'
    if (!isAdmin) throw redirect({ to: '/login' })
  },
  component: TrainerLayout,
})
