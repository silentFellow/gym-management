import { createFileRoute, redirect } from '@tanstack/react-router'
import { isAuthenticated } from '@/lib/utils'

export const Route = createFileRoute('/')({
  beforeLoad: async () => {
    if (!(await isAuthenticated())) {
      throw redirect({
        to: '/login',
        search: {
          redirect: '/',
        },
      })
    }
  },
  component: App,
})

function App() {
  return <h1>hello from silentFellow</h1>
}
