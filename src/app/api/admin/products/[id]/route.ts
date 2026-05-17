import { NextResponse } from "next/server";
import {
    PRODUCT_CATEGORIES,
    mapProduct,
    mapProductInput,
    type ProductInput,
    type ProductStatus,
} from "@/lib/data";
import { requireAdmin } from "@/lib/admin-auth";

interface RouteContext {
    params: Promise<{ id: string }>;
}

function parseProductInput(body: Partial<ProductInput>) {
    const title = body.title?.trim();
    const description = body.description?.trim() || "";
    const category = body.category;
    const status = body.status || "available";

    if (!title) throw new Error("Title is required.");
    if (!PRODUCT_CATEGORIES.includes(category as ProductInput["category"])) throw new Error("Choose a valid category.");
    if (!["available", "sold"].includes(status)) throw new Error("Choose a valid status.");

    return {
        title,
        slug: body.slug,
        description,
        price: body.price === null || body.price === undefined ? null : Number(body.price),
        category,
        imageUrls: Array.isArray(body.imageUrls) ? body.imageUrls : [],
        status: status as ProductStatus,
        dimensions: body.dimensions || null,
    } as ProductInput;
}

export async function PUT(request: Request, context: RouteContext) {
    const admin = await requireAdmin(request);
    if (admin.error) return admin.error;

    const { id } = await context.params;

    try {
        const input = parseProductInput(await request.json());
        const { data, error } = await admin.supabase
            .from("products")
            .update(mapProductInput(input))
            .eq("id", id)
            .select("*")
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ product: mapProduct(data) });
    } catch (error) {
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Invalid product data." },
            { status: 400 },
        );
    }
}

export async function DELETE(request: Request, context: RouteContext) {
    const admin = await requireAdmin(request);
    if (admin.error) return admin.error;

    const { id } = await context.params;
    const { error } = await admin.supabase.from("products").delete().eq("id", id);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
}
