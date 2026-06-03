import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

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
      console.error("Error inserting suggestion:", error);

      return NextResponse.json(
        {
          error:
            "No se pudo guardar la sugerencia. Revisá la tabla suggestions en Supabase.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Suggestions POST error:", error);

    return NextResponse.json(
      { error: "Solicitud inválida o error interno en sugerencias." },
      { status: 500 }
    );
  }
}