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
  Zap,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Lock,
  Mail,
  User,
} from "lucide-react";

import { useSignUp } from "./hooks/useSignUp";
import { OtpVerification } from "./OtpVerification";
// import { ContinueWithGoogle } from "./components/ContinueWithGoogle";

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

  // Toggle directly over to our modular subview upon a completed registration state
  if (isVerifying && registeredEmail) {
    return <OtpVerification email={registeredEmail} />;
  }

  const backendError =
    (signUpError as any)?.response?.data?.message || signUpError?.message;

  return (
    <div className="flex min-h-screen w-full bg-background animate-in fade-in duration-300">
      {/* Left Side Branding + Features */}
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
            The future of <br />
            <span className="text-primary font-bold">
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
          <p className="font-medium">Join the Hive today</p>
        </div>
      </div>

      {/* Right Side Form Layout */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 overflow-y-auto">
        <div className="w-full max-w-[420px] space-y-8 animate-in slide-in-from-right-4 duration-500">
          <div className="space-y-2 text-center lg:text-left">
            <h1 className="text-3xl font-bold tracking-tight">
              Create an account
            </h1>
            <p className="text-muted-foreground text-sm">
              Join the community and start chatting today
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
                {/* Username Field */}
                <Controller
                  name="username"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="signup-username">
                        Username
                      </FieldLabel>
                      <div className="relative">
                        <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                        <Input
                          {...field}
                          id="signup-username"
                          placeholder="chat_king"
                          className="pl-10 bg-muted/20 border-border/60 rounded-xl"
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

                {/* Email Field */}
                <Controller
                  name="email"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="signup-email">Email</FieldLabel>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                        <Input
                          {...field}
                          id="signup-email"
                          type="email"
                          placeholder="you@example.com"
                          className="pl-10 bg-muted/20 border-border/60 rounded-xl"
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

                {/* Password Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Controller
                    name="password"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="signup-password">
                          Password
                        </FieldLabel>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                          <Input
                            {...field}
                            id="signup-password"
                            type="password"
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

                  <Controller
                    name="passwordConfirmation"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="signup-confirm">
                          Confirm
                        </FieldLabel>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                          <Input
                            {...field}
                            id="signup-confirm"
                            type="password"
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
                </div>
              </FieldGroup>

              <Button
                type="submit"
                className="w-full h-11 shadow-md rounded-xl transition-all active:scale-[0.98]"
                disabled={isSubmitting}
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

            {/* <ContinueWithGoogle /> */}

            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                className="text-primary font-medium hover:underline transition-colors"
                to="/sign-in"
              >
                Sign In
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
