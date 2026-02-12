import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AdminShell } from "@/components/admin/admin-shell";
import { Card } from "@/components/ui/card";
import { ProductForm } from "@/components/admin/product-form";
import { updateProductAction } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";

export default async function EditProductPage({
  params,
  searchParams
}: {
  params: { id: string };
  searchParams?: { error?: string };
}) {
  const product = await prisma.product.findUnique({ where: { id: params.id } });
  if (!product) notFound();

  const error = searchParams?.error;
  const message = error === "validation" ? "Please fill out all fields with a valid price." : null;

  return (
    <AdminShell title="Edit product" active="products">
      <div className="mb-4 flex items-center justify-between gap-3">
        <Link href="/admin/products">
          <Button variant="ghost" size="sm">
            ← Back to products
          </Button>
        </Link>
      </div>

      <Card title={product.name} description="Update product details.">
        <ProductForm
          action={async (formData) => {
            "use server";
            await updateProductAction(product.id, formData);
          }}
          submitLabel="Save changes"
          errorMessage={message}
          defaultValues={{
            name: product.name,
            description: product.description,
            imageUrl: product.imageUrl,
            price: (product.priceCents / 100).toFixed(2),
            fit: product.fit ?? "",
            gsm: product.gsm != null ? String(product.gsm) : "",
            fabric: product.fabric ?? "",
            status: product.status === "PUBLISHED" ? "published" : "draft"
          }}
        />
      </Card>
    </AdminShell>
  );
}

