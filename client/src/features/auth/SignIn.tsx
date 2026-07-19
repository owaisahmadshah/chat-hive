import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { z } from "zod";
import { loginUserSchema } from "shared";

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
  Zap,
  CheckCircle2,
  AlertCircle,
  Lock,
  User,
  Shield,
} from "lucide-react";

import { useSignIn } from "./hooks/useSignIn";
import { OtpVerification } from "./OtpVerification";

type FormValues = z.infer<typeof loginUserSchema>;

export default function SignIn() {
  const [unverifiedEmail, setUnverifiedEmail] = React.useState<string | null>(
    null,
  );
  const [isVerifying, setIsVerifying] = React.useState(false);

  const {
    mutate: signIn,
    isPending: isSubmitting,
    error: signInError,
  } = useSignIn();

  const form = useForm<FormValues>({
    resolver: zodResolver(loginUserSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const watchIdentifier = form.watch("identifier");

  function onSubmit(values: FormValues) {
    signIn(values, {
      onSuccess: () => {
        // Handle successful login redirect here (e.g., window.location.reload() or routing)
        window.location.reload();
      },
      onError: (error: any) => {
        const status = error?.response?.status;
        const msg = error?.response?.data?.message || "";

        // If the backend drops a 403 Forbidden status indicating an unverified user account,
        // intercept it, capture the identifier (email), and render the subview.
        if (status === 403 || msg.toLowerCase().includes("not verified")) {
          // If identifier is an email, use it. Otherwise, fallback safely to pass downstream
          setUnverifiedEmail(watchIdentifier || "");
          setIsVerifying(true);
        }
      },
    });
  }

  // Swap to th OtpVerification screen dynamically upon 403 intercept
  if (isVerifying && unverifiedEmail) {
    return <OtpVerification email={unverifiedEmail} />;
  }

  const backendError =
    (signInError as any)?.response?.data?.message || signInError?.message;

  return (
    <div className="flex min-h-screen w-full bg-background animate-in fade-in duration-300">
      {/* Left Side Branding + Features (Hidden on Mobile) */}
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

        <div className="relative z-10 space-y-8">
          <h2 className="text-4xl font-medium leading-tight tracking-tight">
            Connect instantly with <br />
            <span className="text-primary font-bold">Real-time Precision.</span>
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
          <p className="font-medium">Joined by 2,000+ users worldwide</p>
        </div>
      </div>

      {/* Right Side Form Layout */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 overflow-y-auto">
        <div className="w-full max-w-[400px] space-y-8 animate-in slide-in-from-right-4 duration-500">
          <div className="space-y-2 text-center lg:text-left">
            <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
            <p className="text-muted-foreground text-sm">
              Enter your credentials to access your account
            </p>
          </div>

          <div className="space-y-6">
            {backendError &&
              !backendError.toLowerCase().includes("not verified") && (
                <div className="flex items-center gap-2 p-3 text-xs font-medium bg-destructive/10 border border-destructive/20 text-destructive rounded-xl animate-in shake-in">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{backendError}</span>
                </div>
              )}

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FieldGroup>
                {/* Identifier Field */}
                <Controller
                  name="identifier"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="signin-identifier">
                        Username or Email
                      </FieldLabel>
                      <div className="relative">
                        <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                        <Input
                          {...field}
                          id="signin-identifier"
                          placeholder="name@example.com"
                          className="pl-10 bg-muted/20 border-border/60 rounded-xl focus:bg-background transition-all"
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

                {/* Password Field */}
                <Controller
                  name="password"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <div className="flex justify-between items-center">
                        <FieldLabel htmlFor="signin-password">
                          Password
                        </FieldLabel>
                        <Link
                          to="/forgot-password"
                          className="text-xs text-primary hover:underline font-medium transition-all"
                        >
                          Forgot?
                        </Link>
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                        <Input
                          {...field}
                          id="signin-password"
                          type="password"
                          className="pl-10 bg-muted/20 border-border/60 rounded-xl focus:bg-background transition-all"
                          autoComplete="current-password"
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
                disabled={isSubmitting}
              >
                {isSubmitting ? "Authenticating..." : "Sign In"}
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link
                className="text-primary font-medium hover:underline transition-colors"
                to="/sign-up"
              >
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureItem({
  icon: Icon,
  title,
  desc,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex gap-4 group">
      <div className="mt-1 bg-primary/10 p-2 rounded-xl h-fit group-hover:bg-primary/20 transition-colors duration-300">
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <div>
        <h4 className="font-semibold text-sm">{title}</h4>
        <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}
