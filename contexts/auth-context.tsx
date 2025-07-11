"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { apiService } from "@/lib/api"

interface User {
  id: string
  email: string
  fullName: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // 앱 시작 시 토큰 확인
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (apiService.isAuthenticated()) {
          const userData = await apiService.getCurrentUser()
          setUser(userData)
        }
      } catch (error) {
        console.error('인증 확인 실패:', error)
        apiService.logout()
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const signIn = async (email: string, password: string) => {
    setLoading(true)
    
    try {
      const response = await apiService.login({ username: email, password })
      setUser(response.user)
      return { error: null }
    } catch (error: any) {
      return { error: { message: error.message || '로그인에 실패했습니다.' } }
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string, fullName: string) => {
    setLoading(true)
    
    try {
      const response = await apiService.signup({ 
        username: email, 
        email, 
        password, 
        name: fullName 
      })
      setUser(response.user)
      return { error: null }
    } catch (error: any) {
      return { error: { message: error.message || '회원가입에 실패했습니다.' } }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    apiService.logout()
    setUser(null)
  }

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
