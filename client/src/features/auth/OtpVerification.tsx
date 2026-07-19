import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { Shield, AlertCircle, KeyRound, RefreshCw } from "lucide-react";
import { verifyOTPSchema } from "shared";
import { useVerifyOTP } from "./hooks/useVerifyOTP";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { useResendOTP } from "./hooks/useResendOTP";

interface OtpVerificationProps {
  email: string;
}

type OtpFormValues = z.infer<typeof verifyOTPSchema>;

export function OtpVerification({ email }: OtpVerificationProps) {
  const navigate = useNavigate();

  const {
    mutate: verifyOtp,
    isPending: isVerifying,
    error: verifyError,
  } = useVerifyOTP();

  const {
    mutate: resendOtp,
    isPending: isResending,
    error: resendError,
    isSuccess: isResendSuccess,
  } = useResendOTP();

  const form = useForm<OtpFormValues>({
    resolver: zodResolver(verifyOTPSchema),
    defaultValues: {
      email: email,
      otp: "",
    },
  });

  function onSubmit(values: OtpFormValues) {
    verifyOtp(values, {
      onSuccess: () => {
        navigate("/sign-in");
      },
    });
  }

  const backendError =
    (verifyError as any)?.response?.data?.message || verifyError?.message;
  const backendResendError =
    (resendError as any)?.response?.data?.message || resendError?.message;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-6 animate-in fade-in duration-300">
      <div className="w-full max-w-[400px] space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-primary/10 mb-2 text-primary animate-bounce duration-1000">
            <Shield className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            Verify Your Email
          </h1>
          <p className="text-sm text-muted-foreground">
            We sent a validation code to{" "}
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
                <Controller
                  name="otp"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="verification-otp">
                        One-Time Password
                      </FieldLabel>
                      <div className="relative">
                        <KeyRound className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                        <Input
                          {...field}
                          id="verification-otp"
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
              </FieldGroup>

              <Button
                type="submit"
                className="w-full h-11 shadow-md rounded-xl transition-all active:scale-[0.98]"
                disabled={isVerifying}
              >
                {isVerifying ? "Confirming..." : "Verify Account"}
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
