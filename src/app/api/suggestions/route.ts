import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

const allowedCategories = [
  "Horarios",
  "Actividades",
  "Instalaciones",
  "Pagos",
  "Otra sugerencia",
];

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const name = String(body?.name ?? "").trim();
    const category = String(body?.category ?? "").trim();
    const message = String(body?.message ?? "").trim();

    if (!name) {
      return NextResponse.json(
        { error: "El nombre es obligatorio." },
        { status: 400 }
      );
    }

    if (!allowedCategories.includes(category)) {
      return NextResponse.json(
        { error: "La categoría no es válida." },
        { status: 400 }
      );
    }

    if (!message || message.length < 5) {
      return NextResponse.json(
        { error: "La sugerencia debe tener al menos 5 caracteres." },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin.from("suggestions").insert({
      name,
      category,
      message,
      status: "pending",
    });

    if (error) {
      return NextResponse.json(
        { error: "No se pudo guardar la sugerencia." },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Solicitud inválida." },
      { status: 400 }
    );
  }
}