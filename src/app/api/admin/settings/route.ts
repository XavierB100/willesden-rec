import { NextResponse } from "next/server";
import { DEFAULT_SITE_SETTINGS, getSiteSettings, type SiteSettings } from "@/lib/data";
import { requireAdmin } from "@/lib/admin-auth";

function normalizeSettings(input: Partial<SiteSettings>): SiteSettings {
    return {
        businessName: input.businessName?.trim() || DEFAULT_SITE_SETTINGS.businessName,
        phone: input.phone?.trim() || DEFAULT_SITE_SETTINGS.phone,
        whatsappNumber:
            input.whatsappNumber?.replace(/[^0-9]/g, "") ||
            DEFAULT_SITE_SETTINGS.whatsappNumber,
        email: input.email?.trim() || DEFAULT_SITE_SETTINGS.email,
        addressLines: Array.isArray(input.addressLines)
            ? input.addressLines.map((line) => line.trim()).filter(Boolean)
            : DEFAULT_SITE_SETTINGS.addressLines,
        mapEmbedUrl: input.mapEmbedUrl?.trim() || DEFAULT_SITE_SETTINGS.mapEmbedUrl,
        openingHours: Array.isArray(input.openingHours)
            ? input.openingHours.filter((row) => row.label?.trim() && row.value?.trim())
            : DEFAULT_SITE_SETTINGS.openingHours,
    };
}

export async function GET(request: Request) {
    const admin = await requireAdmin(request);
    if (admin.error) return admin.error;

    return NextResponse.json({ settings: await getSiteSettings() });
}

export async function PUT(request: Request) {
    const admin = await requireAdmin(request);
    if (admin.error) return admin.error;

    const settings = normalizeSettings(await request.json());
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

    return NextResponse.json({ settings });
}
