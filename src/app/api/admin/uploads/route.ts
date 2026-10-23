import sharp from "sharp";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";

const BUCKET = "product-images";
const MAX_IMAGE_BYTES = 4 * 1024 * 1024;
const IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
]);

export async function POST(request: Request) {
  const admin = await requireAdmin(request);
  if (admin.error) return admin.error;

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { error: "Upload a valid image file." },
      { status: 400 },
    );
  }
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json(
      { error: "Upload a valid image file." },
      { status: 400 },
    );
  }

  if (!IMAGE_TYPES.has(file.type)) {
    return NextResponse.json(
      { error: "Upload a JPEG, PNG, WebP, AVIF, or GIF image." },
      { status: 400 },
    );
  }

  if (file.size > MAX_IMAGE_BYTES) {
    return NextResponse.json(
      { error: "Each image must be 4 MB or smaller." },
      { status: 413 },
    );
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  let extension: string;
  try {
    const metadata = await sharp(bytes, {
      limitInputPixels: 40000000,
    }).metadata();
    const formats: Record<string, string> = {
      jpeg: "image/jpeg",
      png: "image/png",
      webp: "image/webp",
      avif: "image/avif",
      heif: "image/avif",
      gif: "image/gif",
    };
    if (
      !metadata.format ||
      formats[metadata.format] !== file.type ||
      !metadata.width ||
      !metadata.height
    )
      throw new Error("Invalid image");
    extension = file.type.split("/")[1];
  } catch {
    return NextResponse.json(
      { error: "Upload a valid JPEG, PNG, WebP, AVIF, or GIF image." },
      { status: 400 },
    );
  }
  const path = `${Date.now()}-${crypto.randomUUID()}.${extension}`;

  const { error } = await admin.supabase.storage
    .from(BUCKET)
    .upload(path, bytes, {
      contentType: file.type,
      cacheControl: "31536000",
      upsert: false,
    });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data } = admin.supabase.storage.from(BUCKET).getPublicUrl(path);
  return NextResponse.json({ url: data.publicUrl, path });
}
