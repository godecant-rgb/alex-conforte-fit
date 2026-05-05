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

function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseDate(dateString: string) {
  return new Date(`${dateString}T12:00:00`);
}

function getWeekRange(referenceDate: string) {
  const date = parseDate(referenceDate);
  const day = date.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;

  const start = new Date(date);
  start.setDate(date.getDate() + diffToMonday);

  const end = new Date(start);
  end.setDate(start.getDate() + 6);

  return {
    start: formatDate(start),
    end: formatDate(end),
  };
}

function getMonthRange(referenceDate: string) {
  const date = parseDate(referenceDate);

  const start = new Date(date.getFullYear(), date.getMonth(), 1, 12, 0, 0);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0, 12, 0, 0);

  return {
    start: formatDate(start),
    end: formatDate(end),
  };
}

function getWeekdayName(dateString: string) {
  const date = parseDate(dateString);

  const dayNames = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ];

  return dayNames[date.getDay()];
}

type RawBooking = {
  id: string;
  activity_id: string;
  booking_date: string;
  start_time: string;
};

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const isAdmin = cookieStore.get("alex_admin")?.value === "true";

    if (!isAdmin) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const referenceDate =
      searchParams.get("date") || formatDate(new Date());

    const supabaseAdmin = getSupabaseAdmin();

    const weekRange = getWeekRange(referenceDate);
    const monthRange = getMonthRange(referenceDate);

    const { data: dayBookings, error: dayError } = await supabaseAdmin
      .from("bookings")
      .select("id, activity_id, booking_date, start_time")
      .eq("booking_date", referenceDate)
      .eq("status", "confirmed");

    if (dayError) {
      return NextResponse.json(
        {
          error: "No se pudieron cargar las reservas del día.",
          details: dayError.message,
          code: dayError.code,
        },
        { status: 500 }
      );
    }

    const { data: weekBookings, error: weekError } = await supabaseAdmin
      .from("bookings")
      .select("id, activity_id, booking_date, start_time")
      .gte("booking_date", weekRange.start)
      .lte("booking_date", weekRange.end)
      .eq("status", "confirmed");

    if (weekError) {
      return NextResponse.json(
        {
          error: "No se pudieron cargar las reservas de la semana.",
          details: weekError.message,
          code: weekError.code,
        },
        { status: 500 }
      );
    }

    const { data: monthBookings, error: monthError } = await supabaseAdmin
      .from("bookings")
      .select("id, activity_id, booking_date, start_time")
      .gte("booking_date", monthRange.start)
      .lte("booking_date", monthRange.end)
      .eq("status", "confirmed");

    if (monthError) {
      return NextResponse.json(
        {
          error: "No se pudieron cargar las reservas del mes.",
          details: monthError.message,
          code: monthError.code,
        },
        { status: 500 }
      );
    }

    const allBookings = [
      ...(dayBookings ?? []),
      ...(weekBookings ?? []),
      ...(monthBookings ?? []),
    ] as RawBooking[];

    const activityIds = Array.from(
      new Set(allBookings.map((booking) => booking.activity_id).filter(Boolean))
    );

    let activityMap = new Map<string, string>();

    if (activityIds.length > 0) {
      const { data: activities, error: activitiesError } = await supabaseAdmin
        .from("activities")
        .select("id, name")
        .in("id", activityIds);

      if (activitiesError) {
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

    const monthActivityCounter = new Map<string, number>();
    const monthHourCounter = new Map<string, number>();
    const monthWeekdayCounter = new Map<string, number>();

    for (const booking of monthBookings ?? []) {
      const activityName =
        activityMap.get(booking.activity_id) ?? "Sin actividad";
      const hour = booking.start_time.slice(0, 5);
      const weekday = getWeekdayName(booking.booking_date);

      monthActivityCounter.set(
        activityName,
        (monthActivityCounter.get(activityName) ?? 0) + 1
      );

      monthHourCounter.set(hour, (monthHourCounter.get(hour) ?? 0) + 1);

      monthWeekdayCounter.set(
        weekday,
        (monthWeekdayCounter.get(weekday) ?? 0) + 1
      );
    }

    const activityBreakdown = Array.from(monthActivityCounter.entries())
      .map(([activity, total]) => ({ activity, total }))
      .sort((a, b) => b.total - a.total);

    const hourBreakdown = Array.from(monthHourCounter.entries())
      .map(([hour, total]) => ({ hour, total }))
      .sort((a, b) => a.hour.localeCompare(b.hour));

    const weekdayOrder = [
      "Lunes",
      "Martes",
      "Miércoles",
      "Jueves",
      "Viernes",
      "Sábado",
      "Domingo",
    ];

    const weekdayBreakdown = Array.from(monthWeekdayCounter.entries())
      .map(([day, total]) => ({ day, total }))
      .sort(
        (a, b) => weekdayOrder.indexOf(a.day) - weekdayOrder.indexOf(b.day)
      );

    const topActivity =
      activityBreakdown.length > 0 ? activityBreakdown[0].activity : null;

    const topHour =
      hourBreakdown.length > 0
        ? [...hourBreakdown].sort((a, b) => b.total - a.total)[0].hour
        : null;

    const topWeekday =
      weekdayBreakdown.length > 0
        ? [...weekdayBreakdown].sort((a, b) => b.total - a.total)[0].day
        : null;

    return NextResponse.json({
      reference_date: referenceDate,
      totals: {
        day: (dayBookings ?? []).length,
        week: (weekBookings ?? []).length,
        month: (monthBookings ?? []).length,
      },
      top_activity: topActivity,
      top_hour: topHour,
      top_weekday: topWeekday,
      activity_breakdown: activityBreakdown,
      hour_breakdown: hourBreakdown,
      weekday_breakdown: weekdayBreakdown,
    });
  } catch (error) {
    console.error("Error general en /api/admin/stats:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Error inesperado cargando estadísticas.",
      },
      { status: 500 }
    );
  }
}