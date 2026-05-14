"use client";

import { useEffect, useMemo, useState } from "react";
import type { Activity, Schedule } from "@/types";
import {
  createBooking,
  getActivities,
  getSchedulesByDayAndActivity,
} from "@/services/booking.service";

type SuccessBooking = {
  fullName: string;
  activityName: string;
  bookingDate: string;
  startTime: string;
};

function toDateValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getToday() {
  return toDateValue(new Date());
}

function getDayOfWeekFromDate(dateString: string) {
  const date = new Date(`${dateString}T12:00:00`);
  const jsDay = date.getDay();

  if (jsDay === 0) return 7;

  return jsDay;
}

function formatShortDate(dateString: string) {
  const date = new Date(`${dateString}T12:00:00`);

  return new Intl.DateTimeFormat("es-UY", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function formatTime(time: string) {
  return time.slice(0, 5);
}

function getDateOptions() {
  const dates: string[] = [];
  const today = new Date();

  for (let i = 0; i <= 45; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dates.push(toDateValue(date));
  }

  return dates;
}

export default function BookingForm() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [activityId, setActivityId] = useState("");
  const [bookingDate, setBookingDate] = useState(getToday());
  const [startTime, setStartTime] = useState("");

  const [loadingActivities, setLoadingActivities] = useState(true);
  const [loadingSchedules, setLoadingSchedules] = useState(false);
  const [saving, setSaving] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [successBooking, setSuccessBooking] = useState<SuccessBooking | null>(
    null
  );

  const dateOptions = useMemo(() => getDateOptions(), []);

  const selectedActivity = activities.find(
    (activity) => activity.id === activityId
  );

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
      setErrorMessage("");

      if (!activityId || !bookingDate) return;

      try {
        setLoadingSchedules(true);

        const dayOfWeek = getDayOfWeekFromDate(bookingDate);
        const data = await getSchedulesByDayAndActivity(dayOfWeek, activityId);

        setSchedules(data);
      } catch (error) {
        console.error(error);
        setErrorMessage("No se pudieron cargar los horarios disponibles.");
      } finally {
        setLoadingSchedules(false);
      }
    }

    loadSchedules();
  }, [activityId, bookingDate]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErrorMessage("");
    setSuccessBooking(null);

    if (!fullName.trim()) {
      setErrorMessage("Ingresá tu nombre y apellido.");
      return;
    }

    if (!phone.trim()) {
      setErrorMessage("Ingresá tu teléfono.");
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
      setSaving(true);

      await createBooking({
        full_name: fullName,
        phone,
        activity_id: activityId,
        booking_date: bookingDate,
        start_time: startTime,
      });

      setSuccessBooking({
        fullName: fullName.trim(),
        activityName: selectedActivity?.name ?? "Actividad",
        bookingDate,
        startTime,
      });

      setFullName("");
      setPhone("");
      setActivityId("");
      setStartTime("");
      setSchedules([]);
    } catch (error) {
      console.error(error);

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "No se pudo registrar la reserva."
      );
    } finally {
      setSaving(false);
    }
  }

  if (successBooking) {
    return (
      <section
        id="reservar"
        className="overflow-hidden rounded-[2rem] border border-green-500/20 bg-[linear-gradient(135deg,rgba(22,101,52,0.18),rgba(9,9,11,0.96))] p-6 shadow-[0_20px_70px_rgba(0,0,0,0.45)]"
      >
        <div className="rounded-[1.5rem] border border-green-500/20 bg-black/35 p-6">
          <p className="inline-flex rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1 text-xs font-black uppercase tracking-[0.2em] text-green-300">
            Reserva confirmada
          </p>

          <h2 className="mt-4 text-4xl font-black tracking-tight text-white">
            Ya quedaste registrado/a
          </h2>

          <p className="mt-3 leading-7 text-zinc-300">
            Tu reserva fue registrada correctamente. Alex ya podrá verla en su
            panel de agenda.
          </p>

          <div className="mt-6 grid gap-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
                Alumno
              </p>
              <p className="mt-1 text-lg font-black text-white">
                {successBooking.fullName}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
                Actividad
              </p>
              <p className="mt-1 text-lg font-black text-white">
                {successBooking.activityName}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
                  Fecha
                </p>
                <p className="mt-1 text-lg font-black text-white">
                  {formatShortDate(successBooking.bookingDate)}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
                  Horario
                </p>
                <p className="mt-1 text-lg font-black text-white">
                  {formatTime(successBooking.startTime)}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-red-500/20 bg-red-500/10 p-4">
            <p className="text-sm font-bold text-red-100">
              Recordá que los pagos mensuales se realizan hasta el día 10 de
              cada mes.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setSuccessBooking(null)}
            className="mt-6 w-full rounded-2xl bg-gradient-to-r from-red-600 to-red-500 px-5 py-4 font-black text-white transition hover:opacity-95"
          >
            Hacer otra reserva
          </button>
        </div>
      </section>
    );
  }

  return (
    <section
      id="reservar"
      className="overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(39,39,42,0.92),rgba(9,9,11,0.96))] p-6 shadow-[0_20px_70px_rgba(0,0,0,0.45)]"
    >
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-red-500">
          Reserva online
        </p>

        <h2 className="mt-3 text-4xl font-black tracking-tight text-white">
          Agendá tu clase
        </h2>

        <p className="mt-3 leading-7 text-zinc-400">
          Completá tus datos, elegí actividad, fecha y horario. Tu reserva queda
          registrada automáticamente.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
        <div className="grid gap-2">
          <label className="text-sm font-semibold text-zinc-200">
            Nombre y apellido
          </label>
          <input
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            placeholder="Ej: Juan Pérez"
            className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-red-500"
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
            className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-red-500"
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
            className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-red-500 disabled:opacity-60"
          >
            <option value="">
              {loadingActivities ? "Cargando actividades..." : "Elegí actividad"}
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
            className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-red-500"
          >
            {dateOptions.map((date) => (
              <option key={date} value={date}>
                {formatShortDate(date)}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-semibold text-zinc-200">Horario</label>
          <select
            value={startTime}
            onChange={(event) => setStartTime(event.target.value)}
            disabled={!activityId || !bookingDate || loadingSchedules}
            className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-red-500 disabled:opacity-60"
          >
            <option value="">
              {loadingSchedules ? "Cargando horarios..." : "Elegí horario"}
            </option>

            {schedules.map((schedule) => (
              <option key={schedule.id} value={schedule.start_time}>
                {formatTime(schedule.start_time)}
              </option>
            ))}
          </select>

          {activityId && bookingDate && !loadingSchedules && schedules.length === 0 ? (
            <p className="text-sm text-amber-400">
              No hay horarios disponibles para esa actividad en esa fecha.
            </p>
          ) : null}
        </div>

        {errorMessage ? (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {errorMessage}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={saving}
          className="rounded-2xl bg-gradient-to-r from-red-600 to-red-500 px-5 py-4 font-black text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "Registrando reserva..." : "Confirmar reserva"}
        </button>
      </form>
    </section>
  );
}