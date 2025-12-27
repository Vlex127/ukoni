"use client"

import { useRouter } from "next/navigation"
import { SignupForm } from "@/components/auth/signup-form"
import { useAuth } from "@/contexts/auth-context"

export default function SignupPage() {
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
      <SignupForm onSuccess={handleSuccess} />
    </div>
  )
}
