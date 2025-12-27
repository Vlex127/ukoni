"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sparkles } from "lucide-react"
import Link from "next/link"

interface SignupFormProps {
  onSuccess?: () => void
}

export function SignupForm({ onSuccess }: SignupFormProps) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    full_name: "",
    bio: ""
  })
  const [isLoading, setIsLoading] = useState(false)
  const { register, error } = useAuth()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match")
      setIsLoading(false)
      return
    }

    try {
      await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        full_name: formData.full_name || undefined,
        bio: formData.bio || undefined
      })
      onSuccess?.()
    } catch (error) {
      console.error("Registration failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 font-bold text-xl tracking-tight mb-4">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
            <Sparkles size={16} fill="currentColor" />
          </div>
          Ukoni
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Create your account</h2>
        <p className="text-gray-600 mt-2">Join our community today</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="username">Username *</Label>
            <Input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              placeholder="Choose a username"
              required
              disabled={isLoading}
            />
          </div>
          
          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              required
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="password">Password *</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              required
              disabled={isLoading}
            />
          </div>
          
          <div>
            <Label htmlFor="confirmPassword">Confirm Password *</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              required
              disabled={isLoading}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="full_name">Full Name</Label>
          <Input
            id="full_name"
            name="full_name"
            type="text"
            value={formData.full_name}
            onChange={handleChange}
            placeholder="John Doe"
            disabled={isLoading}
          />
        </div>

        <div>
          <Label htmlFor="bio">Bio</Label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Tell us about yourself..."
            rows={3}
            className="w-full min-h-[80px] rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm transition-colors placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
            disabled={isLoading}
          />
        </div>

        {error && (
          <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg">
            {error}
          </div>
        )}

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? "Creating account..." : "Create account"}
        </Button>
      </form>

      <div className="text-center mt-6">
        <p className="text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
