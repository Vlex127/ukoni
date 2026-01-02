"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { LoginForm } from "@/components/auth/login-form"
import { useAuth } from "@/contexts/auth-context"

export default function LoginPage() {
  const router = useRouter()
  const { user } = useAuth()

  const handleSuccess = () => {
    router.push("/")
  }

  useEffect(() => {
    if (user) {
      router.push("/")
    }
  }, [user, router])

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <LoginForm onSuccess={handleSuccess} />
    </div>
  )
}
