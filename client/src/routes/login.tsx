import { createFileRoute } from '@tanstack/react-router'
import { toast } from "sonner"

const LoginRoute = () => {
  return (
    <button onClick={() => toast('hello world from silentFellow')}>
      hello
    </button>
  )
}

export const Route = createFileRoute('/login')({
  component: LoginRoute,
})
