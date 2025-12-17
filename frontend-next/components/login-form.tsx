"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Badge } from "./ui/badge";
import { Alert, AlertTitle, AlertDescription } from "./ui/alert";
import {
  Check,
  Copy,
  Folder,
  GithubIcon,
  Heart,
  Info,
  LucideFileExclamationPoint,
} from "lucide-react";
import { useState } from "react";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="w-full flex justify-center">
        <div className="flex flex-row items-center gap-3">
          <div className="rounded-full bg-orange-400 p-2">
            <svg
              className="text-white"
              viewBox="0 0 24 24"
              style={{ width: "30px", height: "30px" }}
              aria-label="Mealie logo"
            >
              <path
                fill="currentColor"
                d="M8.1,13.34L3.91,9.16C2.35,7.59 2.35,5.06 3.91,3.5L10.93,10.5L8.1,13.34M13.41,13L20.29,19.88L18.88,21.29L12,14.41L5.12,21.29L3.71,19.88L13.36,10.22L13.16,10C12.38,9.23 12.38,7.97 13.16,7.19L17.5,2.82L18.43,3.74L15.19,7L16.15,7.94L19.39,4.69L20.31,5.61L17.06,8.85L18,9.81L21.26,6.56L22.18,7.5L17.81,11.84C17.03,12.62 15.77,12.62 15,11.84L14.78,11.64L13.41,13Z"
              />
            </svg>
          </div>
          <span className="text-3xl font-light">Mealie</span>
        </div>
      </div>
      {/* TODO: pt-0 IF DEMO MODE */}
      <Card className="w-[320px] sm:w-[375px] sm:min-w-[375px]">
        {/* <div className="bg-primary px-4 py-3 text-center text-sm font-bold text-white">
          Demo Mode Active
        </div> */}
        <CardHeader className="justify-center items-center text-center p-2">
          <CardTitle>Welcome</CardTitle>
          <CardDescription>Sign in to your account</CardDescription>
          <Alert variant="info">
            <Info />
            <div className="flex flex-col">
              <AlertTitle>
                It looks like this is your first time logging in.
              </AlertTitle>
              <AlertDescription>
                Don't want to see this anymore? Be sure to change your email in
                your user settings!
              </AlertDescription>
              <div className="flex flex-col gap-2 mt-4">
                <CredentialRow label="Username" value="changeme@example.com" />
                <CredentialRow label="Password" value="MyPassword" isPassword />
              </div>
            </div>
          </Alert>
        </CardHeader>
        <CardContent>
          <form>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email or Username</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  required
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <a
                    href="#"
                    className="ml-auto inline-block text-xs underline-offset-4 hover:underline text-primary"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input id="password" type="password" required />
                <div className="flex items-center gap-2">
                  <Checkbox id="remember" />
                  <FieldLabel htmlFor="remember">Remember me</FieldLabel>
                </div>
              </Field>
              <Field>
                <Button type="submit">Login</Button>

                {/* If Allowed sign up */}
                <FieldDescription className="text-center pt-2">
                  Don&apos;t have an account? <a href="#">Sign up</a>
                </FieldDescription>
                {/* Else */}
                {/* <FieldDescription className="text-center">
                  <Badge variant="secondary" className="ml-auto">
                    Invite Only
                  </Badge>
                </FieldDescription> */}

                {/* <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-zinc-300 dark:border-zinc-600"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-white px-2 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                      OR
                    </span>
                  </div>
                </div>
                <Button variant="outline" type="button">
                  Login with Google
                </Button> */}
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      {/* Buttons */}
      <div className="flex gap-2 justify-center">
        <Button variant="outline" size="sm" className="bg-white">
          <Heart /> Sponsor
        </Button>
        <Button variant="outline" size="sm" className="bg-white">
          <GithubIcon /> Github
        </Button>
        <Button variant="outline" size="sm" className="bg-white">
          <Folder /> Docs
        </Button>
      </div>
      <div className="mt-8 text-center text-xs text-zinc-500 dark:text-zinc-500">
        <p>Version 1.0.0</p>
      </div>
    </div>
  );
}

const CredentialRow = ({ label, value, isPassword }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    // <div className="flex items-center justify-between rounded px-2 py-1 border border-blue-500/20 group-hover:border-blue-500/30 transition-colors">
    <div className="flex items-center justify-between rounded-md px-3 py-2 border bg-white/60 border-blue-200 dark:bg-black/40 dark:border-blue-700/50 ">
      <div className="flex flex-col">
        <span className="text-[10px] uppercase text-blue-400/70 font-bold ">
          {label}
        </span>
        <code className="text-xs text-blue-900 font-mono mt-0.5">
          {isPassword ? (
            <span className="tracking-widest">••••••••••</span>
          ) : (
            value
          )}
        </code>
      </div>
      <button
        onClick={handleCopy}
        className="text-slate-400 hover:text-white transition-colors p-1.5 hover:bg-white/10 rounded-md "
        title="Copy to clipboard"
      >
        {copied ? (
          <Check size={14} className="text-green-400" />
        ) : (
          <Copy size={14} />
        )}
      </button>
    </div>
  );
};
