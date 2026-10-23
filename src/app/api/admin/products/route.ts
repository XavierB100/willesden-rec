import { parseProductInput } from "@/lib/validation";
import { NextResponse } from "next/server";
import { mapProduct, mapProductInput } from "@/lib/data";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET(request: Request) {
  const admin = await requireAdmin(request);
  if (admin.error) return admin.error;

  const { data, error } = await admin.supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

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

  return NextResponse.json({
    products: (data || []).map((row) => mapProduct(row)),
  });
}

export async function POST(request: Request) {
  const admin = await requireAdmin(request);
  if (admin.error) return admin.error;

  try {
    const input = parseProductInput(await request.json());
    const { data, error } = await admin.supabase
      .from("products")
      .insert(mapProductInput(input))
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

    return NextResponse.json({ product: mapProduct(data) }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Invalid product data.",
      },
      { status: 400 },
    );
  }
}
