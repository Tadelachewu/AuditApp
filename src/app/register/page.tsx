"use client";

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { register } from '@/lib/actions';
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
      {pending ? "Creating Account..." : "Create an account"}
    </Button>
  );
}

export default function RegisterPage() {
  const [state, formAction] = useActionState(register, undefined);

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-xl">Sign Up</CardTitle>
          <CardDescription>
            Enter your information to create an account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-4">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Developer Note</AlertTitle>
            <AlertDescription>
              Registration is disabled while auth is mocked. To switch users, edit{" "}
              <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
                src/lib/session.ts
              </code>.
            </AlertDescription>
          </Alert>
          <form action={formAction} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Full name</Label>
              <Input id="name" name="name" placeholder="John Doe" required />
               {state?.errors?.name && <p className="text-sm text-destructive">{state.errors.name[0]}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                name="email"
                placeholder="m@example.com"
                required
              />
              {state?.errors?.email && <p className="text-sm text-destructive">{state.errors.email[0]}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" name="password" required />
              {state?.errors?.password && <p className="text-sm text-destructive">{state.errors.password[0]}</p>}
            </div>
             {state?.message && (
              <p className="text-sm text-destructive">{state.message}</p>
            )}
            <SubmitButton />
          </form>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
