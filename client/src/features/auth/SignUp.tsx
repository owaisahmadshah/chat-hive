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
  Zap,
  Share2,
  Users,
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
      {/* Left Column - Rich Feature Showcase */}
      <div className="hidden lg:flex w-1/2 bg-muted/30 border-r border-border/40 relative flex-col justify-between p-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-primary/10 pointer-events-none" />

        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground shadow-sm">
            <MessageSquare className="w-5 h-5" strokeWidth={2} />
          </div>
          <span className="font-semibold text-lg tracking-tight">
            Chat Hive
          </span>
        </div>

        <div className="relative z-10 space-y-8 max-w-md">
          <div className="space-y-3">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground leading-tight">
              Connect globally with <br />
              <span className="text-primary">unlimited possibilities.</span>
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Join Chat Hive today to experience modern, real-time messaging
              equipped with rich media sharing, team rooms, and instant sync.
            </p>
          </div>

          <div className="grid gap-5">
            <FeatureRow
              icon={Zap}
              title="Lightning-Fast Chats"
              desc="Powered by WebSockets for zero-delay conversations."
            />
            <FeatureRow
              icon={Share2}
              title="Multi-Type Media Sharing"
              desc="Share high-resolution images, videos, audio clips, and files seamlessly."
            />
            <FeatureRow
              icon={Users}
              title="Groups & Direct Messages"
              desc="Create dynamic spaces for groups or private one-on-one chats."
            />
          </div>
        </div>

        <div className="relative z-10 text-xs text-muted-foreground">
          © {new Date().getFullYear()} Chat Hive. Built for high-speed
          collaboration.
        </div>
      </div>

      {/* Right Column - Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-[380px] space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold tracking-tight">
              Create an account
            </h2>
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

function FeatureRow({
  icon: Icon,
  title,
  desc,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex items-start gap-3.5">
      <div className="mt-0.5 p-2 rounded-xl bg-primary/10 text-primary shrink-0">
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <h4 className="text-sm font-medium text-foreground">{title}</h4>
        <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">
          {desc}
        </p>
      </div>
    </div>
  );
}
