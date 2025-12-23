"use client";
import { useAuth } from "@/lib/auth/auth-context";
import { Button } from "./button";
import Link from "next/link";

/**
 * Renders a login button that navigates the user to the login page when clicked.
 *
 *
 * @returns A React element: a Button that contains a Link to the login page.
 */
export function LoginButton() {
  return (
    <Button variant="default">
      <Link href="/login">Login</Link>
    </Button>
  );
}
