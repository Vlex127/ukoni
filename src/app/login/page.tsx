"use client"

import { useRouter } from "next/navigation"
import { LoginForm } from "@/components/auth/login-form"
import { useAuth } from "@/contexts/auth-context"

export default function LoginPage() {
  const router = useRouter()
  const { user } = useAuth()

  const handleSuccess = () => {
    router.push("/")
  }

  if (user) {
    router.push("/")
    return null
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <LoginForm onSuccess={handleSuccess} />
    </div>
  )
}
