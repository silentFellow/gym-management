import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { toast } from 'sonner'
import { signin } from '@/services/auth.services'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { isAuthenticated } from '@/lib/utils'

const SignupRoute = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const navigate = useNavigate()

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      toast.error("Passwords don't match")
      return
    }

    try {
      const res = await signin({ username, password, confirmPassword })
      if (res?.status === 200) {
        toast.success('Account created! You can now log in.')
        navigate({ to: '/login' })
      } else {
        toast.error(res?.data?.message || 'Sign up failed')
      }
    } catch (err) {
      toast.error('Something went wrong')
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-black via-gray-900 to-gray-800 overflow-hidden">
      {/* Decorative blur elements */}
      <div className="absolute w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse -top-10 -left-20" />
      <div className="absolute w-96 h-96 bg-rose-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse -bottom-20 -right-10" />

      <Card className="backdrop-blur-xl bg-white/5 border border-white/10 shadow-xl w-full max-w-lg transition-transform duration-300 ease-out hover:scale-[1.02]">
        <CardHeader>
          <CardTitle className="text-center text-4xl text-white font-bold tracking-wide">
            Create Your Account 💪
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          <div className="space-y-2">
            <Label className="text-white text-sm">Username</Label>
            <Input
              className="bg-white/10 text-white placeholder:text-white/40 no-focus"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Choose a username"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-white text-sm">Password</Label>
            <Input
              type="password"
              className="bg-white/10 text-white placeholder:text-white/40 no-focus"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-white text-sm">Confirm Password</Label>
            <Input
              type="password"
              className="bg-white/10 text-white placeholder:text-white/40 no-focus"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repeat your password"
            />
          </div>
          <Button
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-all"
            onClick={handleSignup}
          >
            Sign Up
          </Button>
          <p className="text-sm text-center text-white/80">
            Already have an account?{' '}
            <a
              href="/login"
              className="text-indigo-300 underline hover:text-white"
            >
              Log in
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export const Route = createFileRoute('/signup')({
  beforeLoad: async () => {
    if (await isAuthenticated()) {
      throw redirect({
        to: '/',
      })
    }
  },
  component: SignupRoute,
})
