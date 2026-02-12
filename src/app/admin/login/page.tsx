import Link from "next/link";
import { loginAction } from "@/app/admin/actions";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AdminLoginPage({
  searchParams
}: {
  searchParams?: { error?: string };
}) {
  const error = searchParams?.error;
  const message =
    error === "invalid"
      ? "Invalid email or password."
      : error === "missing"
        ? "Please enter your email and password."
        : error === "auth"
          ? "Please sign in to continue."
          : null;

  return (
    <div className="min-h-screen bg-grid">
      <header className="border-b border-slate-200 bg-white/70 backdrop-blur">
        <Container className="flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-slate-900" />
            <div>
              <div className="text-sm font-semibold">Admin Login</div>
              <div className="text-xs text-slate-500">Product Dashboard</div>
            </div>
          </div>
          <Link className="text-sm font-medium text-slate-700 hover:underline" href="/">
            Back to site
          </Link>
        </Container>
      </header>

      <main>
        <Container className="py-12">
          <div className="mx-auto max-w-md">
            <Card title="Sign in" description="Use the seeded admin credentials to access the dashboard.">
              {message && (
                <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {message}
                </div>
              )}

              <form className="space-y-4" action={loginAction}>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" placeholder="admin@example.com" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" name="password" type="password" placeholder="••••••••" required />
                </div>
                <Button className="w-full" type="submit">
                  Sign in
                </Button>
              </form>

              <div className="mt-4 text-xs text-slate-500">
                Default seed: <span className="font-medium">admin@example.com</span> /{" "}
                <span className="font-medium">admin12345</span>
              </div>
            </Card>
          </div>
        </Container>
      </main>
    </div>
  );
}

