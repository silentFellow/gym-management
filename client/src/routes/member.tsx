import { createFileRoute, redirect } from '@tanstack/react-router'
import MemberLayout from '@/components/layout/member/layout'

export const Route = createFileRoute('/member')({
  beforeLoad: () => {
    const isAdmin = localStorage.getItem('role') === 'member'
    if (!isAdmin) throw redirect({ to: '/login' })
  },
  component: MemberLayout,
})
