import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { formatMoneyFromCents } from "@/lib/money";

export const metadata: Metadata = {
  title: "Shop • Thirtee6",
  description: "Thirtee6 shop – heavyweight, oversized streetwear tees."
};

export default async function ShopPage() {
  const products = await prisma.product.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="min-h-screen bg-white text-black">
      <header className="border-b border-black/10 bg-white">
        <Container className="flex items-center justify-between py-4">
          <Link href="/" className="text-xs font-semibold tracking-[0.25em] uppercase">
            Thirtee6
          </Link>
          <nav className="flex items-center gap-6 text-xs uppercase tracking-[0.16em]">
            <Link href="/shop" className="font-semibold">
              Shop
            </Link>
            <a href="#about" className="text-black/60 hover:text-black">
              About
            </a>
          </nav>
        </Container>
      </header>

      <main>
        <Container className="py-10 sm:py-14">
          <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-semibold uppercase tracking-[0.3em]">
                Thirtee6
                <span className="block text-xl font-normal tracking-[0.28em] text-black/60">Studio Shop</span>
              </h1>
            </div>
            <div className="text-xs text-black/60">
              <div>Oversized, heavyweight, minimal graphics.</div>
              <div>All pieces in black & white.</div>
            </div>
          </div>

          <section aria-label="Products">
            {products.length === 0 ? (
              <div className="py-16 text-center text-sm text-black/60">
                Nothing is live yet. Check back soon.
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {products.map((product) => (
                  <Link
                    key={product.id}
                    href={`/product/${product.id}`}
                    className="group flex flex-col border border-black/10 bg-white transition hover:border-black"
                  >
                    <div className="relative aspect-[4/5] overflow-hidden bg-black/5">
                      {product.imageUrl ? (
                        <Image
                          src={product.imageUrl}
                          alt={product.name}
                          fill
                          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                          className="object-cover transition duration-700 group-hover:scale-[1.03]"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[10px] uppercase tracking-[0.18em] text-black/40">
                          No image
                        </div>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col justify-between px-4 py-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <div className="truncate text-sm font-medium uppercase tracking-[0.16em]">
                            {product.name}
                          </div>
                          <div className="mt-1 flex flex-wrap gap-1.5 text-[10px] uppercase tracking-[0.18em] text-black/50">
                            {product.fit && <span>{product.fit}</span>}
                            {product.gsm && <span>{product.gsm} gsm</span>}
                            {product.fabric && <span>{product.fabric}</span>}
                          </div>
                        </div>
                        <div className="shrink-0 text-xs font-medium">
                          {formatMoneyFromCents(product.priceCents)}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </Container>
      </main>
    </div>
  );
}

