import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useCallback, useEffect, useState } from "react"
import { z } from "zod"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signUpSchema } from "@/features/auth/types/signUpSchema"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import {
  AlertCircle,
  MessageSquare,
  Sparkles,
  Lock,
  Mail,
  User,
  ArrowRight,
  Shield,
  CheckCircle2,
  Loader2,
  Check,
  X,
} from "lucide-react"
import { useAuth } from "./hooks/useAuth"
import debounce from "lodash.debounce"
import { cn } from "@/lib/utils"
import { SnapshotCard } from "./SnapShotCard"

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
  const [resendError, setResendError] = useState<null | string>(null)

  const [isCreatingDummyAccount, setIsCreatingDummyAccount] = useState(false)
  const [isCreatedDummyAccount, setIsCreatedDummyAccount] = useState(false)
  const [dummyAccountData, setDummyAccountData] = useState<null | {
    email: string
    username: string
    password: string
  }>(null)

  const navigate = useNavigate()

  const { signUp, verifyOtp, resendOtp, uniqueUserUsername, signUpDummy } =
    useAuth()

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
      if (!username.trim() || username.trim().length < 4) {
        setUsernameAvailable(null)
        return
      }

      setCheckingUsername(true)
      const available = await uniqueUserUsername(username.trim())
      setUsernameAvailable(available)
      setCheckingUsername(false)
    }, 500),
    []
  )

  useEffect(() => {
    debouncedSearch(usernameValue?.trim())
  }, [usernameValue, debouncedSearch])

  const handleVerificationSubmit = async () => {
    if (verificationCode.trim().length !== 6) return

    setIsSubmitting(true)
    setVerificationError(null)

    const { success, error } = await verifyOtp({
      identifier: identifier.trim(),
      otpCode: verificationCode,
    })

    if (success) {
      navigate("/sign-in")
    } else {
      setVerificationError(error)
      // console.error("Otp verification error", error)
    }

    setIsSubmitting(false)
  }

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    const { email, username, password } = data
    if (password.trim() === "") return

    setIsSubmitting(true)
    setAuthError(null)

    const { success, error } = await signUp(data)

    if (success) {
      setIdentifier(email ?? username)
      setIsVerifying(true)
    } else {
      setAuthError(error)
    }
    setIsSubmitting(false)
  }

  const handleResendCode = async () => {
    setResendError(null)
    const { success, error } = await resendOtp({ identifier })
    if (!success) {
      setResendError(error)
    }
  }

  const handleDummySignUp = async () => {
    setIsCreatingDummyAccount(true)
    setAuthError(null)

    const { user, error } = await signUpDummy()

    if (user) {
      setIsCreatedDummyAccount(true)
      setDummyAccountData(user)
    } else {
      setAuthError(error)
    }
    setIsCreatingDummyAccount(false)
  }

  if (isCreatedDummyAccount && dummyAccountData) {
    const { username, email, password } = dummyAccountData

    return (
      <SnapshotCard username={username} email={email} password={password} />
    )
  }

  if (isVerifying) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-muted/20 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse delay-700"></div>
        </div>

        <div className="w-full max-w-md relative z-10">
          <div className="text-center mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4 backdrop-blur-sm border border-primary/20">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent mb-2">
              Verify Your Email
            </h1>
            <p className="text-muted-foreground">
              We sent a 6-digit code to{" "}
              <span className="font-medium text-foreground">{identifier}</span>
            </p>
          </div>

          <Card className="border-muted/40 shadow-2xl backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
            <CardContent className="pt-6">
              {verificationError && (
                <div className="bg-destructive/10 border border-destructive/20 p-4 rounded-lg mb-6 flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                  <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0" />
                  <p className="text-sm text-destructive">
                    {verificationError}
                  </p>
                </div>
              )}

              <div className="space-y-6">
                <div className="space-y-3">
                  <Label className="text-sm font-medium">
                    Verification Code
                  </Label>
                  <InputOTP
                    maxLength={6}
                    value={verificationCode}
                    onChange={(code) => setVerificationCode(code)}
                    className="justify-center"
                  >
                    <InputOTPGroup className="gap-2">
                      <InputOTPSlot
                        index={0}
                        className="w-12 h-12 text-lg border-muted/40"
                      />
                      <InputOTPSlot
                        index={1}
                        className="w-12 h-12 text-lg border-muted/40"
                      />
                      <InputOTPSlot
                        index={2}
                        className="w-12 h-12 text-lg border-muted/40"
                      />
                      <InputOTPSlot
                        index={3}
                        className="w-12 h-12 text-lg border-muted/40"
                      />
                      <InputOTPSlot
                        index={4}
                        className="w-12 h-12 text-lg border-muted/40"
                      />
                      <InputOTPSlot
                        index={5}
                        className="w-12 h-12 text-lg border-muted/40"
                      />
                    </InputOTPGroup>
                  </InputOTP>
                </div>

                <Button
                  onClick={handleVerificationSubmit}
                  className="w-full h-11 font-medium group relative overflow-hidden"
                  disabled={isSubmitting || verificationCode.length !== 6}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        Verify Email
                        <CheckCircle2 className="w-4 h-4" />
                      </>
                    )}
                  </span>
                </Button>

                <div className="text-center pt-2">
                  <p className="text-sm text-muted-foreground mb-2">
                    Didn't receive a code?
                  </p>
                  <Button
                    onClick={handleResendCode}
                    variant="ghost"
                    className="text-sm font-medium hover:text-primary"
                  >
                    Resend Code
                  </Button>
                  {resendError && (
                    <span className="text-xs text-red-500">{resendError}</span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <p className="text-center text-xs text-muted-foreground mt-6 animate-in fade-in duration-700 delay-300">
            Check your spam folder if you don't see the email
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-muted/20 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse delay-700"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/3 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/80 mb-4 shadow-lg shadow-primary/20">
            <MessageSquare className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent mb-2">
            Join Chat Hive
          </h1>
          <p className="text-muted-foreground flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4" />
            Create your account and start chatting
          </p>
        </div>

        {/* Main Card */}
        <Card className="border-muted/40 shadow-2xl backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
          <CardContent className="pt-6">
            {authError && (
              <div className="bg-destructive/10 border border-destructive/20 p-4 rounded-lg mb-6 flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0" />
                <p className="text-sm text-destructive">{authError}</p>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium">
                  Username
                </Label>
                <div className="relative group">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors group-focus-within:text-primary z-10" />
                  <Input
                    id="username"
                    type="text"
                    className="pl-10 pr-10 h-11 border-muted/40 focus-visible:ring-primary/20 transition-all"
                    placeholder="Choose a unique username"
                    autoFocus
                    {...register("username")}
                  />
                  {usernameValue && usernameValue.length >= 4 && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {checkingUsername ? (
                        <Loader2 className="w-4 h-4 text-muted-foreground animate-spin" />
                      ) : usernameAvailable !== null ? (
                        usernameAvailable ? (
                          <div className="flex items-center gap-1">
                            <Check className="w-4 h-4 text-green-500" />
                          </div>
                        ) : (
                          <div className="flex items-center gap-1">
                            <X className="w-4 h-4 text-destructive" />
                          </div>
                        )
                      ) : null}
                    </div>
                  )}
                </div>
                {usernameValue &&
                  usernameValue.length >= 4 &&
                  !checkingUsername &&
                  usernameAvailable !== null && (
                    <p
                      className={cn(
                        "text-xs flex items-center gap-1 animate-in fade-in slide-in-from-top-1 duration-200",
                        usernameAvailable
                          ? "text-green-500"
                          : "text-destructive"
                      )}
                    >
                      {usernameAvailable ? (
                        <>
                          <Check className="w-3 h-3" />
                          Username is available
                        </>
                      ) : (
                        <>
                          <X className="w-3 h-3" />
                          Username is already taken
                        </>
                      )}
                    </p>
                  )}
                {errors.username && (
                  <p className="text-xs text-destructive flex items-center gap-1 animate-in fade-in slide-in-from-top-1 duration-200">
                    <AlertCircle className="w-3 h-3" />
                    {errors.username.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </Label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                  <Input
                    id="email"
                    type="email"
                    className="pl-10 h-11 border-muted/40 focus-visible:ring-primary/20 transition-all"
                    placeholder="you@example.com"
                    {...register("email")}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-destructive flex items-center gap-1 animate-in fade-in slide-in-from-top-1 duration-200">
                    <AlertCircle className="w-3 h-3" />
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                  <Input
                    id="password"
                    type="password"
                    className="pl-10 h-11 border-muted/40 focus-visible:ring-primary/20 transition-all"
                    placeholder="Create a strong password"
                    {...register("password")}
                  />
                </div>
                {errors.password && (
                  <p className="text-xs text-destructive flex items-center gap-1 animate-in fade-in slide-in-from-top-1 duration-200">
                    <AlertCircle className="w-3 h-3" />
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium"
                >
                  Confirm Password
                </Label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    className="pl-10 h-11 border-muted/40 focus-visible:ring-primary/20 transition-all"
                    placeholder="Confirm your password"
                    {...register("passwordConfirmation")}
                  />
                </div>
                {errors.passwordConfirmation && (
                  <p className="text-xs text-destructive flex items-center gap-1 animate-in fade-in slide-in-from-top-1 duration-200">
                    <AlertCircle className="w-3 h-3" />
                    {errors.passwordConfirmation.message}
                  </p>
                )}
              </div>

              <div id="clerk-captcha" />

              <Button
                type="submit"
                className="w-full h-11 font-medium group relative overflow-hidden shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all"
                disabled={
                  isSubmitting ||
                  (usernameValue?.length >= 4 && !usernameAvailable)
                }
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </span>
              </Button>

              <Button
                type="button"
                className="w-full h-11 font-medium group relative overflow-hidden shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all"
                disabled={isCreatingDummyAccount}
                onClick={handleDummySignUp}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isCreatingDummyAccount ? (
                    <>
                      <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      Create Dummy Account
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </span>
              </Button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-muted/40"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">
                    Already have an account?
                  </span>
                </div>
              </div>

              <Link to="/sign-in" className="block">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-11 font-medium border-muted/40 hover:bg-primary/5 hover:border-primary/30 transition-all group"
                >
                  <span className="flex items-center justify-center gap-2">
                    Sign In Instead
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Button>
              </Link>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-6 animate-in fade-in duration-700 delay-300">
          By creating an account, you agree to our Terms of Service and Privacy
          Policy
        </p>
      </div>
    </div>
  )
}

export default SignUpForm
