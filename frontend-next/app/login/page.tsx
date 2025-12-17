"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchAppConfig } from "@/lib/api/app-config";
import type { AppConfig } from "@/lib/types/app-config";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function loadConfig() {
      try {
        const appConfig = await fetchAppConfig();
        setConfig(appConfig);

        // Auto-redirect to OIDC if enabled and redirect is true
        if (appConfig.enableOidc && appConfig.oidcRedirect) {
          // Use window.location.href for OIDC as it requires full page redirect to IdP
          window.location.href = "/api/auth/oidc/login";
          return;
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load configuration"
        );
      } finally {
        setLoading(false);
      }
    }

    loadConfig();
  }, []);

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // TODO: Implement actual login API call
      // Placeholder for actual authentication
      await new Promise((resolve) => setTimeout(resolve, 1000));
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOidcLogin = () => {
    // Use window.location.href for OIDC as it requires full page redirect to IdP
    window.location.href = "/api/auth/oidc/login";
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-900">
        <div className="text-center flex flex-col items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-orange-400" />
          <p className="mt-4 ml-2 text-zinc-600 dark:text-zinc-400">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-900">
        <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg dark:bg-zinc-800">
          <div className="text-center text-red-600 dark:text-red-400">
            {error || "Failed to load application configuration"}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-4 dark:bg-zinc-900">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          {/* Logo */}
          <div className="flex flex-row items-center gap-4">
            <div className="rounded-full bg-orange-400 p-2">
              <svg
                className="icon-white"
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
            <span className="text-3xl font-light text-zinc-900 dark:text-white">
              Mealie
            </span>
          </div>
        </div>
        {/* Login Card */}
        <div className="overflow-hidden rounded-lg bg-white shadow-xl dark:bg-zinc-800">
          {/* Demo Banner */}
          {config.demoStatus && (
            <div className="bg-orange-400 px-4 py-3 text-center text-sm font-medium text-white">
              Demo Mode Active
            </div>
          )}

          {/* Card Content */}
          <div className="p-8">
            {/* Logo/Title */}
            <div className="mb-8 text-center">
              <h1 className="text-xl font-bold text-zinc-900 dark:text-white">
                Welcome
              </h1>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                Sign in to your account
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-800 dark:bg-red-900/20 dark:text-red-400">
                {error}
              </div>
            )}

            {/* Password Login Form */}
            {config.allowPasswordLogin && (
              <form onSubmit={handlePasswordLogin} className="space-y-4">
                <div>
                  <label
                    htmlFor="email"
                    className="text-sm font-medium text-slate-700 dark:text-zinc-300 block"
                  >
                    Email or Username
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 placeholder-zinc-400 focus:border-orange-400 focus:outline-none focus:ring-1 focus:ring-orange-400 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white dark:placeholder-zinc-500 dark:focus:border-orange-400"
                    placeholder="you@example.com"
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                    >
                      Password
                    </label>
                    <div className="text-center text-xs">
                      <a
                        href="/reset-password"
                        className="font-medium text-orange-400 hover:text-orange-500 dark:text-orange-400 dark:hover:text-orange-300"
                      >
                        Forgot Password?
                      </a>
                    </div>
                  </div>
                  <input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 placeholder-zinc-400 focus:border-orange-400 focus:outline-none focus:ring-1 focus:ring-orange-400 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white dark:placeholder-zinc-500 dark:focus:border-orange-400"
                    placeholder="••••••••"
                    disabled={isSubmitting}
                  />
                  {/* Remember Me */}
                  <div className="flex items-center">
                    <input
                      id="rememberMe"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 rounded border-zinc-300 text-orange-400 focus:ring-orange-400 dark:border-zinc-600 dark:bg-zinc-700 dark:ring-offset-zinc-800"
                      disabled={isSubmitting}
                    />
                    <label
                      htmlFor="rememberMe"
                      className="ml-2 block text-sm text-zinc-700 dark:text-zinc-300"
                    >
                      Remember Me
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-md bg-orange-400 px-4 py-2 font-medium text-white transition-colors hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:focus:ring-offset-zinc-800"
                >
                  {isSubmitting ? "Signing in..." : "Sign in"}
                </button>
              </form>
            )}

            {/* No Login Methods Available */}
            {!config.allowPasswordLogin && !config.enableOidc && (
              <div className="text-center text-zinc-600 dark:text-zinc-400">
                No login methods are currently available. Please contact your
                administrator.
              </div>
            )}

            <div className="flex flex-row justify-between">
              {/* Sign Up Link */}
              {config.allowSignup && (
                <div className="mt-4 text-center text-xs">
                  <span className="text-zinc-600 dark:text-zinc-400">
                    Don&apos;t have an account?{" "}
                  </span>
                  <a
                    href="/register"
                    className="font-medium text-orange-400 hover:text-orange-500 dark:text-orange-400 dark:hover:text-orange-300"
                  >
                    Sign up
                  </a>
                </div>
              )}
            </div>

            {/* Divider */}
            {config.enableOidc && config.allowPasswordLogin && (
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-zinc-300 dark:border-zinc-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-2 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                    OR
                  </span>
                </div>
              </div>
            )}

            {/* OIDC Login Button */}
            {config.enableOidc && (
              <button
                onClick={handleOidcLogin}
                className="mb-4 w-full rounded-md bg-orange-400 px-4 py-3 font-medium text-white transition-colors hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 dark:focus:ring-offset-zinc-800"
              >
                Login with {config.oidcProviderName || "SSO"}
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center font-mono text-xs text-zinc-500 dark:text-zinc-500">
          {config.version && <p>Version {config.version}</p>}
        </div>
      </div>
    </div>
  );
}
