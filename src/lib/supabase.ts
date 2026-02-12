import "server-only";

import { createClient } from "@supabase/supabase-js";

const BUCKET_NAME = "products";

function getSupabaseServiceClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  }

  return createClient(url, key, {
    auth: { persistSession: false },
    global: { headers: { "X-Client-Info": "thirtee6-admin-storage" } }
  });
}

export async function uploadProductImageFromFile(file: File, opts?: { existingUrl?: string | null; productId?: string }) {
  const supabase = getSupabaseServiceClient();

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const ext = file.name.split(".").pop() || "jpg";
  const timestamp = Date.now();
  const base = opts?.productId ?? "product";
  const path = `${base}/${timestamp}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabase.storage.from(BUCKET_NAME).upload(path, buffer, {
    contentType: file.type || "image/jpeg",
    upsert: false
  });

  if (error) {
    console.error("Supabase upload error", error);
    throw new Error("Failed to upload image");
  }

  const { data: publicData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(path);
  return publicData.publicUrl;
}

