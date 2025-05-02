import { createFileRoute } from '@tanstack/react-router'
import AdminLayout from '@/components/layout/admin/layout'

export const Route = createFileRoute('/admin')({
  component: AdminLayout,
})
