"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { createSessionCookie, clearSessionCookie, requireAdmin } from "@/lib/auth";
import { verifyPassword } from "@/lib/password";
import { uploadProductImageFromFile } from "@/lib/supabase";

function getString(formData: FormData, key: string) {
  const v = formData.get(key);
  return typeof v === "string" ? v.trim() : "";
}

function getOptionalNumber(formData: FormData, key: string) {
  const raw = getString(formData, key);
  if (!raw) return undefined;
  const n = Number(raw);
  if (!Number.isFinite(n)) return undefined;
  return n;
}

function toCents(priceInput: string) {
  // Accept "12.34" or "12"
  const normalized = priceInput.replaceAll(",", "").trim();
  if (!normalized) return NaN;
  const n = Number(normalized);
  if (!Number.isFinite(n)) return NaN;
  return Math.round(n * 100);
}

export async function loginAction(formData: FormData) {
  const email = getString(formData, "email").toLowerCase();
  const password = getString(formData, "password");

  if (!email || !password) redirect("/admin/login?error=missing");

  const admin = await prisma.adminUser.findUnique({ where: { email } });
  if (!admin) redirect("/admin/login?error=invalid");
  if (!verifyPassword(password, admin.passwordHash)) redirect("/admin/login?error=invalid");

  await createSessionCookie({ sub: admin.id, email: admin.email });
  redirect("/admin");
}

export async function logoutAction() {
  clearSessionCookie();
  redirect("/admin/login");
}

export async function createProductAction(formData: FormData) {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");

  const name = getString(formData, "name");
  const description = getString(formData, "description");
  const imageUrlFromInput = getString(formData, "imageUrl");
  const imageFile = formData.get("imageFile") as File | null;
  const fit = getString(formData, "fit") || null;
  const gsm = getOptionalNumber(formData, "gsm");
  const fabric = getString(formData, "fabric") || null;
  const statusRaw = getString(formData, "status");
  const status = statusRaw === "published" ? "PUBLISHED" : "DRAFT";
  const price = getString(formData, "price");
  const priceCents = toCents(price);

  let finalImageUrl = imageUrlFromInput;

  if (imageFile && typeof imageFile === "object" && "size" in imageFile && (imageFile as File).size > 0) {
    finalImageUrl = await uploadProductImageFromFile(imageFile);
  }

  if (!name || !description || !finalImageUrl || !Number.isFinite(priceCents) || priceCents < 0) {
    redirect("/admin/products/new?error=validation");
  }

  await prisma.product.create({
    data: {
      name,
      description,
      imageUrl: finalImageUrl,
      priceCents,
      fit: fit || undefined,
      gsm: gsm ?? undefined,
      fabric: fabric || undefined,
      status
    }
  });

  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function updateProductAction(productId: string, formData: FormData) {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");

  const name = getString(formData, "name");
  const description = getString(formData, "description");
  const imageUrlFromInput = getString(formData, "imageUrl");
  const imageFile = formData.get("imageFile") as File | null;
  const fit = getString(formData, "fit") || null;
  const gsm = getOptionalNumber(formData, "gsm");
  const fabric = getString(formData, "fabric") || null;
  const statusRaw = getString(formData, "status");
  const status = statusRaw === "published" ? "PUBLISHED" : "DRAFT";
  const price = getString(formData, "price");
  const priceCents = toCents(price);

  const existing = await prisma.product.findUnique({ where: { id: productId } });
  if (!existing) redirect("/admin/products");

  let finalImageUrl = imageUrlFromInput || existing.imageUrl;

  if (imageFile && typeof imageFile === "object" && "size" in imageFile && (imageFile as File).size > 0) {
    finalImageUrl = await uploadProductImageFromFile(imageFile, { productId });
  }

  if (!name || !description || !finalImageUrl || !Number.isFinite(priceCents) || priceCents < 0) {
    redirect(`/admin/products/${productId}/edit?error=validation`);
  }

  await prisma.product.update({
    where: { id: productId },
    data: {
      name,
      description,
      imageUrl: finalImageUrl,
      priceCents,
      fit: fit || undefined,
      gsm: gsm ?? undefined,
      fabric: fabric || undefined,
      status
    }
  });

  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function deleteProductAction(productId: string) {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");

  await prisma.product.delete({ where: { id: productId } });
  revalidatePath("/admin/products");
  redirect("/admin/products");
}

