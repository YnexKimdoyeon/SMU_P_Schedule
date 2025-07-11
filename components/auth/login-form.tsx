"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Mail, Lock, User, Info } from "lucide-react"

export function LoginForm() {
  const { signIn, signUp, loading } = useAuth()
  const { toast } = useToast()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  })

  const [signupData, setSignupData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
  })

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const { error } = await signIn(loginData.email, loginData.password)

    if (error) {
      setError(error.message)
      toast({
        variant: "destructive",
        title: "로그인 실패",
        description: error.message,
      })
    } else {
      toast({
        title: "로그인 성공",
        description: "환영합니다!",
      })
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (signupData.password !== signupData.confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.")
      toast({
        variant: "destructive",
        title: "회원가입 실패",
        description: "비밀번호가 일치하지 않습니다.",
      })
      return
    }

    if (signupData.password.length < 6) {
      setError("비밀번호는 최소 6자 이상이어야 합니다.")
      toast({
        variant: "destructive",
        title: "회원가입 실패",
        description: "비밀번호는 최소 6자 이상이어야 합니다.",
      })
      return
    }

    const { error } = await signUp(signupData.email, signupData.password, signupData.fullName)

    if (error) {
      setError(error.message)
      toast({
        variant: "destructive",
        title: "회원가입 실패",
        description: error.message,
      })
    } else {
      setSuccess("회원가입이 완료되었습니다!")
      toast({
        title: "회원가입 성공",
        description: "회원가입이 완료되었습니다!",
      })
      setSignupData({
        email: "",
        password: "",
        confirmPassword: "",
        fullName: "",
      })
    }
  }

  const handleDemoLogin = () => {
    setLoginData({
      email: "demo@example.com",
      password: "123456",
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">팀 협업 플랫폼</CardTitle>
          <CardDescription>로그인하여 프로젝트를 관리하세요</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-4">
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>데모 계정:</strong> demo@example.com / 123456
              <Button variant="link" size="sm" className="ml-2 p-0 h-auto" onClick={handleDemoLogin}>
                자동 입력
              </Button>
            </AlertDescription>
          </Alert>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">로그인</TabsTrigger>
              <TabsTrigger value="signup">회원가입</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">이메일</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="이메일을 입력하세요"
                      className="pl-10"
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-password">비밀번호</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="비밀번호를 입력하세요"
                      className="pl-10"
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      required
                    />
                  </div>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  로그인
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">이름</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="이름을 입력하세요"
                      className="pl-10"
                      value={signupData.fullName}
                      onChange={(e) => setSignupData({ ...signupData, fullName: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-email">이메일</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="이메일을 입력하세요"
                      className="pl-10"
                      value={signupData.email}
                      onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-password">비밀번호</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="비밀번호를 입력하세요 (최소 6자)"
                      className="pl-10"
                      value={signupData.password}
                      onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-confirm-password">비밀번호 확인</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signup-confirm-password"
                      type="password"
                      placeholder="비밀번호를 다시 입력하세요"
                      className="pl-10"
                      value={signupData.confirmPassword}
                      onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                      required
                    />
                  </div>
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {success && (
                  <Alert>
                    <AlertDescription>{success}</AlertDescription>
                  </Alert>
                )}

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  회원가입
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
