import Image from "next/image";
import Link from "next/link";
import { AdminShell } from "@/components/admin/admin-shell";
import { prisma } from "@/lib/prisma";
import { formatMoneyFromCents } from "@/lib/money";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, Td, Th } from "@/components/ui/table";
import { deleteProductAction } from "@/app/admin/actions";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <AdminShell title="Products" active="products">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="text-sm text-slate-600">{products.length} total</div>
        <Link href="/admin/products/new">
          <Button>Add product</Button>
        </Link>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <Table>
            <thead>
              <tr>
                <Th>Product</Th>
                <Th>Price</Th>
                <Th className="hidden md:table-cell">Fit / GSM</Th>
                <Th className="hidden lg:table-cell">Status</Th>
                <Th className="hidden lg:table-cell">Description</Th>
                <Th className="text-right">Actions</Th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <Td>
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                        <Image src={p.imageUrl} alt={p.name} fill className="object-cover" sizes="40px" />
                      </div>
                      <div className="min-w-0">
                        <div className="truncate font-medium">{p.name}</div>
                        <div className="truncate text-xs text-slate-500">{p.id}</div>
                      </div>
                    </div>
                  </Td>
                  <Td className="font-semibold">{formatMoneyFromCents(p.priceCents)}</Td>
                  <Td className="hidden text-slate-600 md:table-cell">
                    <div className="text-sm">
                      <div className="font-medium">{p.fit || "—"}</div>
                      <div className="text-xs text-slate-500">{p.gsm ? `${p.gsm} gsm` : ""}</div>
                    </div>
                  </Td>
                  <Td className="hidden text-slate-600 lg:table-cell">
                    <span
                      className={
                        p.status === "PUBLISHED"
                          ? "inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700"
                          : "inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700"
                      }
                    >
                      {p.status === "PUBLISHED" ? "Published" : "Draft"}
                    </span>
                  </Td>
                  <Td className="hidden max-w-[520px] text-slate-600 lg:table-cell">
                    <div className="max-h-10 overflow-hidden text-ellipsis">{p.description}</div>
                  </Td>
                  <Td>
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/products/${p.id}/edit`}>
                        <Button size="sm" variant="secondary">
                          Edit
                        </Button>
                      </Link>
                      <form
                        action={async () => {
                          "use server";
                          await deleteProductAction(p.id);
                        }}
                      >
                        <Button size="sm" variant="danger" type="submit">
                          Delete
                        </Button>
                      </form>
                    </div>
                  </Td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <Td colSpan={4} className="py-10 text-center text-slate-600">
                    No products yet.{" "}
                    <Link className="font-medium text-slate-900 underline" href="/admin/products/new">
                      Add your first product
                    </Link>
                    .
                  </Td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </Card>
    </AdminShell>
  );
}

