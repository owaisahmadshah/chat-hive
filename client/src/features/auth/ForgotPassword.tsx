import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { z } from "zod";
import { resendOTPSchema } from "shared";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { MessageSquare, Mail, AlertCircle, ArrowRight } from "lucide-react";
import { useForgotPassword } from "./hooks/useForgotPassword";
import { ResetPasswordVerification } from "./ResetPasswordVerification";

type FormValues = z.infer<typeof resendOTPSchema>;

export default function ForgotPassword() {
  const [submittedEmail, setSubmittedEmail] = React.useState<string | null>(
    null,
  );
  const [isCodeSent, setIsCodeSent] = React.useState(false);

  const {
    mutate: forgotPassword,
    isPending: isSubmitting,
    error: forgotError,
  } = useForgotPassword();

  const form = useForm<FormValues>({
    resolver: zodResolver(resendOTPSchema),
    defaultValues: {
      email: "",
    },
  });

  function onSubmit(values: FormValues) {
    forgotPassword(values, {
      onSuccess: () => {
        setSubmittedEmail(values.email);
        setIsCodeSent(true);
      },
    });
  }

  if (isCodeSent && submittedEmail) {
    return <ResetPasswordVerification email={submittedEmail} />;
  }

  const backendError =
    (forgotError as any)?.response?.data?.message || forgotError?.message;

  return (
    <div className="flex min-h-screen w-full bg-background animate-in fade-in duration-300">
      {/* Left Side Branding */}
      <div className="hidden lg:flex w-1/2 bg-muted/30 relative flex-col justify-between p-12 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom_right,var(--tw-gradient-stops))] from-primary/5 via-transparent to-primary/10" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <div className="p-2 bg-primary rounded-xl shadow-md shadow-primary/20">
              <MessageSquare className="w-5 h-5 text-primary-foreground" />
            </div>
            <span>Chat Hive</span>
          </div>
        </div>

        <div className="relative z-10 space-y-4">
          <h2 className="text-4xl font-medium leading-tight tracking-tight">
            No worries, <br />
            <span className="text-primary font-bold">
              We&apos;ve got you covered.
            </span>
          </h2>
          <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
            Provide your email address, and we will send you a secure
            verification link to safely reset your security credentials.
          </p>
        </div>

        <div className="relative z-10 text-sm text-muted-foreground">
          <p className="font-medium">Secure account recovery</p>
        </div>
      </div>

      {/* Right Side Input */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 overflow-y-auto">
        <div className="w-full max-w-[400px] space-y-8 animate-in slide-in-from-right-4 duration-500">
          <div className="space-y-2 text-center lg:text-left">
            <h1 className="text-3xl font-bold tracking-tight">
              Forgot Password?
            </h1>
            <p className="text-muted-foreground text-sm">
              Enter your email address to receive recovery instructions
            </p>
          </div>

          <div className="space-y-6">
            {backendError && (
              <div className="flex items-center gap-2 p-3 text-xs font-medium bg-destructive/10 border border-destructive/20 text-destructive rounded-xl animate-in shake-in">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{backendError}</span>
              </div>
            )}

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FieldGroup>
                <Controller
                  name="email"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="forgot-email">
                        Email Address
                      </FieldLabel>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                        <Input
                          {...field}
                          id="forgot-email"
                          type="email"
                          placeholder="you@example.com"
                          className="pl-10 bg-muted/20 border-border/60 rounded-xl focus:bg-background transition-all"
                          autoComplete="email"
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
                className="w-full h-11 shadow-md rounded-xl transition-all active:scale-[0.98] gap-2 group"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending Code..." : "Send Reset Code"}
                {!isSubmitting && (
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                )}
              </Button>
            </form>

            <div className="text-center">
              <Link
                to="/sign-in"
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                ← Back to Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
