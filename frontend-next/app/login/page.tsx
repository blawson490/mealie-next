"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchAppConfig } from "@/lib/api/config";
import { AppAboutConfig } from "@/lib/types/app-config";

export default function LoginPage() {
  const router = useRouter();
  const [config, setConfig] = useState<AppAboutConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Form state
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch config on mount
  useEffect(() => {
    const loadConfig = async () => {
      try {
        const data = await fetchAppConfig();
        setConfig(data);
        
        // Auto-redirect to OIDC if both enableOidc and oidcRedirect are true
        if (data.enableOidc && data.oidcRedirect) {
          window.location.href = "/api/auth/oidc/login";
          return;
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load configuration");
      } finally {
        setLoading(false);
      }
    };

    loadConfig();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // TODO: Implement actual login API call
      console.log("Login attempt:", { usernameOrEmail, password });
      // For now, just log the attempt
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOidcLogin = () => {
    window.location.href = "/api/auth/oidc/login";
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-orange-500 border-r-transparent"></div>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (error && !config) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="max-w-md rounded-lg bg-white p-8 shadow-lg dark:bg-gray-800">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
              <svg className="h-6 w-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">Error</h2>
            <p className="text-gray-600 dark:text-gray-400">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-12 dark:from-gray-900 dark:to-gray-800 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {/* Logo/Title */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Mealie
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Your Recipe Manager & Meal Planner
          </p>
        </div>

        {/* Login Card */}
        <div className="overflow-hidden rounded-lg bg-white shadow-xl dark:bg-gray-800">
          {/* Demo Mode Banner */}
          {config?.demoStatus && (
            <div className="bg-orange-500 px-4 py-3 text-center text-sm font-medium text-white">
              Demo Mode Active
            </div>
          )}

          <div className="px-6 py-8 sm:px-10">
            <h2 className="mb-6 text-center text-2xl font-semibold text-gray-900 dark:text-white">
              Sign In
            </h2>

            {error && config && (
              <div className="mb-4 rounded-md bg-red-50 p-4 dark:bg-red-900/20">
                <p className="text-sm text-red-800 dark:text-red-400">{error}</p>
              </div>
            )}

            {/* OIDC Login Button */}
            {config?.enableOidc && (
              <div className="mb-6">
                <button
                  type="button"
                  onClick={handleOidcLogin}
                  className="flex w-full items-center justify-center gap-3 rounded-lg border-2 border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Login with {config.oidcProviderName}
                </button>
              </div>
            )}

            {/* Divider - only show if both OIDC and password login are enabled */}
            {config?.enableOidc && config?.allowPasswordLogin && (
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-2 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                    Or continue with
                  </span>
                </div>
              </div>
            )}

            {/* Password Login Form */}
            {config?.allowPasswordLogin && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label 
                    htmlFor="usernameOrEmail" 
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Username or Email
                  </label>
                  <input
                    id="usernameOrEmail"
                    name="usernameOrEmail"
                    type="text"
                    autoComplete="username"
                    required
                    value={usernameOrEmail}
                    onChange={(e) => setUsernameOrEmail(e.target.value)}
                    className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-400 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500"
                    placeholder="Enter username or email"
                  />
                </div>

                <div>
                  <label 
                    htmlFor="password" 
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder-gray-400 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-500"
                    placeholder="Enter your password"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                      Remember me
                    </label>
                  </div>

                  <div className="text-sm">
                    <a href="#" className="font-medium text-orange-600 hover:text-orange-500 dark:text-orange-400">
                      Forgot password?
                    </a>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex w-full justify-center rounded-lg bg-orange-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-orange-500 dark:hover:bg-orange-600"
                >
                  {isSubmitting ? "Signing in..." : "Sign In"}
                </button>
              </form>
            )}

            {/* No login methods available message */}
            {!config?.allowPasswordLogin && !config?.enableOidc && (
              <div className="rounded-md bg-yellow-50 p-4 dark:bg-yellow-900/20">
                <p className="text-center text-sm text-yellow-800 dark:text-yellow-400">
                  No login methods are currently available. Please contact your administrator.
                </p>
              </div>
            )}

            {/* Sign Up Link */}
            {config?.allowSignup && (
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Don&apos;t have an account?{" "}
                  <button
                    onClick={() => router.push("/register")}
                    className="font-medium text-orange-600 hover:text-orange-500 dark:text-orange-400"
                  >
                    Sign up
                  </button>
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-xs text-gray-500 dark:text-gray-400">
          {config?.version && `Version ${config.version}`}
        </p>
      </div>
    </div>
  );
}
