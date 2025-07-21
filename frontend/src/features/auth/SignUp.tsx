import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useCallback, useEffect, useState } from "react"
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
import { signUpSchema } from "@/features/auth/types/signUpSchema"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { AlertCircle } from "lucide-react"
import { useAuth } from "./hooks/useAuth"
import debounce from "lodash.debounce"
import { cn } from "@/lib/utils"

function SignUpForm() {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [isVerifying, setIsVerifying] = useState<boolean>(false)
  const [verificationCode, setVerificationCode] = useState("")
  const [identifier, setIdentifier] = useState("")
  const [authError, setAuthError] = useState<string | null>(null)
  const [verificationError, setVerificationError] = useState<string | null>(
    null
  )
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(
    null
  )
  const [checkingUsername, setCheckingUsername] = useState(false)

  const navigate = useNavigate()

  const { signUp, verifyOtp, resendOtp, uniqueUserUsername } = useAuth()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      username: "",
      password: "",
      passwordConfirmation: "",
    },
  })

  const usernameValue = watch("username")

  const debouncedSearch = useCallback(
    debounce(async (username: string) => {
      if (!username.trim() || username.trim().length < 4) return

      setCheckingUsername(true)

      const available = await uniqueUserUsername(username.trim())

      setUsernameAvailable(available)
      setCheckingUsername(false)
    }, 500),
    []
  )

  useEffect(() => {
    debouncedSearch(usernameValue?.trim())
  }, [usernameValue])

  const handleVerificationSubmit = async () => {
    if (verificationCode.trim().length !== 6) {
      return
    }

    setIsSubmitting(true)
    setVerificationError(null)

    const { success, error } = await verifyOtp({
      identifier: identifier.trim(),
      otpCode: verificationCode,
    })

    if (success) {
      navigate("/sign-in")
    } else {
      setAuthError("Error verifying otp")
      console.error("Otp verification error", error)
    }

    setIsSubmitting(false)
  }

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    const { email, username, password } = data
    if (password.trim() === "") {
      return
    }

    setIsSubmitting(true)
    setAuthError(null)

    const { success, error } = await signUp(data)

    if (success) {
      setIdentifier(email ?? username)
      setIsVerifying(true)
    } else {
      console.error("Error creating account", error)
      setAuthError("Error creating account")
    }
    setIsSubmitting(false)
  }

  const handleResendCode = async () => {
    const { success, error } = await resendOtp({ identifier })

    if (!success) {
      console.error("Resend code:", error)
    }
  }

  if (isVerifying) {
    return (
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm mx-auto">
          <Card className="pl-[10%]">
            <CardHeader>
              <CardTitle className="text-2xl">Email Verification</CardTitle>
              <CardDescription>Enter your one-time OTP below</CardDescription>
            </CardHeader>
            <CardContent>
              {verificationError && (
                <div className="bg-destructive p-4 rounded-lg mb-6 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  <p>{verificationError}</p>
                </div>
              )}
              <InputOTP
                maxLength={6}
                value={verificationCode}
                onChange={(code) => setVerificationCode(code)}
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
              <Button
                className="cursor-pointer my-3"
                onClick={handleVerificationSubmit}
              >
                {isSubmitting ? "Verifying..." : "Verify"}
              </Button>
              <div>
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
              </div>
            </CardContent>
          </Card>
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
              <CardTitle className="text-2xl">Sign Up</CardTitle>
              <CardDescription>
                Enter username and email to create new account
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
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      type="username"
                      placeholder="username"
                      autoFocus
                      required
                      {...register("username")}
                    />
                    {checkingUsername ? (
                      <p className="text-xs">"Checking username..."</p>
                    ) : usernameAvailable !== null &&
                      usernameValue.length > 3 ? (
                      <p
                        className={cn(
                          usernameAvailable ? "text-green-500" : "text-red-500",
                          "text-xs"
                        )}
                      >
                        {usernameAvailable
                          ? "Username is available"
                          : "Username is already taken"}
                      </p>
                    ) : (
                      ""
                    )}
                    <p className="text-xs text-destructive" role="alert">
                      {errors.username?.message}
                    </p>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      required
                      {...register("email")}
                    />
                    <p className="text-xs text-destructive" role="alert">
                      {errors.email?.message}
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
                  <div className="grid gap-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      required
                      {...register("passwordConfirmation")}
                    />
                    <p className="text-xs text-destructive" role="alert">
                      {errors.passwordConfirmation?.message}
                    </p>
                  </div>
                  <div id="clerk-captcha" />
                  <Button type="submit" className="w-full cursor-pointer">
                    {isSubmitting ? "Creating Account..." : "Create Account"}
                  </Button>
                </div>
                <div className="mt-4 text-center text-sm">
                  Already have an account?{" "}
                  <Link to="/sign-in" className="underline underline-offset-4">
                    Sign in
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

export default SignUpForm
