import { createFileRoute, redirect } from '@tanstack/react-router'
import AdminLayout from '@/components/layout/admin/layout'

export const Route = createFileRoute('/admin')({
  beforeLoad: () => {
    const isAdmin = localStorage.getItem('role') === 'admin'
    if (!isAdmin) throw redirect({ to: '/login' })
  },
  component: AdminLayout,
})
