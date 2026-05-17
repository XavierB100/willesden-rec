import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getSupabaseServiceClient } from "@/lib/data";

export async function requireAdmin(request: Request) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const adminEmail = process.env.ADMIN_EMAIL;
    const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");

    if (!url || !anonKey || !adminEmail) {
        return {
            error: NextResponse.json(
                { error: "Admin environment variables are not configured." },
                { status: 503 },
            ),
        };
    }

    if (!token) {
        return {
            error: NextResponse.json({ error: "Missing admin session." }, { status: 401 }),
        };
    }

    const authClient = createClient(url, anonKey, {
        auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data, error } = await authClient.auth.getUser(token);

    if (error || !data.user || data.user.email !== adminEmail) {
        return {
            error: NextResponse.json({ error: "Not authorised." }, { status: 403 }),
        };
    }

    return {
        user: data.user,
        supabase: getSupabaseServiceClient(),
    };
}
