import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl) {
    throw new Error("Falta NEXT_PUBLIC_SUPABASE_URL en .env.local");
  }

  if (!serviceRoleKey) {
    throw new Error("Falta SUPABASE_SERVICE_ROLE_KEY en .env.local");
  }

  return createClient(supabaseUrl, serviceRoleKey);
}

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const isAdmin = cookieStore.get("alex_admin")?.value === "true";

    if (!isAdmin) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");

    if (!date) {
      return NextResponse.json(
        { error: "Falta parámetro date" },
        { status: 400 }
      );
    }

    const supabaseAdmin = getSupabaseAdmin();

    const { data: bookings, error: bookingsError } = await supabaseAdmin
      .from("bookings")
      .select(
        "id, full_name, phone, activity_id, booking_date, start_time, status, created_at"
      )
      .eq("booking_date", date)
      .eq("status", "confirmed")
      .order("start_time", { ascending: true });

    if (bookingsError) {
      console.error("Error leyendo reservas:", bookingsError);

      return NextResponse.json(
        {
          error: "No se pudieron cargar las reservas.",
          details: bookingsError.message,
          code: bookingsError.code,
        },
        { status: 500 }
      );
    }

    const activityIds = Array.from(
      new Set((bookings ?? []).map((booking) => booking.activity_id))
    );

    let activityMap = new Map<string, string>();

    if (activityIds.length > 0) {
      const { data: activities, error: activitiesError } = await supabaseAdmin
        .from("activities")
        .select("id, name")
        .in("id", activityIds);

      if (activitiesError) {
        console.error("Error leyendo actividades:", activitiesError);

        return NextResponse.json(
          {
            error: "No se pudieron cargar las actividades.",
            details: activitiesError.message,
            code: activitiesError.code,
          },
          { status: 500 }
        );
      }

      activityMap = new Map(
        (activities ?? []).map((activity) => [activity.id, activity.name])
      );
    }

    const formattedBookings = (bookings ?? []).map((booking) => ({
      id: booking.id,
      full_name: booking.full_name,
      phone: booking.phone,
      booking_date: booking.booking_date,
      start_time: booking.start_time,
      status: booking.status,
      created_at: booking.created_at,
      activities: {
        name: activityMap.get(booking.activity_id) ?? "Sin actividad",
      },
    }));

    return NextResponse.json({ bookings: formattedBookings });
  } catch (error) {
    console.error("Error general en /api/admin/bookings:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Error inesperado cargando reservas.",
      },
      { status: 500 }
    );
  }
}