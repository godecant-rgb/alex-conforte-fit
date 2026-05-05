import { supabase } from "@/lib/supabase/browser";
import type { Activity, Schedule, BookingFormData } from "@/types";

export async function getActivities(): Promise<Activity[]> {
  const { data, error } = await supabase
    .from("activities")
    .select("id, name, description")
    .eq("active", true)
    .order("name");

  if (error) {
    console.error("Error getActivities:", error);
    throw new Error("No se pudieron cargar las actividades");
  }

  return data ?? [];
}

export async function getSchedulesByDayAndActivity(
  dayOfWeek: number,
  activityId: string
): Promise<Schedule[]> {
  const { data, error } = await supabase
    .from("schedules")
    .select("id, activity_id, day_of_week, start_time")
    .eq("active", true)
    .eq("day_of_week", dayOfWeek)
    .eq("activity_id", activityId)
    .order("start_time");

  if (error) {
    console.error("Error getSchedulesByDayAndActivity:", error);
    throw new Error("No se pudieron cargar los horarios");
  }

  return data ?? [];
}

export async function createBooking(formData: BookingFormData) {
  const response = await fetch("/api/bookings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      full_name: formData.full_name.trim(),
      phone: formData.phone.trim(),
      activity_id: formData.activity_id,
      booking_date: formData.booking_date,
      start_time: formData.start_time,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("Error createBooking:", data);
    throw new Error(data.error ?? "No se pudo registrar la reserva");
  }

  return data.booking;
}