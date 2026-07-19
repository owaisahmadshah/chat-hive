import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { KeyRound, Lock, AlertCircle, RefreshCw } from "lucide-react";
import { resetPasswordSchema } from "shared";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { useResetPassword } from "./hooks/useResetPassword";
import { useForgotPassword } from "./hooks/useForgotPassword";

interface ResetPasswordVerificationProps {
  email: string;
}

const clientResetSchema = resetPasswordSchema
  .extend({
    passwordConfirmation: z
      .string()
      .min(1, "Password confirmation is required"),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords do not match",
    path: ["passwordConfirmation"],
  });

type FormValues = z.infer<typeof clientResetSchema>;

export function ResetPasswordVerification({
  email,
}: ResetPasswordVerificationProps) {
  const navigate = useNavigate();

  const {
    mutate: resetPassword,
    isPending: isResetting,
    error: resetError,
  } = useResetPassword();

  const {
    mutate: resendOtp,
    isPending: isResending,
    error: resendError,
    isSuccess: isResendSuccess,
  } = useForgotPassword(); // Uses forgot password mutation to recreate/resend reset code

  const form = useForm<FormValues>({
    resolver: zodResolver(clientResetSchema),
    defaultValues: {
      email: email,
      otp: "",
      password: "",
      passwordConfirmation: "",
    },
  });

  function onSubmit(values: FormValues) {
    const { email, otp, password } = values;
    resetPassword(
      { email, otp, password },
      {
        onSuccess: () => {
          // Both cookies are appended on pass-through from back-end response context
          navigate("/sign-in");
        },
      },
    );
  }

  const backendError =
    (resetError as any)?.response?.data?.message || resetError?.message;
  const backendResendError =
    (resendError as any)?.response?.data?.message || resendError?.message;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-6 animate-in fade-in duration-300">
      <div className="w-full max-w-[400px] space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-primary/10 mb-2 text-primary">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            Reset Your Password
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter the 6-digit verification code sent to{" "}
            <span className="font-medium text-foreground">{email}</span>
          </p>
        </div>

        <Card className="border-border/60 shadow-xl shadow-primary/5 rounded-2xl overflow-hidden">
          <CardContent className="pt-6 space-y-6">
            {backendError && (
              <div className="flex items-center gap-2 p-3 text-xs font-medium bg-destructive/10 border border-destructive/20 text-destructive rounded-xl animate-in shake-in">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{backendError}</span>
              </div>
            )}

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FieldGroup>
                {/* OTP Validation Code */}
                <Controller
                  name="otp"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="reset-otp">
                        One-Time Password
                      </FieldLabel>
                      <div className="relative">
                        <KeyRound className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                        <Input
                          {...field}
                          id="reset-otp"
                          placeholder="Enter 6-digit code"
                          className="pl-10 tracking-[0.2em] font-mono text-center bg-muted/20 border-border/60 rounded-xl"
                          maxLength={6}
                          autoComplete="one-time-code"
                          aria-invalid={fieldState.invalid}
                        />
                      </div>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                {/* New Password input */}
                <Controller
                  name="password"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="reset-password">
                        New Password
                      </FieldLabel>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                        <Input
                          {...field}
                          id="reset-password"
                          type="password"
                          placeholder="••••••••"
                          className="pl-10 bg-muted/20 border-border/60 rounded-xl"
                          autoComplete="new-password"
                          aria-invalid={fieldState.invalid}
                        />
                      </div>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                {/* Password confirmation */}
                <Controller
                  name="passwordConfirmation"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="reset-confirm">
                        Confirm Password
                      </FieldLabel>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                        <Input
                          {...field}
                          id="reset-confirm"
                          type="password"
                          placeholder="••••••••"
                          className="pl-10 bg-muted/20 border-border/60 rounded-xl"
                          autoComplete="new-password"
                          aria-invalid={fieldState.invalid}
                        />
                      </div>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </FieldGroup>

              <Button
                type="submit"
                className="w-full h-11 shadow-md rounded-xl transition-all active:scale-[0.98]"
                disabled={isResetting}
              >
                {isResetting ? "Updating Password..." : "Reset Password"}
              </Button>
            </form>

            <div className="flex flex-col items-center justify-center pt-2 border-t border-border/40 gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-muted-foreground hover:text-primary rounded-lg gap-2"
                onClick={() => resendOtp({ email })}
                disabled={isResending}
              >
                <RefreshCw
                  className={`w-3 h-3 ${isResending ? "animate-spin" : ""}`}
                />
                {isResending ? "Resending..." : "Resend Verification Code"}
              </Button>

              {isResendSuccess && (
                <p className="text-[11px] font-medium text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full">
                  Code resent successfully!
                </p>
              )}
              {backendResendError && (
                <p className="text-[11px] font-medium text-destructive">
                  {backendResendError}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
