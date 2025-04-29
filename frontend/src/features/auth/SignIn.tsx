import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useState } from "react"
import { z } from "zod"
import { useSignIn } from "@clerk/clerk-react"
import { Link } from "react-router-dom"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signInSchema } from "@/features/auth/types/SignInSchema"
import { AlertCircle } from "lucide-react"

function SignInForm() {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [authError, setAuthError] = useState<string | null>(null)
  const [isForgotPassword, setIsForgotPassword] = useState(false)
  const [forgotEmail, setForgotEmail] = useState<string | null>(null)

  const { signIn, isLoaded, setActive } = useSignIn()

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })


  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    const { email, password } = data
    if (password.trim() === "" || !isLoaded) {
      return
    }

    setIsSubmitting(true)
    setAuthError(null)

    try {
      const response = await signIn.create({
        identifier: email,
        password: password
      })

      await setActive({
        session: response.createdSessionId,
        redirectUrl: "/"
      })
    } catch (error) {
      console.error("Error while signing", error)

      setAuthError("Error while signing")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO handle forgot email
  }

  if (isForgotPassword) {
    return <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className={"flex flex-col gap-6"}>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Reset Password</CardTitle>
              <CardDescription>
                Enter your email below to reset password
              </CardDescription>
            </CardHeader>
            <CardContent>
              {authError && (
                <div className="bg-destructive p-4 rounded-lg mb-6 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  <p>{authError}</p>
                </div>
              )}
              <form autoComplete="off" onSubmit={handleForgotPassword}>
                <div className="flex flex-col gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      onChange={(e) => setForgotEmail(e.target.value)}
                      autoFocus
                      required
                    />
                    <p className="text-xs text-destructive" role="alert">{errors.email?.message}</p>
                  </div>
                  <Button
                    type="submit"
                    className="w-full cursor-pointer"
                  >
                    {isSubmitting ? "Resetting password..." : "Reset password"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className={"flex flex-col gap-6"}>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Sign In</CardTitle>
              <CardDescription>
                Enter your email below to to sign in
              </CardDescription>
            </CardHeader>
            <CardContent>
              {authError && (
                <div className="bg-destructive p-4 rounded-lg mb-6 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  <p>{authError}</p>
                </div>
              )}
              <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      autoFocus
                      required
                      {...register("email")}
                    />
                    <p className="text-xs text-destructive" role="alert">{errors.email?.message}</p>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      required
                      {...register("password")}
                    />
                    <p className="text-xs text-destructive" role="alert">{errors.password?.message}</p>
                  </div>
                  <Button
                    type="submit"
                    className="w-full cursor-pointer"
                  >
                    {isSubmitting ? "Signing in..." : "Sign in"}
                  </Button>
                  <span>
                    <Button
                      variant={"ghost"}
                      onClick={() => setIsForgotPassword(true)}
                      className="cursor-pointer underline text-xs"
                    >
                      Forgot password
                    </Button>
                  </span>
                  <Button variant="outline" className="w-full" disabled>
                    Continue with Google
                  </Button>
                </div>
                <div className="mt-4 text-center text-sm">
                  Do not have an account?{" "}
                  <Link to="/sign-up" className="underline underline-offset-4">
                    Sign up
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default SignInForm