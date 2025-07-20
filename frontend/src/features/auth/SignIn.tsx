import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useState } from "react"
import { z } from "zod"
import { Link, useNavigate } from "react-router-dom"

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
import { signInSchema } from "@/features/auth/types/signInSchema"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { AlertCircle } from "lucide-react"
import { resetPasswordSchema } from "./types/resetPasswordSchema"
import { useAuth } from "./hooks/useAuth"

function SignInForm() {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [authError, setAuthError] = useState<string | null>(null)
  const [isForgotPassword, setIsForgotPassword] = useState(false)
  const [email, setEmail] = useState<string | null>(null)
  const [isCodeSent, setIsCodeSent] = useState(false)
  const [verificationCode, setVerificationCode] = useState("")
  const [verificationError, setVerificationError] = useState<string | null>(
    null
  )

  const navigate = useNavigate()

  const { signIn, forgetPassword, resendOtp } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  })

  // This form data is for reset button
  const {
    register: registerReset,
    handleSubmit: handleSubmitReset,
    formState: { errors: resetErrors },
  } = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
  })

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    const { identifier, password } = data
    if (password.trim() === "") {
      return
    }

    setIsSubmitting(true)
    setAuthError(null)

    const { success, error } = await signIn({ identifier, password })

    if (success) {
      navigate("/")
    } else {
      console.error("Error while signing", error)
      setAuthError("Error while signing")
    }
    setIsSubmitting(false)
  }

  const sendCode = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) {
      return
    }

    setIsSubmitting(true)
    setAuthError(null)

    const { success, error } = await resendOtp({ identifier: email })

    if (success) {
      setIsCodeSent(true)
    } else {
      console.error("Error while sending reset code", error)
      setAuthError("Error while sending code")
    }

    setIsSubmitting(false)
  }

  const handleResetVerification = async (
    data: z.infer<typeof resetPasswordSchema>
  ) => {
    if (verificationCode.trim().length !== 6 || !email) {
      return
    }

    setIsSubmitting(true)
    setVerificationError(null)

    const { success, error } = await forgetPassword({
      identifier: email,
      otpCode: verificationCode,
      password: data.password,
    })

    if (!success) {
      console.error("Error verifying otp", error)
      setAuthError("Error verifying otp")
    }

    setIsSubmitting(false)
  }

  const handleResendCode = async () => {}

  if (isCodeSent) {
    return (
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm mx-auto">
          <Card className="pl-[10%]">
            <CardHeader>
              <CardTitle className="text-2xl">Email Verification</CardTitle>
              <CardDescription>
                Enter new password and one-time OTP below
              </CardDescription>
            </CardHeader>
            <CardContent>
              {verificationError && (
                <div className="bg-destructive p-4 rounded-lg mb-6 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  <p>{verificationError}</p>
                </div>
              )}
              <form
                autoComplete="off"
                onSubmit={handleSubmitReset(handleResetVerification)}
              >
                <div className="grid gap-2">
                  <Label htmlFor="password">New Password</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    {...registerReset("password")}
                  />
                  <p className="text-xs text-destructive" role="alert">
                    {errors.password?.message}
                  </p>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    required
                    {...registerReset("passwordConfirmation")}
                  />
                  <p className="text-xs text-destructive" role="alert">
                    {resetErrors.passwordConfirmation?.message}
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Your one-time OTP</Label>
                  <InputOTP
                    maxLength={6}
                    value={verificationCode}
                    onChange={(code) => setVerificationCode(code)}
                    className="mx-auto"
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
                <div>
                  <Button type="submit" className="cursor-pointer my-3">
                    {isSubmitting ? "Resetting..." : "Reset"}
                  </Button>
                </div>
              </form>
              <p className="text-sm">
                Did not receive a code?{" "}
                <Button
                  onClick={handleResendCode}
                  variant={"ghost"}
                  className="hover:underline cursor-pointer"
                >
                  Resend code
                </Button>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (isForgotPassword) {
    return (
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <div className={"flex flex-col gap-6"}>
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Reset Password</CardTitle>
                <CardDescription>
                  Enter your email to reset password
                </CardDescription>
              </CardHeader>
              <CardContent>
                {authError && (
                  <div className="bg-destructive p-4 rounded-lg mb-6 flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    <p>{authError}</p>
                  </div>
                )}
                <form autoComplete="off" onSubmit={sendCode}>
                  <div className="flex flex-col gap-6">
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="m@example.com"
                        onChange={(e) => setEmail(e.target.value)}
                        autoFocus
                        required
                      />
                      <p className="text-xs text-destructive" role="alert">
                        {errors.identifier?.message}
                      </p>
                    </div>
                    <Button type="submit" className="w-full cursor-pointer">
                      {isSubmitting ? "Sending code..." : "Send code"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className={"flex flex-col gap-6"}>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Sign In</CardTitle>
              <CardDescription>
                Enter username or email to sign in
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
                <div className="flex flex-col gap-2">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Username or email</Label>
                    <Input
                      id="identifier"
                      type="text"
                      placeholder="username or m@example.com"
                      autoFocus
                      required
                      {...register("identifier")}
                    />
                    <p className="text-xs text-destructive" role="alert">
                      {errors.identifier?.message}
                    </p>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      required
                      {...register("password")}
                    />
                    <p className="text-xs text-destructive" role="alert">
                      {errors.password?.message}
                    </p>
                  </div>
                  <Button type="submit" className="w-full cursor-pointer">
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
