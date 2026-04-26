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
  Zap,
  Image as ImageIcon,
} from "lucide-react"
import { useAuth } from "./hooks/useAuth"
import debounce from "lodash.debounce"
import { cn } from "@/lib/utils"
import { ContinueWithGoogle } from "./components/ContinueWithGoogle"

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

  // Reusable Component for Verification and Errors
  const AuthLayout = ({ children, title, subtitle, icon: Icon }: any) => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-6">
      <div className="w-full max-w-[400px] space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-xl bg-primary/10 mb-2">
            <Icon className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
        {children}
      </div>
    </div>
  )

  if (isVerifying) {
    return (
      <AuthLayout
        title="Verify Your Email"
        subtitle={`We sent a code to ${identifier}`}
        icon={Shield}
      >
        <Card className="border-border/50 shadow-sm">
          <CardContent className="pt-6 space-y-6">
            {verificationError && (
              <div className="flex items-center gap-2 p-3 text-xs font-medium bg-destructive/10 border border-destructive/20 text-destructive rounded-lg">
                <AlertCircle className="w-4 h-4" />
                {verificationError}
              </div>
            )}
            <div className="flex flex-col items-center gap-6">
              <InputOTP
                maxLength={6}
                value={verificationCode}
                onChange={setVerificationCode}
              >
                <InputOTPGroup className="gap-2">
                  {[...Array(6)].map((_, i) => (
                    <InputOTPSlot
                      key={i}
                      index={i}
                      className="rounded-md border-border h-12 w-12 text-lg"
                    />
                  ))}
                </InputOTPGroup>
              </InputOTP>
              <Button
                onClick={handleVerificationSubmit}
                className="w-full h-11"
                disabled={isSubmitting || verificationCode.length !== 6}
              >
                {isSubmitting ? "Verifying..." : "Confirm Account"}
              </Button>
              <div className="text-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleResendCode}
                  className="text-xs"
                >
                  Resend Code
                </Button>
                {resendError && (
                  <p className="text-[10px] text-destructive mt-1">
                    {resendError}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </AuthLayout>
    )
  }

  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Left Side: Branding & Features */}
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
            The future of <br />
            <span className="text-primary font-semibold">
              Real-time Connection.
            </span>
          </h2>

          <div className="grid gap-6">
            <FeatureItem
              icon={Zap}
              title="Instant Messaging"
              desc="Experience live chat with real-time typing indicators."
            />
            <FeatureItem
              icon={ImageIcon}
              title="Rich Media"
              desc="Share up to 15 images at once with high-fidelity previews."
            />
            <FeatureItem
              icon={CheckCircle2}
              title="Live Status"
              desc="See exactly when your messages are delivered and read."
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
          <p>Join the Hive today</p>
        </div>
      </div>

      {/* Right Side: Sign Up Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 overflow-y-auto">
        <div className="w-full max-w-[420px] space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
          <div className="space-y-2 text-center lg:text-left">
            <h1 className="text-3xl font-semibold tracking-tight">
              Create an account
            </h1>
            <p className="text-muted-foreground text-sm">
              Join the community and start chatting today
            </p>
          </div>

          <div className="space-y-6">
            {authError && (
              <div className="flex items-center gap-2 p-3 text-xs font-medium bg-destructive/10 border border-destructive/20 text-destructive rounded-lg">
                <AlertCircle className="w-4 h-4" />
                {authError}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Username Field */}
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="username"
                    placeholder="chat_king"
                    className="pl-10 pr-10 bg-muted/20 border-border/60"
                    {...register("username")}
                  />
                  <div className="absolute right-3 top-3">
                    {checkingUsername ? (
                      <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                    ) : usernameValue?.length >= 4 &&
                      usernameAvailable !== null ? (
                      usernameAvailable ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <X className="w-4 h-4 text-destructive" />
                      )
                    ) : null}
                  </div>
                </div>
                {usernameValue?.length >= 4 && usernameAvailable !== null && (
                  <p
                    className={cn(
                      "text-[10px] font-medium",
                      usernameAvailable ? "text-green-500" : "text-destructive"
                    )}
                  >
                    {usernameAvailable
                      ? "Username is available"
                      : "Username is taken"}
                  </p>
                )}
                {errors.username && (
                  <p className="text-xs text-destructive">
                    {errors.username.message}
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    className="pl-10 bg-muted/20 border-border/60"
                    {...register("email")}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      className="pl-10 bg-muted/20 border-border/60"
                      {...register("password")}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm">Confirm</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="confirm"
                      type="password"
                      className="pl-10 bg-muted/20 border-border/60"
                      {...register("passwordConfirmation")}
                    />
                  </div>
                </div>
              </div>
              {(errors.password || errors.passwordConfirmation) && (
                <p className="text-xs text-destructive">
                  {errors.password?.message ||
                    errors.passwordConfirmation?.message}
                </p>
              )}

              <Button
                type="submit"
                className="w-full h-11 shadow-md"
                disabled={
                  isSubmitting ||
                  (usernameValue?.length >= 4 && !usernameAvailable)
                }
              >
                {isSubmitting ? "Creating Account..." : "Sign Up"}
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
              Already have an account?{" "}
              <Link
                className="text-primary font-medium hover:underline"
                to="/sign-in"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

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

export default SignUpForm
