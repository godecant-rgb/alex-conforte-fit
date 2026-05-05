import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const fullName = String(body.full_name ?? "").trim();
    const phone = String(body.phone ?? "").trim();
    const activityId = String(body.activity_id ?? "").trim();
    const bookingDate = String(body.booking_date ?? "").trim();
    const startTime = String(body.start_time ?? "").trim();

    if (!fullName) {
      return NextResponse.json(
        { error: "Ingresá nombre y apellido." },
        { status: 400 }
      );
    }

    if (!phone) {
      return NextResponse.json(
        { error: "Ingresá un teléfono." },
        { status: 400 }
      );
    }

    if (!activityId) {
      return NextResponse.json(
        { error: "Seleccioná una actividad." },
        { status: 400 }
      );
    }

    if (!bookingDate) {
      return NextResponse.json(
        { error: "Seleccioná una fecha." },
        { status: 400 }
      );
    }

    if (!startTime) {
      return NextResponse.json(
        { error: "Seleccioná un horario." },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("bookings")
      .insert({
        full_name: fullName,
        phone,
        activity_id: activityId,
        booking_date: bookingDate,
        start_time: startTime,
        status: "confirmed",
      })
      .select("id")
      .single();

    if (error) {
      console.error("Error insertando reserva:", error);

      return NextResponse.json(
        {
          error: "No se pudo registrar la reserva.",
          details: error.message,
          code: error.code,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, booking: data });
  } catch (error) {
    console.error("Error general creando reserva:", error);

    return NextResponse.json(
      { error: "Error inesperado al registrar la reserva." },
      { status: 500 }
    );
  }
}