import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";

const BUCKET = "product-images";

export async function POST(request: Request) {
    const admin = await requireAdmin(request);
    if (admin.error) return admin.error;

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
        return NextResponse.json({ error: "Upload a valid image file." }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
        return NextResponse.json({ error: "Only image uploads are allowed." }, { status: 400 });
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
