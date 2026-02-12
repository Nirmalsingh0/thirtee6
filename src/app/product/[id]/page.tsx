import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { formatMoneyFromCents } from "@/lib/money";

type PageProps = {
  params: { id: string };
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const product = await prisma.product.findFirst({
    where: { id: params.id, status: "PUBLISHED" }
  });

  if (!product) {
    return {
      title: "Product not found • Thirtee6"
    };
  }

  return {
    title: `${product.name} • Thirtee6`,
    description: product.description
  };
}

export default async function ProductPage({ params }: PageProps) {
  const product = await prisma.product.findFirst({
    where: { id: params.id, status: "PUBLISHED" }
  });

  if (!product) notFound();

  return (
    <div className="min-h-screen bg-white text-black">
      <header className="border-b border-black/10 bg-white">
        <Container className="flex items-center justify-between py-4">
          <Link href="/" className="text-xs font-semibold uppercase tracking-[0.25em]">
            Thirtee6
          </Link>
          <nav className="flex items-center gap-6 text-xs uppercase tracking-[0.16em]">
            <Link href="/shop" className="hover:text-black/60">
              Shop
            </Link>
          </nav>
        </Container>
      </header>

      <main>
        <Container className="py-10 sm:py-14">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:items-start">
            <div className="border border-black/10 bg-black/5">
              <div className="relative aspect-[4/5] overflow-hidden">
                {product.imageUrl ? (
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-[10px] uppercase tracking-[0.18em] text-black/40">
                    No image
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-black/50">Oversized Tee</p>
                <h1 className="mt-2 text-2xl font-semibold uppercase tracking-[0.24em]">{product.name}</h1>
                <div className="mt-3 text-sm font-medium">{formatMoneyFromCents(product.priceCents)}</div>
              </div>

              <div className="space-y-3 text-sm text-black/70">
                <p>{product.description}</p>
              </div>

              <div className="grid gap-4 text-xs text-black/70 sm:grid-cols-3">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-black/50">Fit</div>
                  <p className="mt-1">{product.fit || "Oversized / boxy cut"}</p>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-black/50">GSM</div>
                  <p className="mt-1">{product.gsm ? `${product.gsm} gsm` : "Heavyweight cotton"}</p>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-black/50">Fabric</div>
                  <p className="mt-1">{product.fabric || "100% cotton"}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Button
                  className="rounded-none border border-black bg-black px-10 text-xs font-semibold uppercase tracking-[0.2em] text-white hover:bg-white hover:text-black"
                  type="button"
                >
                  Add to cart
                </Button>
                <span className="text-[11px] uppercase tracking-[0.16em] text-black/50">
                  Cart and checkout coming soon
                </span>
              </div>
            </div>
          </div>
        </Container>
      </main>
    </div>
  );
}

