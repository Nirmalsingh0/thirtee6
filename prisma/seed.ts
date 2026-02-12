import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    // Import crypto for password hashing
    const crypto = await import("crypto");

    const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

    // Create a salted hash matching the verifyPassword function format: "sha256:salt:digest"
    function makePasswordHash(password: string) {
        const salt = crypto.randomBytes(16).toString("hex");
        const hash = crypto.createHash("sha256");
        hash.update(`${salt}:${password}`);
        const digest = hash.digest("hex");
        return `sha256:${salt}:${digest}`;
    }

    const passwordHash = makePasswordHash(adminPassword);

    // Upsert admin user
    const admin = await prisma.adminUser.upsert({
        where: { email: adminEmail },
        update: {},
        create: {
            email: adminEmail,
            passwordHash: passwordHash,
        },
    });

    console.log(`✅ Seeded admin user: ${admin.email}`);

    // Optionally seed some sample products
    const products = await Promise.all([
        prisma.product.upsert({
            where: { id: "sample-1" },
            update: {},
            create: {
                id: "sample-1",
                name: "Classic White Tee",
                description: "Premium cotton t-shirt with a perfect fit",
                priceCents: 2999,
                imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
                fit: "Regular",
                gsm: 180,
                fabric: "100% Cotton",
                status: "PUBLISHED",
            },
        }),
        prisma.product.upsert({
            where: { id: "sample-2" },
            update: {},
            create: {
                id: "sample-2",
                name: "Navy Blue Polo",
                description: "Elegant polo shirt for a sophisticated look",
                priceCents: 3999,
                imageUrl: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400",
                fit: "Slim",
                gsm: 200,
                fabric: "Cotton Blend",
                status: "PUBLISHED",
            },
        }),
    ]);

    console.log(`✅ Seeded ${products.length} sample products`);
}

main()
    .catch((e) => {
        console.error("❌ Seed error:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
