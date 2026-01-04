"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useSession } from "next-auth/react"
import { LoginForm } from "@/components/auth/login-form"

export default function LoginPage() {
  const router = useRouter()
  const { data: session, status } = useSession()

  const handleSuccess = () => {
    router.push("/admin")
  }

  useEffect(() => {
    if (status === "authenticated" && session) {
      router.push("/admin")
    }
  }, [session, status, router])

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <LoginForm onSuccess={handleSuccess} />
    </div>
  )
}
