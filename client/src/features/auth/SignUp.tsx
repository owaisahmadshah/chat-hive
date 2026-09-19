import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { z } from "zod";
import { createUserSchema } from "shared";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  MessageSquare,
  AlertCircle,
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
} from "lucide-react";

import { useSignUp } from "./hooks/useSignUp";
import { OtpVerification } from "./OtpVerification";

const formSchema = createUserSchema
  .extend({
    passwordConfirmation: z
      .string()
      .min(1, "Password confirmation is required"),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords do not match",
    path: ["passwordConfirmation"],
  });

type FormValues = z.infer<typeof formSchema>;

export function SignUp() {
  const [registeredEmail, setRegisteredEmail] = React.useState<string | null>(
    null,
  );
  const [isVerifying, setIsVerifying] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const {
    mutate: signUp,
    isPending: isSubmitting,
    error: signUpError,
  } = useSignUp();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      passwordConfirmation: "",
      authProvider: "local",
    },
  });

  function onSubmit(values: FormValues) {
    const { username, email, password, authProvider } = values;

    signUp(
      { username, email, password, authProvider },
      {
        onSuccess: () => {
          setRegisteredEmail(email);
          setIsVerifying(true);
        },
      },
    );
  }

  if (isVerifying && registeredEmail) {
    return <OtpVerification email={registeredEmail} />;
  }

  const backendError =
    (signUpError as any)?.response?.data?.message || signUpError?.message;

  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Left Column - Minimal Branding */}
      <div className="hidden lg:flex w-1/2 bg-muted/20 border-r border-border/40 relative flex-col justify-between p-12">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-sm">
            <MessageSquare className="w-5 h-5" strokeWidth={2} />
          </div>
          <span className="font-semibold text-lg tracking-tight">
            Chat Hive
          </span>
        </div>

        <div className="space-y-3 max-w-sm">
          <h2 className="text-2xl font-medium tracking-tight text-foreground">
            Get started in seconds.
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Create your account to connect instantly with peers and teams.
          </p>
        </div>

        <div className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Chat Hive. All rights reserved.
        </div>
      </div>

      {/* Right Column - Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-[380px] space-y-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight">
              Create an account
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your details below to get started
            </p>
          </div>

          {backendError && (
            <div className="flex items-center gap-2.5 p-3 text-xs font-medium bg-destructive/10 border border-destructive/20 text-destructive rounded-xl">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{backendError}</span>
            </div>
          )}

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FieldGroup>
              <Controller
                name="username"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="signup-username"
                      className="text-xs font-medium"
                    >
                      Username
                    </FieldLabel>
                    <div className="relative mt-1">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        {...field}
                        id="signup-username"
                        placeholder="johndoe"
                        className="pl-10 h-11 bg-muted/40 hover:bg-muted focus-visible:bg-background border-border/60 rounded-xl transition-all"
                        autoComplete="username"
                        aria-invalid={fieldState.invalid}
                      />
                    </div>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="signup-email"
                      className="text-xs font-medium"
                    >
                      Email
                    </FieldLabel>
                    <div className="relative mt-1">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        {...field}
                        id="signup-email"
                        type="email"
                        placeholder="name@example.com"
                        className="pl-10 h-11 bg-muted/40 hover:bg-muted focus-visible:bg-background border-border/60 rounded-xl transition-all"
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

              <div className="grid grid-cols-1 gap-3">
                <Controller
                  name="password"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel
                        htmlFor="signup-password"
                        className="text-xs font-medium"
                      >
                        Password
                      </FieldLabel>
                      <div className="relative mt-1">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          {...field}
                          id="signup-password"
                          type={showPassword ? "text" : "password"}
                          className="pl-10 pr-10 h-11 bg-muted/40 hover:bg-muted focus-visible:bg-background border-border/60 rounded-xl transition-all"
                          autoComplete="new-password"
                          aria-invalid={fieldState.invalid}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none"
                        >
                          {showPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="passwordConfirmation"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel
                        htmlFor="signup-confirm"
                        className="text-xs font-medium"
                      >
                        Confirm
                      </FieldLabel>
                      <div className="relative mt-1">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          {...field}
                          id="signup-confirm"
                          type={showConfirmPassword ? "text" : "password"}
                          className="pl-10 pr-10 h-11 bg-muted/40 hover:bg-muted focus-visible:bg-background border-border/60 rounded-xl transition-all"
                          autoComplete="new-password"
                          aria-invalid={fieldState.invalid}
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>
            </FieldGroup>

            <Button
              type="submit"
              className="w-full h-11 rounded-xl font-medium transition-all shadow-sm"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating account..." : "Create account"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              className="text-foreground font-medium hover:underline transition-colors"
              to="/sign-in"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
