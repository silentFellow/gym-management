import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { toast } from 'sonner'
import { login } from '@/services/auth.services'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { isAuthenticated } from '@/lib/utils'

const LoginRoute = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleLogin = async () => {
    if (!username || !password) {
      toast.error('All fields should be filled')
      return
    }

    try {
      const res = await login({ username, password })
      if (res?.status === 200) {
        localStorage.setItem('user_id', res.data.id)
        localStorage.setItem('access_token', res.data.access_token)
        localStorage.setItem('refresh_token', res.data.refresh_token)
        localStorage.setItem('role', res.data.role)

        toast.success('Logged in successfully')
        navigate({ to: `/${res.data.role}` })
      } else {
        toast.error('Invalid credentials')
      }
    } catch (err) {
      toast.error('Login failed')
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-black via-gray-900 to-gray-800 overflow-hidden">
      {/* Decorative blur elements */}
      <div className="absolute w-96 h-96 bg-rose-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse -top-10 -left-20" />
      <div className="absolute w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse -bottom-20 -right-10" />

      <Card className="backdrop-blur-xl bg-white/5 border border-white/10 shadow-xl w-full max-w-lg transition-transform duration-300 ease-out hover:scale-[1.02]">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-white text-3xl font-extrabold">
            Welcome Back to Samson Gym
          </CardTitle>
          <p className="text-sm text-gray-300 font-light">
            Track your strength. Own your goals.
          </p>
        </CardHeader>

        <CardContent className="space-y-6 p-6">
          <div className="space-y-2">
            <Label className="text-white text-sm">Username</Label>
            <Input
              className="bg-white/10 text-white placeholder:text-white/40 no-focus"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-white text-sm">Password</Label>
            <Input
              type="password"
              className="bg-white/10 text-white placeholder:text-white/40 no-focus"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </div>
          <Button
            className="w-full bg-red-600 hover:bg-red-700 text-white font-medium transition-all"
            onClick={handleLogin}
          >
            Sign In
          </Button>
          <p className="text-sm text-center text-white/80">
            Don’t have an account?{' '}
            <a
              href="/signup"
              className="text-red-300 underline hover:text-white"
            >
              Sign up
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export const Route = createFileRoute('/login')({
  beforeLoad: async () => {
    if (await isAuthenticated()) {
      throw redirect({
        to: '/',
      })
    }
  },
  component: LoginRoute,
})
