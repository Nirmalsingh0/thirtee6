import Link from "next/link";
import { AdminShell } from "@/components/admin/admin-shell";
import { Card } from "@/components/ui/card";
import { createProductAction } from "@/app/admin/actions";
import { ProductForm } from "@/components/admin/product-form";
import { Button } from "@/components/ui/button";

export default function NewProductPage({ searchParams }: { searchParams?: { error?: string } }) {
  const error = searchParams?.error;
  const message = error === "validation" ? "Please fill out all fields with a valid price." : null;

  return (
    <AdminShell title="Add product" active="products">
      <div className="mb-4">
        <Link href="/admin/products">
          <Button variant="ghost" size="sm">
            ← Back to products
          </Button>
        </Link>
      </div>

      <Card title="New product" description="Create a new product for your catalog.">
        <ProductForm action={createProductAction} submitLabel="Create product" errorMessage={message} />
      </Card>
    </AdminShell>
  );
}

