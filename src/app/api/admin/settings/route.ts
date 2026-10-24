import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import {
  DEFAULT_SITE_SETTINGS,
  getSiteSettings,
  type SiteSettings,
} from "@/lib/data";
import { requireAdmin } from "@/lib/admin-auth";

function normalizeMapEmbedUrl(input?: string) {
  const rawValue = input?.trim();
  if (!rawValue) return DEFAULT_SITE_SETTINGS.mapEmbedUrl;

  const iframeSrc = rawValue.match(/<iframe[^>]+src=["']([^"']+)["']/i)?.[1];
  const candidate = iframeSrc || rawValue;

  let url: URL;
  try {
    url = new URL(candidate);
  } catch {
    throw new Error(
      "Paste a valid Google Maps embed URL or the full iframe HTML from Google Maps.",
    );
  }

  if (url.protocol !== "https:")
    throw new Error("Use a secure Google Maps URL.");

  if (
    url.hostname === "maps.app.goo.gl" ||
    url.hostname.endsWith(".maps.app.goo.gl")
  ) {
    throw new Error(
      "Google Maps short links cannot be embedded directly. Use Share > Embed a map > Copy HTML, then paste that iframe here.",
    );
  }

  if (
    url.hostname !== "www.google.com" &&
    url.hostname !== "google.com" &&
    !url.hostname.endsWith(".google.com")
  ) {
    throw new Error("Only Google Maps embed URLs are supported.");
  }

  if (url.pathname.startsWith("/maps/embed")) {
    return url.toString();
  }

  if (url.pathname.startsWith("/maps")) {
    url.searchParams.set("output", "embed");
    return url.toString();
  }

  throw new Error(
    "Use a Google Maps embed URL, or paste the full iframe HTML from Share > Embed a map.",
  );
}

function normalizeSettings(input: Partial<SiteSettings>): SiteSettings {
  if (!input || typeof input !== "object")
    throw new Error("Invalid site details.");
  for (const field of [
    "businessName",
    "phone",
    "whatsappNumber",
    "email",
    "mapEmbedUrl",
  ] as const) {
    if (
      typeof input[field] !== "string" ||
      !input[field]?.trim() ||
      input[field]!.length > 5000
    )
      throw new Error("Complete all site details before saving.");
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email!))
    throw new Error("Enter a valid email address.");
  if (
    !/^\+?[\d\s()-]{7,25}$/.test(input.phone!) ||
    !/^\d{7,15}$/.test(input.whatsappNumber!.replace(/[^0-9]/g, ""))
  )
    throw new Error("Enter valid phone and WhatsApp numbers.");
  if (
    !Array.isArray(input.addressLines) ||
    !input.addressLines.length ||
    input.addressLines.length > 8 ||
    input.addressLines.some(
      (line) => typeof line !== "string" || !line.trim() || line.length > 300,
    )
  )
    throw new Error("Enter valid address lines.");
  if (
    !Array.isArray(input.openingHours) ||
    !input.openingHours.length ||
    input.openingHours.length > 14 ||
    input.openingHours.some(
      (row) =>
        !row ||
        typeof row.label !== "string" ||
        typeof row.value !== "string" ||
        !row.label.trim() ||
        !row.value.trim() ||
        row.label.length > 100 ||
        row.value.length > 100,
    )
  )
    throw new Error("Enter valid opening hours.");
  return {
    businessName:
      input.businessName?.trim() || DEFAULT_SITE_SETTINGS.businessName,
    phone: input.phone?.trim() || DEFAULT_SITE_SETTINGS.phone,
    whatsappNumber:
      input.whatsappNumber?.replace(/[^0-9]/g, "") ||
      DEFAULT_SITE_SETTINGS.whatsappNumber,
    email: input.email?.trim() || DEFAULT_SITE_SETTINGS.email,
    addressLines: Array.isArray(input.addressLines)
      ? input.addressLines.map((line) => line.trim()).filter(Boolean)
      : DEFAULT_SITE_SETTINGS.addressLines,
    mapEmbedUrl: normalizeMapEmbedUrl(input.mapEmbedUrl),
    openingHours: Array.isArray(input.openingHours)
      ? input.openingHours.filter(
          (row) => row.label?.trim() && row.value?.trim(),
        )
      : DEFAULT_SITE_SETTINGS.openingHours,
  };
}

export async function GET(request: Request) {
  const admin = await requireAdmin(request);
  if (admin.error) return admin.error;

  try {
    return NextResponse.json({ settings: await getSiteSettings(true) });
  } catch {
    return NextResponse.json(
      { error: "Could not load settings." },
      { status: 503 },
    );
  }
}

export async function PUT(request: Request) {
  const admin = await requireAdmin(request);
  if (admin.error) return admin.error;

  let settings: SiteSettings;
  try {
    settings = normalizeSettings(await request.json());
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Could not save settings.",
      },
      { status: 400 },
    );
  }

  const { error } = await admin.supabase.from("site_settings").upsert({
    id: true,
    business_name: settings.businessName,
    phone: settings.phone,
    whatsapp_number: settings.whatsappNumber,
    email: settings.email,
    address_lines: settings.addressLines,
    map_embed_url: settings.mapEmbedUrl,
    opening_hours: settings.openingHours,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  revalidatePath("/", "layout");
  return NextResponse.json({ settings });
}
