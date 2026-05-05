"use client";

import { useEffect, useMemo, useState } from "react";
import type { Activity, Schedule } from "@/types";
import {
  createBooking,
  getActivities,
  getSchedulesByDayAndActivity,
} from "@/services/booking.service";

function getDayOfWeekFromDate(dateString: string) {
  const date = new Date(`${dateString}T12:00:00`);
  const jsDay = date.getDay();

  if (jsDay === 0) return 7;
  return jsDay;
}

function formatTime(time: string) {
  return time.slice(0, 5);
}

function toDateInputValue(date: Date) {
  return date.toISOString().slice(0, 10);
}

function formatDateLabel(dateString: string) {
  const date = new Date(`${dateString}T12:00:00`);

  return new Intl.DateTimeFormat("es-UY", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  }).format(date);
}

function getAvailableDateOptions() {
  const dates: string[] = [];
  const today = new Date();

  for (let i = 0; i < 21; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);

    const jsDay = date.getDay();

    // 0 = domingo. Por ahora lo ocultamos.
    if (jsDay === 0) continue;

    dates.push(toDateInputValue(date));
  }

  return dates;
}

export default function BookingForm() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [activityId, setActivityId] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [startTime, setStartTime] = useState("");

  const [loadingActivities, setLoadingActivities] = useState(true);
  const [loadingSchedules, setLoadingSchedules] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const dateOptions = useMemo(() => getAvailableDateOptions(), []);

  const selectedActivityName = useMemo(() => {
    return activities.find((activity) => activity.id === activityId)?.name ?? "";
  }, [activities, activityId]);

  useEffect(() => {
    async function loadActivities() {
      try {
        setLoadingActivities(true);
        const data = await getActivities();
        setActivities(data);
      } catch (error) {
        console.error(error);
        setErrorMessage("No se pudieron cargar las actividades.");
      } finally {
        setLoadingActivities(false);
      }
    }

    loadActivities();
  }, []);

  useEffect(() => {
    async function loadSchedules() {
      setSchedules([]);
      setStartTime("");
      setMessage("");
      setErrorMessage("");

      if (!bookingDate || !activityId) return;

      try {
        setLoadingSchedules(true);
        const dayOfWeek = getDayOfWeekFromDate(bookingDate);
        const data = await getSchedulesByDayAndActivity(dayOfWeek, activityId);
        setSchedules(data);
      } catch (error) {
        console.error(error);
        setErrorMessage("No se pudieron cargar los horarios.");
      } finally {
        setLoadingSchedules(false);
      }
    }

    loadSchedules();
  }, [bookingDate, activityId]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMessage("");
    setErrorMessage("");

    if (!fullName.trim()) {
      setErrorMessage("Ingresá nombre y apellido.");
      return;
    }

    if (!phone.trim()) {
      setErrorMessage("Ingresá un teléfono.");
      return;
    }

    if (!activityId) {
      setErrorMessage("Seleccioná una actividad.");
      return;
    }

    if (!bookingDate) {
      setErrorMessage("Seleccioná una fecha.");
      return;
    }

    if (!startTime) {
      setErrorMessage("Seleccioná un horario.");
      return;
    }

    try {
      setSubmitting(true);

      await createBooking({
        full_name: fullName,
        phone,
        activity_id: activityId,
        booking_date: bookingDate,
        start_time: startTime,
      });

      setMessage(
        `Reserva confirmada para ${selectedActivityName} el ${formatDateLabel(
          bookingDate
        )} a las ${formatTime(startTime)}.`
      );

      setFullName("");
      setPhone("");
      setActivityId("");
      setBookingDate("");
      setStartTime("");
      setSchedules([]);
    } catch (error) {
      console.error(error);
      setErrorMessage("No se pudo registrar la reserva. Intentá nuevamente.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section
      id="reservar"
      className="rounded-3xl border border-red-500/20 bg-zinc-950 p-6 shadow-2xl shadow-red-950/20"
    >
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-red-500">
          Reserva online
        </p>
        <h2 className="mt-2 text-3xl font-black text-white">
          Reservá tu clase
        </h2>
        <p className="mt-2 text-sm text-zinc-400">
          Completá tus datos, elegí actividad, fecha y horario. La reserva queda
          registrada para Alex en el panel privado.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-4">
        <div className="grid gap-2">
          <label className="text-sm font-semibold text-zinc-200">
            Nombre y apellido
          </label>
          <input
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            placeholder="Ej: Juan Pérez"
            className="rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-white outline-none transition focus:border-red-500"
          />
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-semibold text-zinc-200">
            Teléfono
          </label>
          <input
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="Ej: 099 123 456"
            className="rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-white outline-none transition focus:border-red-500"
          />
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-semibold text-zinc-200">
            Actividad
          </label>
          <select
            value={activityId}
            onChange={(event) => setActivityId(event.target.value)}
            disabled={loadingActivities}
            className="rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-white outline-none transition focus:border-red-500"
          >
            <option value="">
              {loadingActivities ? "Cargando..." : "Seleccionar actividad"}
            </option>
            {activities.map((activity) => (
              <option key={activity.id} value={activity.id}>
                {activity.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-semibold text-zinc-200">Fecha</label>
          <select
            value={bookingDate}
            onChange={(event) => setBookingDate(event.target.value)}
            className="rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-white outline-none transition focus:border-red-500"
          >
            <option value="">Seleccionar fecha</option>
            {dateOptions.map((date) => (
              <option key={date} value={date}>
                {formatDateLabel(date)}
              </option>
            ))}
          </select>

          <p className="text-xs text-zinc-500">
            Se muestran fechas disponibles de los próximos días.
          </p>
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-semibold text-zinc-200">
            Horario
          </label>
          <select
            value={startTime}
            onChange={(event) => setStartTime(event.target.value)}
            disabled={!bookingDate || !activityId || loadingSchedules}
            className="rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-white outline-none transition focus:border-red-500 disabled:opacity-60"
          >
            <option value="">
              {loadingSchedules
                ? "Cargando horarios..."
                : "Seleccionar horario"}
            </option>

            {schedules.map((schedule) => (
              <option key={schedule.id} value={schedule.start_time}>
                {formatTime(schedule.start_time)}
              </option>
            ))}
          </select>

          {bookingDate && activityId && !loadingSchedules && schedules.length === 0 ? (
            <p className="text-sm text-amber-400">
              No hay horarios cargados para esa actividad en la fecha elegida.
            </p>
          ) : null}
        </div>

        {message ? (
          <div className="rounded-2xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-300">
            {message}
          </div>
        ) : null}

        {errorMessage ? (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {errorMessage}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={submitting}
          className="rounded-2xl bg-red-600 px-5 py-3 font-bold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Registrando..." : "Confirmar reserva"}
        </button>
      </form>
    </section>
  );
}