import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { logoutAction } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

export function AdminShell({
  title,
  children,
  active
}: {
  title: string;
  active?: "dashboard" | "products";
  children: React.ReactNode;
}) {
  const linkClass = (key: typeof active) =>
    cn(
      "rounded-xl px-3 py-2 text-sm font-medium transition-colors",
      active === key ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-100"
    );

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <Container className="flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-slate-900" />
            <div>
              <div className="text-sm font-semibold leading-tight">Admin</div>
              <div className="text-xs text-slate-500">Product Dashboard</div>
            </div>
            <Badge className="ml-2 hidden sm:inline-flex">Next.js 14</Badge>
          </div>

          <nav className="flex items-center gap-1">
            <Link className={linkClass("dashboard")} href="/admin">
              Dashboard
            </Link>
            <Link className={linkClass("products")} href="/admin/products">
              Products
            </Link>
          </nav>

          <form action={logoutAction}>
            <Button variant="ghost" type="submit">
              Logout
            </Button>
          </form>
        </Container>
      </header>

      <main>
        <Container className="py-8">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          </div>
          {children}
        </Container>
      </main>
    </div>
  );
}

