import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { RefreshCcw, Loader2, AlertCircle, CheckCircle2 } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useChangePassword } from "@/hooks/useChangePassword"
import { useVerifyOtpAndChangePassword } from "@/hooks/useVerifyOtpAndChangePassword"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useResendOtp } from "@/hooks/useResendOtp"

const passwordSchema = z
  .object({
    oldPassword: z.string().optional(),
    otpCode: z.string().length(6, "OTP must be 6 digits").optional(),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

type TPasswordForm = z.infer<typeof passwordSchema>

export const ChangePasswordSection = ({ email }: { email: string }) => {
  const [isGoogleLinked, setIsGoogleLinked] = useState(false)
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error" | "info"
    text: string
  } | null>(null)

  const form = useForm<TPasswordForm>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { newPassword: "", confirmPassword: "" },
  })

  const { mutateAsync: standardChange, isPending: isChanging } =
    useChangePassword()
  const { mutateAsync: otpChange, isPending: isVerifying } =
    useVerifyOtpAndChangePassword()
  const { mutateAsync: resendOtp, isPending: isResendingOtp } = useResendOtp()

  const onSubmit = async (values: TPasswordForm) => {
    setStatusMessage(null)
    try {
      if (isGoogleLinked) {
        await otpChange({
          identifier: email,
          otpCode: values.otpCode!,
          newPassword: values.newPassword,
        })
        setStatusMessage({
          type: "success",
          text: "Password set successfully!",
        })
      } else {
        await standardChange({
          oldPassword: values.oldPassword!,
          newPassword: values.newPassword,
        })
        setStatusMessage({
          type: "success",
          text: "Password updated successfully!",
        })
      }
      form.reset()
      setIsGoogleLinked(false)
    } catch (error: any) {
      const errorType = error.response?.data?.message
      const status = error.response?.data?.statusCode

      if (status === 400 && errorType === "LINKED_WITH_GOOGLE") {
        setIsGoogleLinked(true)
        setStatusMessage({
          type: "info",
          text: "Account linked with Google. Please enter the OTP sent to your email.",
        })
        form.reset()
      } else if (status === 400 && errorType === "INCORRECT_PASSWORD") {
        form.setError("oldPassword", {
          message: "Current password is incorrect",
        })
      } else {
        setStatusMessage({
          type: "error",
          text:
            error.response?.data?.message || "An unexpected error occurred.",
        })
      }
    }
  }

  const handleResendOtp = async () => {
    setStatusMessage(null)

    try {
      await resendOtp({ identifier: email })
      setStatusMessage({
        type: "info",
        text: "Sucessfully resent OTP to your email.",
      })
    } catch (error: any) {
      setStatusMessage({
        type: "error",
        text: error.response?.data?.message ?? "Unable to resend OTP!",
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Security</CardTitle>
        <CardDescription>Update your password</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {statusMessage && (
            <Alert
              variant={
                statusMessage.type === "error" ? "destructive" : "default"
              }
              className={
                statusMessage.type === "success"
                  ? "border-green-500 text-green-600 bg-green-50"
                  : statusMessage.type === "info"
                    ? "border-blue-500 text-blue-600 bg-blue-50"
                    : ""
              }
            >
              {statusMessage.type === "error" ? (
                <AlertCircle className="h-4 w-4" />
              ) : (
                <CheckCircle2 className="h-4 w-4" />
              )}
              <AlertDescription>{statusMessage.text}</AlertDescription>
            </Alert>
          )}

          {!isGoogleLinked ? (
            <div className="space-y-2">
              <Label>Current Password</Label>
              <Input
                type="password"
                placeholder="••••••••"
                {...form.register("oldPassword")}
              />
              {form.formState.errors.oldPassword && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.oldPassword.message}
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>OTP Code</Label>
                <Button
                  type="button"
                  variant="link"
                  className="h-auto p-0 text-xs"
                  onClick={handleResendOtp}
                  disabled={isResendingOtp}
                >
                  <RefreshCcw
                    className={`w-3 h-3 mr-1 ${isResendingOtp ? "animate-spin" : ""}`}
                  />
                  {isResendingOtp ? "Sending..." : "Resend"}
                </Button>
              </div>
              <Input placeholder="123456" {...form.register("otpCode")} />
              <p className="text-[10px] text-muted-foreground">
                Check your email for the 6-digit code.
              </p>
              {form.formState.errors.otpCode && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.otpCode.message}
                </p>
              )}
            </div>
          )}

          <div className="space-y-2">
            <Label>New Password</Label>
            <Input type="password" {...form.register("newPassword")} />
            {form.formState.errors.newPassword && (
              <p className="text-xs text-destructive">
                {form.formState.errors.newPassword.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Confirm New Password</Label>
            <Input type="password" {...form.register("confirmPassword")} />
            {form.formState.errors.confirmPassword && (
              <p className="text-xs text-destructive">
                {form.formState.errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isChanging || isVerifying}
          >
            {(isChanging || isVerifying) && (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            )}
            {isGoogleLinked ? "Verify & Set Password" : "Change Password"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
