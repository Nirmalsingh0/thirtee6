import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AdminShell } from "@/components/admin/admin-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatMoneyFromCents } from "@/lib/money";

export default async function AdminDashboardPage() {
  const [productCount, latest] = await Promise.all([
    prisma.product.count(),
    prisma.product.findMany({ orderBy: { createdAt: "desc" }, take: 5 })
  ]);

  const totalValueCents = latest.reduce((acc, p) => acc + p.priceCents, 0);

  return (
    <AdminShell title="Dashboard" active="dashboard">
      <div className="grid gap-4 sm:grid-cols-3">
        <Card title="Total products" description={`${productCount} products in your catalog`}>
          <div className="mt-2 text-3xl font-semibold">{productCount}</div>
        </Card>
        <Card title="Latest 5 value" description="Sum of prices of latest products">
          <div className="mt-2 text-3xl font-semibold">{formatMoneyFromCents(totalValueCents)}</div>
        </Card>
        <Card title="Quick actions" description="Manage your catalog">
          <div className="mt-2 flex gap-2">
            <Link href="/admin/products/new">
              <Button>Add product</Button>
            </Link>
            <Link href="/admin/products">
              <Button variant="secondary">View list</Button>
            </Link>
          </div>
        </Card>
      </div>

      <div className="mt-6">
        <Card title="Recently added" description="Newest products in your catalog">
          <div className="divide-y divide-slate-100">
            {latest.map((p) => (
              <div key={p.id} className="flex items-center justify-between py-3">
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium">{p.name}</div>
                  <div className="truncate text-sm text-slate-600">{p.description}</div>
                </div>
                <div className="ml-4 shrink-0 text-sm font-semibold">{formatMoneyFromCents(p.priceCents)}</div>
              </div>
            ))}
            {latest.length === 0 && <div className="py-6 text-sm text-slate-600">No products yet. Add your first one.</div>}
          </div>
        </Card>
      </div>
    </AdminShell>
  );
}

