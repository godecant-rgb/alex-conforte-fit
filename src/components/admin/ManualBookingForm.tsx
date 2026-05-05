"use client";

import { useEffect, useMemo, useState } from "react";
import type { Activity, Schedule } from "@/types";
import {
  createBooking,
  getActivities,
  getSchedulesByDayAndActivity,
} from "@/services/booking.service";

type Props = {
  selectedDate: string;
  onSaved: (date: string) => void;
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

function formatTime(time: string) {
  return time.slice(0, 5);
}

function formatShortDate(dateString: string) {
  const date = new Date(`${dateString}T12:00:00`);

  return new Intl.DateTimeFormat("es-UY", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

function getDateOptions() {
  const dates: string[] = [];
  const today = new Date();

  for (let i = -3; i <= 45; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dates.push(toDateValue(date));
  }

  return dates;
}

export default function ManualBookingForm({ selectedDate, onSaved }: Props) {
  const [open, setOpen] = useState(false);

  const [activities, setActivities] = useState<Activity[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [activityId, setActivityId] = useState("");
  const [bookingDate, setBookingDate] = useState(selectedDate || getToday());
  const [startTime, setStartTime] = useState("");

  const [loadingActivities, setLoadingActivities] = useState(false);
  const [loadingSchedules, setLoadingSchedules] = useState(false);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const dateOptions = useMemo(() => getDateOptions(), []);

  useEffect(() => {
    if (selectedDate) {
      setBookingDate(selectedDate);
    }
  }, [selectedDate]);

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

    if (open) {
      loadActivities();
    }
  }, [open]);

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
      setSaving(true);

      await createBooking({
        full_name: fullName,
        phone,
        activity_id: activityId,
        booking_date: bookingDate,
        start_time: startTime,
      });

      setMessage("Reserva manual agregada correctamente.");

      setFullName("");
      setPhone("");
      setActivityId("");
      setStartTime("");
      setSchedules([]);

      onSaved(bookingDate);
    } catch (error) {
      console.error(error);
      setErrorMessage("No se pudo agregar la reserva.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="mb-6 overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(39,39,42,0.82),rgba(9,9,11,0.94))] shadow-[0_10px_40px_rgba(0,0,0,0.35)]">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full flex-col justify-between gap-3 p-5 text-left transition hover:bg-white/[0.03] md:flex-row md:items-center"
      >
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-red-500">
            Carga manual
          </p>
          <h2 className="mt-2 text-2xl font-black text-white">
            Agregar reserva desde el admin
          </h2>
          <p className="mt-1 text-sm text-zinc-400">
            Para alumnos que se anotan por WhatsApp, llamada o presencial.
          </p>
        </div>

        <span className="rounded-2xl bg-gradient-to-r from-red-600 to-red-500 px-5 py-3 text-center font-bold text-white">
          {open ? "Cerrar" : "+ Agregar reserva"}
        </span>
      </button>

      {open ? (
        <div className="border-t border-white/10 p-5">
          <form onSubmit={handleSubmit} className="grid gap-4 lg:grid-cols-5">
            <div className="grid gap-2 lg:col-span-2">
              <label className="text-sm font-semibold text-zinc-200">
                Nombre y apellido
              </label>
              <input
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                placeholder="Ej: Juan Pérez"
                className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-red-500"
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
                className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-red-500"
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
                className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-red-500"
              >
                <option value="">
                  {loadingActivities ? "Cargando..." : "Actividad"}
                </option>

                {activities.map((activity) => (
                  <option key={activity.id} value={activity.id}>
                    {activity.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-semibold text-zinc-200">
                Fecha
              </label>
              <select
                value={bookingDate}
                onChange={(event) => setBookingDate(event.target.value)}
                className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-lime-400 outline-none transition focus:border-red-500"
              >
                {dateOptions.map((date) => (
                  <option key={date} value={date}>
                    {formatShortDate(date)}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-2 lg:col-span-2">
              <label className="text-sm font-semibold text-zinc-200">
                Horario
              </label>
              <select
                value={startTime}
                onChange={(event) => setStartTime(event.target.value)}
                disabled={!activityId || !bookingDate || loadingSchedules}
                className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-red-500 disabled:opacity-60"
              >
                <option value="">
                  {loadingSchedules ? "Cargando horarios..." : "Horario"}
                </option>

                {schedules.map((schedule) => (
                  <option key={schedule.id} value={schedule.start_time}>
                    {formatTime(schedule.start_time)}
                  </option>
                ))}
              </select>

              {activityId && bookingDate && !loadingSchedules && schedules.length === 0 ? (
                <p className="text-sm text-amber-400">
                  No hay horarios cargados para esa actividad en esa fecha.
                </p>
              ) : null}
            </div>

            <div className="flex items-end lg:col-span-3">
              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-2xl bg-gradient-to-r from-red-600 to-red-500 px-5 py-3 font-bold text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Guardando..." : "Guardar reserva manual"}
              </button>
            </div>

            {message ? (
              <div className="rounded-2xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-300 lg:col-span-5">
                {message}
              </div>
            ) : null}

            {errorMessage ? (
              <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300 lg:col-span-5">
                {errorMessage}
              </div>
            ) : null}
          </form>
        </div>
      ) : null}
    </section>
  );
}