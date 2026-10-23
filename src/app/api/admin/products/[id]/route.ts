import { parseProductInput } from "@/lib/validation";
import { NextResponse } from "next/server";
import { mapProduct, mapProductInput } from "@/lib/data";
import { requireAdmin } from "@/lib/admin-auth";

interface RouteContext {
  params: Promise<{ id: string }>;
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
      return NextResponse.json(
        {
          error:
            error.code === "23505"
              ? "A product with this slug already exists."
              : "Could not save product.",
        },
        {
          status:
            error.code === "23505"
              ? 409
              : error.code === "PGRST116"
                ? 404
                : 500,
        },
      );
    }

    return NextResponse.json({ product: mapProduct(data) });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Invalid product data.",
      },
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
    return NextResponse.json(
      {
        error:
          error.code === "23505"
            ? "A product with this slug already exists."
            : "Could not save product.",
      },
      {
        status:
          error.code === "23505" ? 409 : error.code === "PGRST116" ? 404 : 500,
      },
    );
  }

  return NextResponse.json({ ok: true });
}
