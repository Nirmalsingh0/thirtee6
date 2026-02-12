import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-grid">
      <Container className="py-16">
        <div className="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-8 shadow-soft">
          <div className="text-sm font-semibold text-slate-500">404</div>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">Page not found</h1>
          <p className="mt-2 text-sm text-slate-600">The page you’re looking for doesn’t exist.</p>
          <div className="mt-6 flex gap-2">
            <Link href="/">
              <Button>Go home</Button>
            </Link>
            <Link href="/admin">
              <Button variant="secondary">Admin</Button>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}

