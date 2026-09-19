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
  AlertCircle,
  Lock,
  User,
  Eye,
  EyeOff,
  Zap,
  Shield,
  Layers,
} from "lucide-react";

import { useSignIn } from "./hooks/useSignIn";
import { OtpVerification } from "./OtpVerification";

type FormValues = z.infer<typeof loginUserSchema>;

export default function SignIn() {
  const [unverifiedEmail, setUnverifiedEmail] = React.useState<string | null>(
    null,
  );
  const [isVerifying, setIsVerifying] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);

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
        window.location.reload();
      },
      onError: (error: any) => {
        const status = error?.response?.status;
        const msg = error?.response?.data?.message || "";

        if (status === 403 || msg.toLowerCase().includes("not verified")) {
          setUnverifiedEmail(watchIdentifier || "");
          setIsVerifying(true);
        }
      },
    });
  }

  if (isVerifying && unverifiedEmail) {
    return <OtpVerification email={unverifiedEmail} />;
  }

  const backendError =
    (signInError as any)?.response?.data?.message || signInError?.message;

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
              Welcome back to <br />
              <span className="text-primary">seamless communication.</span>
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Pick up right where you left off. Access your private chats, group
              conversations, and shared files across all your devices in real
              time.
            </p>
          </div>

          <div className="grid gap-5">
            <FeatureRow
              icon={Zap}
              title="Real-Time Messaging"
              desc="Instant delivery with live status indicators and read receipts."
            />
            <FeatureRow
              icon={Layers}
              title="Private & Group Chats"
              desc="Connect one-on-one or collaborate effortlessly with multiple teams."
            />
            <FeatureRow
              icon={Shield}
              title="Multi-Device Sync"
              desc="Secure authentication with seamless token rotation and protection."
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
        <div className="w-full max-w-[360px] space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold tracking-tight">Sign in</h2>
            <p className="text-sm text-muted-foreground">
              Enter your credentials to access your account
            </p>
          </div>

          {backendError &&
            !backendError.toLowerCase().includes("not verified") && (
              <div className="flex items-center gap-2.5 p-3 text-xs font-medium bg-destructive/10 border border-destructive/20 text-destructive rounded-xl">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{backendError}</span>
              </div>
            )}

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FieldGroup>
              <Controller
                name="identifier"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel
                      htmlFor="signin-identifier"
                      className="text-xs font-medium"
                    >
                      Username or email
                    </FieldLabel>
                    <div className="relative mt-1">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        {...field}
                        id="signin-identifier"
                        placeholder="name@example.com"
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
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <div className="flex justify-between items-center mb-1">
                      <FieldLabel
                        htmlFor="signin-password"
                        className="text-xs font-medium"
                      >
                        Password
                      </FieldLabel>
                      <Link
                        to="/forgot-password"
                        className="text-xs text-muted-foreground hover:text-foreground font-medium transition-colors"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        {...field}
                        id="signin-password"
                        type={showPassword ? "text" : "password"}
                        className="pl-10 pr-10 h-11 bg-muted/40 hover:bg-muted focus-visible:bg-background border-border/60 rounded-xl transition-all"
                        autoComplete="current-password"
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
            </FieldGroup>

            <Button
              type="submit"
              className="w-full h-11 rounded-xl font-medium transition-all shadow-sm"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              className="text-foreground font-medium hover:underline transition-colors"
              to="/sign-up"
            >
              Sign up
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
