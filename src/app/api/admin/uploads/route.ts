import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";

const BUCKET = "product-images";
const MAX_IMAGE_BYTES = 4 * 1024 * 1024;
const IMAGE_TYPES = new Set([
    "image/jpeg", "image/png", "image/webp", "image/avif", "image/gif",
]);

export async function POST(request: Request) {
    const admin = await requireAdmin(request);
    if (admin.error) return admin.error;

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
        return NextResponse.json({ error: "Upload a valid image file." }, { status: 400 });
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

    const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `${Date.now()}-${crypto.randomUUID()}.${extension}`;
    const bytes = await file.arrayBuffer();

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
