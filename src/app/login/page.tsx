"use client";

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { login } from '@/lib/actions';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from 'next/link';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button className="w-full" type="submit" aria-disabled={pending}>
      {pending ? "Signing In..." : "Sign In"}
    </Button>
  );
}

export default function LoginPage() {
  const [state, formAction] = useActionState(login, undefined);

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-4">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Developer Note</AlertTitle>
            <AlertDescription>
              Authentication is mocked. To switch users, edit{" "}
              <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                src/lib/session.ts
              </code>
              . The default password is{" "}
              <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                password123
              </code>
              .
            </AlertDescription>
          </Alert>
          <form action={formAction} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                name="email"
                placeholder="m@example.com"
                required
                defaultValue="auditor@xbank.com"
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input id="password" type="password" name="password" required />
            </div>
            {state?.message && (
              <p className="text-sm text-destructive">{state.message}</p>
            )}
            <SubmitButton />
          </form>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
