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
  Sparkles,
  Lock,
  Mail,
  User,
  ArrowRight,
  Shield,
  CheckCircle2,
} from "lucide-react"
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
    defaultValues: {
      identifier: "",
      password: "",
    },
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

    if (success) {
      setRedirect(true)
    } else if (!isVerified && !error) {
      setIsVerifying(true)
    } else {
      setAuthError(error ?? "Something went wrong!!")
    }
    setIsSubmitting(false)
  }

  const sendCode = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsSubmitting(true)
    setAuthError(null)

    const { success, error } = await resendOtp({ identifier: email })

    if (success) {
      setIsCodeSent(true)
    } else {
      // setAuthError("Failed to send code. Please try again.")
      setAuthError(error)
    }
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

    if (!success) {
      // console.error("Error verifying otp", error)
      setAuthError(error)
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
      // console.error("Otp verification error", error)
    }
    setIsSubmitting(false)
  }

  const handleResendCode = async () => {
    if (!watchEmail) return
    const { success, error } = await resendOtp({ identifier: watchEmail })
    if (!success) {
      // TODO: SET RESEND CODE ERROR
      setResendCodeError(error)
    }
  }

  if (redirect) {
    window.location.reload()
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
              Enter the 6-digit code sent to your email
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
                    value={verifyUserCode}
                    onChange={(code) => setVerifyUserCode(code)}
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

  if (isCodeSent) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-muted/20 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse delay-700"></div>
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
              {verificationError && (
                <div className="bg-destructive/10 border border-destructive/20 p-4 rounded-lg mb-6 flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                  <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0" />
                  <p className="text-sm text-destructive">
                    {verificationError}
                  </p>
                </div>
              )}

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
                    onChange={(code) => setVerificationCode(code)}
                    className="justify-center"
                  >
                    <InputOTPGroup className="gap-2">
                      <InputOTPSlot
                        index={0}
                        className="w-11 h-11 border-muted/40"
                      />
                      <InputOTPSlot
                        index={1}
                        className="w-11 h-11 border-muted/40"
                      />
                      <InputOTPSlot
                        index={2}
                        className="w-11 h-11 border-muted/40"
                      />
                      <InputOTPSlot
                        index={3}
                        className="w-11 h-11 border-muted/40"
                      />
                      <InputOTPSlot
                        index={4}
                        className="w-11 h-11 border-muted/40"
                      />
                      <InputOTPSlot
                        index={5}
                        className="w-11 h-11 border-muted/40"
                      />
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

  if (isForgotPassword) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-muted/20 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse delay-700"></div>
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
              {authError && (
                <div className="bg-destructive/10 border border-destructive/20 p-4 rounded-lg mb-6 flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                  <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0" />
                  <p className="text-sm text-destructive">{authError}</p>
                </div>
              )}

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
            Welcome Back
          </h1>
          <p className="text-muted-foreground flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4" />
            Sign in to continue to Chat Hive
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
                <Label htmlFor="identifier" className="text-sm font-medium">
                  Username or Email
                </Label>
                <div className="relative group">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                  <Input
                    id="identifier"
                    type="text"
                    className="pl-10 h-11 border-muted/40 focus-visible:ring-primary/20 transition-all"
                    placeholder="username or you@example.com"
                    autoFocus
                    {...register("identifier")}
                  />
                </div>
                {errors.identifier && (
                  <p className="text-xs text-destructive flex items-center gap-1 animate-in fade-in slide-in-from-top-1 duration-200">
                    <AlertCircle className="w-3 h-3" />
                    {errors.identifier.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      setAuthError(null)
                      setIsForgotPassword(true)
                    }}
                    className="text-xs h-auto p-0 font-medium text-primary hover:text-primary/80 hover:bg-transparent"
                  >
                    Forgot password?
                  </Button>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                  <Input
                    id="password"
                    type="password"
                    className="pl-10 h-11 border-muted/40 focus-visible:ring-primary/20 transition-all"
                    placeholder="Enter your password"
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

              <Button
                type="submit"
                className="w-full h-11 font-medium group relative overflow-hidden shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all"
                disabled={isSubmitting}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign In
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
                    New to Chat Hive?
                  </span>
                </div>
              </div>

              <Link to="/sign-up" className="block">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-11 font-medium border-muted/40 hover:bg-primary/5 hover:border-primary/30 transition-all group"
                >
                  <span className="flex items-center justify-center gap-2">
                    Create an Account
                    <Sparkles className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  </span>
                </Button>
              </Link>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-6 animate-in fade-in duration-700 delay-300">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  )
}

export default SignInForm
