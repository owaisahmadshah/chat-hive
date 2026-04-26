import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useState } from "react"
import { z } from "zod"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signInSchema } from "@/features/auth/types/signInSchema"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import {
  AlertCircle,
  MessageSquare,
  Lock,
  Mail,
  User,
  ArrowRight,
  Shield,
  CheckCircle2,
  Zap,
} from "lucide-react"
import { resetPasswordSchema } from "./types/resetPasswordSchema"
import { useAuth } from "./hooks/useAuth"
import { ContinueWithGoogle } from "./components/ContinueWithGoogle"

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
  const [isVerifying, setIsVerifying] = useState(false)
  const [verifyUserCode, setVerifyUserCode] = useState("")
  const [redirect, setRedirect] = useState(false)
  const [resendCodeError, setResendCodeError] = useState<string | null>(null)

  const { signIn, forgetPassword, resendOtp, verifyOtp } = useAuth()

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: { identifier: "", password: "" },
  })

  const watchEmail = watch("identifier")

  const {
    register: registerReset,
    handleSubmit: handleSubmitReset,
    formState: { errors: resetErrors },
  } = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
  })

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    const { identifier, password } = data
    if (password.trim() === "") return
    setIsSubmitting(true)
    setAuthError(null)
    const { success, isVerified, error } = await signIn({
      identifier,
      password,
    })
    if (success) setRedirect(true)
    else if (!isVerified && !error) setIsVerifying(true)
    else setAuthError(error ?? "Something went wrong!!")
    setIsSubmitting(false)
  }

  const sendCode = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setIsSubmitting(true)
    setAuthError(null)
    const { success, error } = await resendOtp({ identifier: email })
    if (success) setIsCodeSent(true)
    else setAuthError(error)
    setIsSubmitting(false)
  }

  const handleResetVerification = async (
    data: z.infer<typeof resetPasswordSchema>
  ) => {
    if (verificationCode.trim().length !== 6 || !email) return
    setIsSubmitting(true)
    setVerificationError(null)
    const { success, error } = await forgetPassword({
      identifier: email,
      otpCode: verificationCode,
      password: data.password,
    })
    if (!success) setVerificationError(error)
    else {
      setAuthError(null)
      setIsCodeSent(false)
      setIsVerifying(false)
      setIsForgotPassword(false)
    }
    setIsSubmitting(false)
  }

  const handleVerify = async () => {
    if (!verifyUserCode.trim() || verifyUserCode.length !== 6 || !watchEmail)
      return
    setVerificationError(null)
    setIsSubmitting(true)
    const { success, error } = await verifyOtp({
      identifier: watchEmail,
      otpCode: verifyUserCode,
    })
    if (success) {
      setAuthError(null)
      setIsCodeSent(false)
      setIsVerifying(false)
      setIsForgotPassword(false)
    } else {
      setAuthError(error)
    }
    setIsSubmitting(false)
  }

  const handleResendCode = async () => {
    if (!watchEmail) return
    const { success, error } = await resendOtp({ identifier: watchEmail })
    if (!success) {
      setVerificationError("Unable to resend verification code.")
      setResendCodeError(error)
    }
  }

  if (redirect) window.location.reload()

  // ── Verify Email ──────────────────────────────────────────────────────────
  if (isVerifying) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-muted/20 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse delay-700" />
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
              Enter the 6-digit code sent to your email
            </p>
          </div>

          <Card className="border-muted/40 shadow-2xl backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
            <CardContent className="pt-6">
              {verificationError && <ErrorAlert message={verificationError} />}

              <div className="space-y-6">
                <div className="space-y-3">
                  <Label className="text-sm font-medium">
                    Verification Code
                  </Label>
                  <InputOTP
                    maxLength={6}
                    value={verifyUserCode}
                    onChange={setVerifyUserCode}
                    className="justify-center"
                  >
                    <InputOTPGroup className="gap-2">
                      {[...Array(6)].map((_, i) => (
                        <InputOTPSlot
                          key={i}
                          index={i}
                          className="w-12 h-12 text-lg border-muted/40"
                        />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                </div>

                <Button
                  onClick={handleVerify}
                  className="w-full h-11 font-medium group relative overflow-hidden"
                  disabled={isSubmitting || verifyUserCode.length !== 6}
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
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
                  {resendCodeError && (
                    <span className="text-xs text-red-500">
                      {resendCodeError}
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // ── Reset Password (code sent) ─────────────────────────────────────────────
  if (isCodeSent) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-muted/20 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse delay-700" />
        </div>

        <div className="w-full max-w-md relative z-10">
          <div className="text-center mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4 backdrop-blur-sm border border-primary/20">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent mb-2">
              Reset Password
            </h1>
            <p className="text-muted-foreground">
              Enter your new password and verification code
            </p>
          </div>

          <Card className="border-muted/40 shadow-2xl backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
            <CardContent className="pt-6">
              {verificationError && <ErrorAlert message={verificationError} />}

              <form
                onSubmit={handleSubmitReset(handleResetVerification)}
                className="space-y-5"
              >
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    New Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      className="pl-10 h-11 border-muted/40"
                      placeholder="Enter new password"
                      {...registerReset("password")}
                    />
                  </div>
                  {resetErrors.password && (
                    <p className="text-xs text-destructive flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {resetErrors.password.message}
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
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      className="pl-10 h-11 border-muted/40"
                      placeholder="Confirm new password"
                      {...registerReset("passwordConfirmation")}
                    />
                  </div>
                  {resetErrors.passwordConfirmation && (
                    <p className="text-xs text-destructive flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {resetErrors.passwordConfirmation.message}
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-medium">
                    Verification Code
                  </Label>
                  <InputOTP
                    maxLength={6}
                    value={verificationCode}
                    onChange={setVerificationCode}
                    className="justify-center"
                  >
                    <InputOTPGroup className="gap-2">
                      {[...Array(6)].map((_, i) => (
                        <InputOTPSlot
                          key={i}
                          index={i}
                          className="w-11 h-11 border-muted/40"
                        />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 font-medium group relative overflow-hidden"
                  disabled={isSubmitting || verificationCode.length !== 6}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                        Resetting Password...
                      </>
                    ) : (
                      <>
                        Reset Password
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
                    type="button"
                    onClick={handleResendCode}
                    variant="ghost"
                    className="text-sm font-medium hover:text-primary"
                  >
                    Resend Code
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // ── Forgot Password ───────────────────────────────────────────────────────
  if (isForgotPassword) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-muted/20 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse delay-700" />
        </div>

        <div className="w-full max-w-md relative z-10">
          <div className="text-center mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4 backdrop-blur-sm border border-primary/20">
              <Mail className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent mb-2">
              Forgot Password?
            </h1>
            <p className="text-muted-foreground">
              No worries, we'll send you reset instructions
            </p>
          </div>

          <Card className="border-muted/40 shadow-2xl backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
            <CardContent className="pt-6">
              {authError && <ErrorAlert message={authError} />}

              <form onSubmit={sendCode} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      className="pl-10 h-11 border-muted/40"
                      placeholder="you@example.com"
                      onChange={(e) => setEmail(e.target.value)}
                      autoFocus
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 font-medium group relative overflow-hidden"
                  disabled={isSubmitting}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                        Sending Code...
                      </>
                    ) : (
                      <>
                        Send Reset Code
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </span>
                </Button>

                <div className="text-center">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setIsForgotPassword(false)}
                    className="text-sm font-medium hover:text-primary"
                  >
                    ← Back to Sign In
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // ── Main Sign In ──────────────────────────────────────────────────────────
  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Left Side: Branding & Info (Hidden on Mobile) */}
      <div className="hidden lg:flex w-1/2 bg-muted/30 relative flex-col justify-between p-12 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom_right,var(--tw-gradient-stops))] from-primary/5 via-transparent to-primary/10" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <div className="p-2 bg-primary rounded-lg">
              <MessageSquare className="w-5 h-5 text-primary-foreground" />
            </div>
            <span>Chat Hive</span>
          </div>
        </div>

        <div className="relative z-10 space-y-8">
          <h2 className="text-4xl font-medium leading-tight">
            Connect instantly with <br />
            <span className="text-primary font-semibold">
              Real-time Precision.
            </span>
          </h2>

          <div className="grid gap-6">
            <FeatureItem
              icon={Zap}
              title="Instant Delivery"
              desc="Socket.IO powered messaging with zero latency."
            />
            <FeatureItem
              icon={CheckCircle2}
              title="Read Receipts"
              desc="Know exactly when your messages are seen."
            />
            <FeatureItem
              icon={Shield}
              title="Secure Auth"
              desc="Short-lived tokens and rotation for maximum security."
            />
          </div>
        </div>

        <div className="relative z-10 text-sm text-muted-foreground flex items-center gap-4">
          <div className="flex -space-x-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full border-2 border-background bg-muted"
              />
            ))}
          </div>
          <p>Joined by 2,000+ users worldwide</p>
        </div>
      </div>

      {/* Right Side: Sign In Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-[400px] space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
          <div className="space-y-2 text-center lg:text-left">
            <h1 className="text-3xl font-semibold tracking-tight">
              Welcome back
            </h1>
            <p className="text-muted-foreground text-sm">
              Enter your credentials to access your account
            </p>
          </div>

          <div className="space-y-6">
            {authError && <ErrorAlert message={authError} />}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="identifier">Username or Email</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="identifier"
                    placeholder="name@example.com"
                    className="pl-10 bg-muted/20 border-border/60 focus:bg-background transition-all"
                    {...register("identifier")}
                  />
                </div>
                {errors.identifier && (
                  <p className="text-xs text-destructive">
                    {errors.identifier.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password">Password</Label>
                  <button
                    type="button"
                    onClick={() => setIsForgotPassword(true)}
                    className="text-xs text-primary hover:underline font-medium"
                  >
                    Forgot?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    className="pl-10 bg-muted/20 border-border/60 focus:bg-background transition-all"
                    {...register("password")}
                  />
                </div>
                {errors.password && (
                  <p className="text-xs text-destructive">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full shadow-md"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Authenticating..." : "Sign In"}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            <ContinueWithGoogle />

            <p className="text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link
                to="/sign-up"
                className="text-primary font-medium hover:underline"
              >
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Helper Components ─────────────────────────────────────────────────────────

function FeatureItem({
  icon: Icon,
  title,
  desc,
}: {
  icon: any
  title: string
  desc: string
}) {
  return (
    <div className="flex gap-4">
      <div className="mt-1 bg-primary/10 p-2 rounded-lg h-fit">
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <div>
        <h4 className="font-medium text-sm">{title}</h4>
        <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
      </div>
    </div>
  )
}

function ErrorAlert({ message }: { message: string }) {
  return (
    <div className="flex items-center gap-2 p-3 text-xs font-medium bg-destructive/10 border border-destructive/20 text-destructive rounded-lg animate-in fade-in slide-in-from-top-2 duration-300">
      <AlertCircle className="w-4 h-4 flex-shrink-0" />
      {message}
    </div>
  )
}

export default SignInForm
