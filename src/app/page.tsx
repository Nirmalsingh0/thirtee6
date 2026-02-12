import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { formatMoneyFromCents } from "@/lib/money";

export default async function HomePage() {
  const featured = await prisma.product.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { createdAt: "desc" },
    take: 3
  });

  return (
    <div className="min-h-screen bg-white text-black">
      <header className="border-b border-black/10 bg-white">
        <Container className="flex items-center justify-between py-4">
          <Link href="/" className="text-xs font-semibold tracking-[0.25em] uppercase">
            Thirtee6
          </Link>
          <nav className="flex items-center gap-6 text-xs uppercase tracking-[0.16em]">
            <Link href="/shop" className="hover:text-black/60">
              Shop
            </Link>
            <a href="#about" className="text-black/60 hover:text-black">
              About
            </a>
          </nav>
        </Container>
      </header>

      <main>
        <Container className="py-12 sm:py-16">
          <section className="grid gap-10 lg:grid-cols-[minmax(0,2.2fr)_minmax(0,1fr)] lg:items-end">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-black/60">Oversized Heavyweight Tees</p>
              <h1 className="mt-3 text-4xl font-semibold uppercase tracking-[0.3em] sm:text-5xl">
                Thirtee6
                <span className="mt-2 block text-2xl font-normal tracking-[0.32em] text-black/70">
                  Studio Uniforms
                </span>
              </h1>
              <p className="mt-5 max-w-xl text-sm text-black/70">
                Monochrome streetwear built around volume, drape, and everyday wear. Minimal graphics. Maximal silhouette.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link href="/shop">
                  <Button className="rounded-none border border-black bg-black px-8 text-xs font-semibold uppercase tracking-[0.2em] text-white hover:bg-white hover:text-black">
                    Enter shop
                  </Button>
                </Link>
                <Link href="/admin" className="text-[11px] uppercase tracking-[0.18em] text-black/40 hover:text-black/70">
                  Admin
                </Link>
              </div>
            </div>

            <div className="border border-black/10 p-5">
              <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-black/60">
                <span>Featured</span>
                <span>{featured.length.toString().padStart(2, "0")}</span>
              </div>
              <div className="mt-4 space-y-3">
                {featured.map((p) => (
                  <Link
                    key={p.id}
                    href={`/product/${p.id}`}
                    className="flex items-center justify-between border border-black/5 px-3 py-2 text-xs hover:border-black"
                  >
                    <div className="min-w-0">
                      <div className="truncate uppercase tracking-[0.18em]">{p.name}</div>
                      <div className="mt-0.5 flex flex-wrap gap-1 text-[10px] text-black/50">
                        {p.fit && <span>{p.fit}</span>}
                        {p.gsm && <span>{p.gsm} gsm</span>}
                      </div>
                    </div>
                    <div className="ml-3 shrink-0 text-[11px] font-medium">
                      {formatMoneyFromCents(p.priceCents)}
                    </div>
                  </Link>
                ))}
                {featured.length === 0 && (
                  <div className="border border-dashed border-black/15 px-3 py-6 text-[11px] text-black/60">
                    No products published yet. Add items in the admin to feature them here.
                  </div>
                )}
              </div>
            </div>
          </section>

          <section id="about" className="mt-16 border-t border-black/10 pt-8 text-xs text-black/60 sm:mt-20 sm:pt-10">
            <div className="grid gap-6 sm:grid-cols-3">
              <div>
                <div className="text-[10px] uppercase tracking-[0.2em]">Fabric</div>
                <p className="mt-2">
                  Heavyweight cotton with structure and drape, cut for layering over everything you already own.
                </p>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-[0.2em]">Fit</div>
                <p className="mt-2">
                  Boxy, oversized silhouettes with dropped shoulders and elongated hems – built around a single monochrome
                  palette.
                </p>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-[0.2em]">Process</div>
                <p className="mt-2">
                  Designed digitally, produced in small runs, and updated live via the Thirtee6 admin – no seasons, just
                  iterations.
                </p>
              </div>
            </div>
          </section>
        </Container>
      </main>
    </div>
  );
}

