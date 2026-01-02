"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation';
import { getApiUrl } from '@/lib/api';

interface User {
  id: string
  username: string
  email: string
  full_name?: string
  bio?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  register: (userData: RegisterData) => Promise<void>
  logout: () => void
  isLoading: boolean
  error: string | null
}

interface RegisterData {
  username: string
  email: string
  password: string
  full_name?: string
  bio?: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (token) {
      fetchCurrentUser()
    } else {
      setIsLoading(false)
    }
  }, [])

  const fetchCurrentUser = async () => {
    try {
      const token = localStorage.getItem('access_token')
      if (!token) {
        setIsLoading(false)
        return
      }

      const response = await fetch(getApiUrl('api/v1/auth/me'), {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      })

      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
      } else {
        localStorage.removeItem('access_token')
      }
    } catch (error) {
      console.error('Failed to fetch current user:', error)
      localStorage.removeItem('access_token')
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('username', email)  // Backend expects 'username' field but we pass email
      formData.append('password', password)

      const loginUrl = getApiUrl('api/v1/auth/login');
      console.log('Attempting login to:', loginUrl)
      console.log('Form data:', { email, password: '***' })

      const response = await fetch(loginUrl, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
        },
        mode: 'cors',
      })

      console.log('Response status:', response.status)
      console.log('Response headers:', Object.fromEntries(response.headers.entries()))

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const errorMessage = errorData.detail || `HTTP ${response.status}: ${response.statusText}`
        throw new Error(errorMessage)
      }

      const data = await response.json()
      console.log('Login successful:', data)
      localStorage.setItem('access_token', data.access_token)
      
      await fetchCurrentUser()
      
      // Redirect to admin page after successful login
      window.location.href = '/admin'
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Network error occurred. Please check if the backend server is running.'
      console.error('Login error:', error)
      setError(errorMessage)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (userData: RegisterData) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(getApiUrl('api/v1/auth/register'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(userData),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const errorMessage = errorData.detail || `HTTP ${response.status}: ${response.statusText}`
        throw new Error(errorMessage)
      }

      const newUser = await response.json()
      
      await login(userData.email, userData.password)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Network error occurred. Please check if the backend server is running.'
      setError(errorMessage)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('access_token')
    setUser(null)
    setError(null)
  }

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    isLoading,
    error,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
