import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

const allowedStatuses = ["pending", "reviewed", "resolved", "archived"];

async function isAdminLoggedIn() {
  const cookieStore = await cookies();
  return cookieStore.get("alex_admin")?.value === "true";
}

export async function GET() {
  try {
    const isAdmin = await isAdminLoggedIn();

    if (!isAdmin) {
      return NextResponse.json({ error: "No autorizado." }, { status: 401 });
    }

    const { data, error } = await supabaseAdmin
      .from("suggestions")
      .select("id, name, category, message, status, created_at, updated_at")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading suggestions:", error);

      return NextResponse.json(
        { error: "No se pudieron cargar las sugerencias." },
        { status: 500 }
      );
    }

    return NextResponse.json({ suggestions: data ?? [] });
  } catch (error) {
    console.error("Suggestions GET error:", error);

    return NextResponse.json(
      { error: "Error interno del servidor." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const isAdmin = await isAdminLoggedIn();

    if (!isAdmin) {
      return NextResponse.json({ error: "No autorizado." }, { status: 401 });
    }

    const body = await request.json();

    const id = String(body?.id ?? "").trim();
    const status = String(body?.status ?? "").trim();

    if (!id) {
      return NextResponse.json(
        { error: "Falta el ID de la sugerencia." },
        { status: 400 }
      );
    }

    if (!allowedStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Estado no válido." },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin
      .from("suggestions")
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      console.error("Error updating suggestion:", error);

      return NextResponse.json(
        { error: "No se pudo actualizar la sugerencia." },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Suggestions PATCH error:", error);

    return NextResponse.json(
      { error: "Error interno del servidor." },
      { status: 500 }
    );
  }
}