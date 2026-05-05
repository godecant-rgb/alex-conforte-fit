"use client";

import { useEffect, useMemo, useState } from "react";
import ManualBookingForm from "@/components/admin/ManualBookingForm";

type Booking = {
  id: string;
  full_name: string;
  phone: string;
  booking_date: string;
  start_time: string;
  status: string;
  created_at: string;
  activities: {
    name: string;
  } | null;
};

type GroupedBooking = {
  key: string;
  start_time: string;
  activity: string;
  students: Booking[];
};

type StatsData = {
  reference_date: string;
  totals: {
    day: number;
    week: number;
    month: number;
  };
  top_activity: string | null;
  top_hour: string | null;
  top_weekday: string | null;
  activity_breakdown: {
    activity: string;
    total: number;
  }[];
  hour_breakdown: {
    hour: string;
    total: number;
  }[];
  weekday_breakdown: {
    day: string;
    total: number;
  }[];
};

function formatTime(time: string) {
  return time.slice(0, 5);
}

function toDateValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getToday() {
  return toDateValue(new Date());
}

function getTomorrow() {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return toDateValue(date);
}

function formatHumanDate(dateString: string) {
  const date = new Date(`${dateString}T12:00:00`);

  return new Intl.DateTimeFormat("es-UY", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
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

  for (let i = -7; i <= 45; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dates.push(toDateValue(date));
  }

  return dates;
}

function getMaxValue<T>(items: T[], getValue: (item: T) => number) {
  if (!items.length) return 0;
  return Math.max(...items.map(getValue));
}

function PremiumStatCard({
  label,
  value,
  helper,
}: {
  label: string;
  value: string | number;
  helper?: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))] p-5 shadow-[0_10px_40px_rgba(0,0,0,0.35)]">
      <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-red-500/10 blur-2xl" />
      <p className="relative text-sm text-zinc-400">{label}</p>
      <p className="relative mt-3 text-3xl font-black tracking-tight text-white md:text-4xl">
        {value}
      </p>
      {helper ? (
        <p className="relative mt-2 text-sm text-zinc-500">{helper}</p>
      ) : null}
    </div>
  );
}

function BreakdownCard({
  title,
  items,
  labelKey,
  valueKey,
}: {
  title: string;
  items: Record<string, string | number>[];
  labelKey: string;
  valueKey: string;
}) {
  const max = getMaxValue(items, (item) => Number(item[valueKey] ?? 0));

  return (
    <section className="rounded-3xl border border-white/10 bg-zinc-950/80 p-6 shadow-[0_10px_40px_rgba(0,0,0,0.35)]">
      <h3 className="text-xl font-black text-white">{title}</h3>

      <div className="mt-5 grid gap-4">
        {items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 bg-black/20 p-4 text-sm text-zinc-500">
            Sin datos todavía.
          </div>
        ) : (
          items.map((item, index) => {
            const label = String(item[labelKey] ?? "");
            const value = Number(item[valueKey] ?? 0);
            const width = max > 0 ? (value / max) * 100 : 0;

            return (
              <div key={`${label}-${index}`}>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <span className="text-sm font-medium text-zinc-200">
                    {label}
                  </span>
                  <span className="text-sm font-bold text-red-400">
                    {value}
                  </span>
                </div>

                <div className="h-2.5 overflow-hidden rounded-full bg-white/5">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-red-600 to-red-400"
                    style={{ width: `${width}%` }}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}

export default function AdminPanel() {
  const [password, setPassword] = useState("");
  const [isLogged, setIsLogged] = useState(false);

  const [selectedDate, setSelectedDate] = useState(getToday());
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState<StatsData | null>(null);

  const [loadingLogin, setLoadingLogin] = useState(false);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [loadingStats, setLoadingStats] = useState(false);
  const [deletingId, setDeletingId] = useState("");

  const [activeView, setActiveView] = useState<"agenda" | "stats">("agenda");

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const dateOptions = useMemo(() => getDateOptions(), []);

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    try {
      setLoadingLogin(true);

      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "No se pudo iniciar sesión");
      }

      setIsLogged(true);
      setPassword("");
    } catch (error) {
      console.error(error);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Contraseña incorrecta o error de acceso."
      );
    } finally {
      setLoadingLogin(false);
    }
  }

  async function loadBookings(date: string) {
    setErrorMessage("");
    setSuccessMessage("");

    const safeDate = date || getToday();

    if (!date) {
      setSelectedDate(safeDate);
    }

    try {
      setLoadingBookings(true);

      const response = await fetch(`/api/admin/bookings?date=${safeDate}`);
      const data = await response.json();

      if (response.status === 401) {
        setIsLogged(false);
        setErrorMessage("Sesión vencida. Ingresá nuevamente.");
        return;
      }

      if (!response.ok) {
        const detailMessage = [
          data.error,
          data.details ? `Detalle: ${data.details}` : null,
          data.code ? `Código: ${data.code}` : null,
        ]
          .filter(Boolean)
          .join(" | ");

        throw new Error(detailMessage || "No se pudieron cargar las reservas");
      }

      setBookings(data.bookings ?? []);
    } catch (error) {
      console.error(error);

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "No se pudieron cargar las reservas."
      );
    } finally {
      setLoadingBookings(false);
    }
  }

  async function loadStats(date: string) {
    const safeDate = date || getToday();

    try {
      setLoadingStats(true);

      const response = await fetch(`/api/admin/stats?date=${safeDate}`);
      const data = await response.json();

      if (response.status === 401) {
        setIsLogged(false);
        setErrorMessage("Sesión vencida. Ingresá nuevamente.");
        return;
      }

      if (!response.ok) {
        const detailMessage = [
          data.error,
          data.details ? `Detalle: ${data.details}` : null,
          data.code ? `Código: ${data.code}` : null,
        ]
          .filter(Boolean)
          .join(" | ");

        throw new Error(
          detailMessage || "No se pudieron cargar las estadísticas"
        );
      }

      setStats(data);
    } catch (error) {
      console.error(error);

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "No se pudieron cargar las estadísticas."
      );
    } finally {
      setLoadingStats(false);
    }
  }

  async function cancelBooking(bookingId: string, studentName: string) {
    const confirmed = window.confirm(
      `¿Eliminar la reserva de ${studentName}?`
    );

    if (!confirmed) return;

    setErrorMessage("");
    setSuccessMessage("");

    try {
      setDeletingId(bookingId);

      const response = await fetch(`/api/admin/bookings/${bookingId}/cancel`, {
        method: "PATCH",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "No se pudo eliminar la reserva");
      }

      setSuccessMessage("Reserva eliminada correctamente.");
      await loadBookings(selectedDate || getToday());
      await loadStats(selectedDate || getToday());
    } catch (error) {
      console.error(error);

      setErrorMessage(
        error instanceof Error
          ? error.message
          : "No se pudo eliminar la reserva."
      );
    } finally {
      setDeletingId("");
    }
  }

  useEffect(() => {
    if (isLogged) {
      loadBookings(selectedDate || getToday());
      loadStats(selectedDate || getToday());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLogged, selectedDate]);

  const groupedBookings = useMemo<GroupedBooking[]>(() => {
    const map = new Map<string, GroupedBooking>();

    bookings.forEach((booking) => {
      const activity = booking.activities?.name ?? "Sin actividad";
      const key = `${booking.start_time}-${activity}`;

      if (!map.has(key)) {
        map.set(key, {
          key,
          start_time: booking.start_time,
          activity,
          students: [],
        });
      }

      map.get(key)?.students.push(booking);
    });

    return Array.from(map.values()).sort((a, b) =>
      a.start_time.localeCompare(b.start_time)
    );
  }, [bookings]);

  const totalBookings = bookings.length;

  const activitySummary = useMemo(() => {
    const summary = new Map<string, number>();

    bookings.forEach((booking) => {
      const activity = booking.activities?.name ?? "Sin actividad";
      summary.set(activity, (summary.get(activity) ?? 0) + 1);
    });

    return Array.from(summary.entries())
      .map(([activity, total]) => ({
        activity,
        total,
      }))
      .sort((a, b) => b.total - a.total);
  }, [bookings]);

  if (!isLogged) {
    return (
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-5 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(220,38,38,0.18),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.05),transparent_30%)]" />

        <section className="relative w-full max-w-md rounded-[2rem] border border-white/10 bg-zinc-950/90 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.6)] backdrop-blur">
          <div className="mb-6">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-red-500">
              Panel privado
            </p>

            <h1 className="mt-3 text-3xl font-black">
              Alex Conforte Personal Trainer
            </h1>

            <p className="mt-3 text-sm leading-6 text-zinc-400">
              Ingresá la contraseña para ver agenda y estadísticas.
            </p>
          </div>

          <form onSubmit={handleLogin} className="grid gap-4">
            <div className="grid gap-2">
              <label className="text-sm font-semibold text-zinc-200">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-red-500"
                placeholder="Ingresar contraseña"
              />
            </div>

            {errorMessage ? (
              <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {errorMessage}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={loadingLogin}
              className="rounded-2xl bg-gradient-to-r from-red-600 to-red-500 px-5 py-3 font-bold text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loadingLogin ? "Ingresando..." : "Entrar al panel"}
            </button>
          </form>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black px-4 py-6 text-white md:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="relative mb-8 overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(39,39,42,0.92),rgba(9,9,11,0.92))] p-6 shadow-[0_20px_70px_rgba(0,0,0,0.5)]">
          <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-red-500/10 blur-3xl" />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-red-500">
                Panel privado
              </p>
              <h1 className="mt-2 text-4xl font-black tracking-tight md:text-5xl">
                Gestión de reservas
              </h1>
              <p className="mt-3 max-w-2xl text-zinc-400">
                Visualizá la agenda, controlá alumnos por horario y revisá el
                rendimiento general del mes en un panel premium y ordenado.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <a
                href="/"
                className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-center font-bold transition hover:border-red-500"
              >
                Ver web pública
              </a>

              <button
                onClick={() => {
                  setActiveView("agenda");
                  loadBookings(selectedDate || getToday());
                }}
                className={`rounded-2xl px-5 py-3 font-bold transition ${
                  activeView === "agenda"
                    ? "bg-red-600 text-white"
                    : "border border-white/10 bg-white/5 text-zinc-200"
                }`}
              >
                Agenda
              </button>

              <button
                onClick={() => {
                  setActiveView("stats");
                  loadStats(selectedDate || getToday());
                }}
                className={`rounded-2xl px-5 py-3 font-bold transition ${
                  activeView === "stats"
                    ? "bg-red-600 text-white"
                    : "border border-white/10 bg-white/5 text-zinc-200"
                }`}
              >
                Estadísticas
              </button>
            </div>
          </div>
        </header>

        <section className="mb-6 grid gap-4 lg:grid-cols-[1fr_auto_auto_auto]">
          <div className="rounded-3xl border border-white/10 bg-zinc-950/80 p-5 shadow-[0_10px_40px_rgba(0,0,0,0.35)]">
            <label className="text-sm font-semibold text-zinc-300">
              Elegir fecha de referencia
            </label>

            <select
              value={selectedDate}
              onChange={(event) => setSelectedDate(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-lime-400 outline-none transition focus:border-red-500"
            >
              {dateOptions.map((date) => (
                <option key={date} value={date}>
                  {formatShortDate(date)}
                </option>
              ))}
            </select>

            <p className="mt-2 text-xs text-zinc-500">
              Formato día / mes / año. Referencia para agenda diaria y
              estadísticas.
            </p>
          </div>

          <button
            onClick={() => setSelectedDate(getToday())}
            className="rounded-3xl border border-white/10 bg-zinc-950/80 px-6 py-5 font-bold transition hover:border-red-500"
          >
            Hoy
          </button>

          <button
            onClick={() => setSelectedDate(getTomorrow())}
            className="rounded-3xl border border-white/10 bg-zinc-950/80 px-6 py-5 font-bold transition hover:border-red-500"
          >
            Mañana
          </button>

          <button
            onClick={() => {
              loadBookings(selectedDate || getToday());
              loadStats(selectedDate || getToday());
            }}
            className="rounded-3xl bg-gradient-to-r from-red-600 to-red-500 px-6 py-5 font-bold transition hover:opacity-95"
          >
            Actualizar
          </button>
        </section>

        <section className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <PremiumStatCard
            label="Fecha seleccionada"
            value={formatHumanDate(selectedDate)}
          />
          <PremiumStatCard
            label="Reservas del día"
            value={stats?.totals.day ?? totalBookings}
            helper="Según la fecha seleccionada"
          />
          <PremiumStatCard
            label="Reservas de la semana"
            value={stats?.totals.week ?? 0}
            helper="Semana de la fecha seleccionada"
          />
          <PremiumStatCard
            label="Reservas del mes"
            value={stats?.totals.month ?? 0}
            helper="Mes de la fecha seleccionada"
          />
        </section>

        {successMessage ? (
          <div className="mb-6 rounded-2xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-300">
            {successMessage}
          </div>
        ) : null}

        {errorMessage ? (
          <div className="mb-6 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {errorMessage}
          </div>
        ) : null}

        {activeView === "agenda" ? (
          <>
            <ManualBookingForm
              selectedDate={selectedDate}
              onSaved={async (date) => {
                setSelectedDate(date);
                await loadBookings(date);
                await loadStats(date);
                setSuccessMessage("Reserva manual agregada correctamente.");
              }}
            />

            <section className="mb-6 grid gap-4 md:grid-cols-3">
              <PremiumStatCard
                label="Total de alumnos del día"
                value={totalBookings}
              />
              <PremiumStatCard
                label="Actividad más fuerte del día"
                value={activitySummary[0]?.activity ?? "Sin datos"}
              />
              <PremiumStatCard
                label="Horarios con reservas"
                value={groupedBookings.length}
              />
            </section>

            <section className="grid gap-5">
              {loadingBookings ? (
                <div className="rounded-3xl border border-white/10 bg-zinc-950/80 p-6 text-zinc-400">
                  Cargando reservas...
                </div>
              ) : groupedBookings.length === 0 ? (
                <div className="rounded-3xl border border-white/10 bg-zinc-950/80 p-8 text-center text-zinc-400">
                  No hay reservas registradas para esta fecha.
                </div>
              ) : (
                groupedBookings.map((group) => (
                  <article
                    key={group.key}
                    className="overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(39,39,42,0.8),rgba(9,9,11,0.9))] shadow-[0_10px_40px_rgba(0,0,0,0.4)]"
                  >
                    <div className="flex flex-col justify-between gap-4 border-b border-white/10 bg-white/5 p-5 md:flex-row md:items-center">
                      <div>
                        <p className="text-4xl font-black tracking-tight text-white">
                          {formatTime(group.start_time)}
                        </p>
                        <p className="mt-1 font-medium text-red-400">
                          {group.activity}
                        </p>
                      </div>

                      <div className="inline-flex rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm font-bold text-red-100">
                        {group.students.length} alumno
                        {group.students.length === 1 ? "" : "s"}
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[760px] border-collapse">
                        <thead>
                          <tr className="border-b border-white/10 text-left text-sm text-zinc-400">
                            <th className="p-4">Alumno</th>
                            <th className="p-4">Teléfono</th>
                            <th className="p-4">Reserva creada</th>
                            <th className="p-4 text-right">Acción</th>
                          </tr>
                        </thead>

                        <tbody>
                          {group.students.map((student) => (
                            <tr
                              key={student.id}
                              className="border-b border-white/5 last:border-b-0"
                            >
                              <td className="p-4 font-semibold text-white">
                                {student.full_name}
                              </td>

                              <td className="p-4 text-zinc-300">
                                {student.phone}
                              </td>

                              <td className="p-4 text-zinc-500">
                                {new Date(student.created_at).toLocaleString(
                                  "es-UY"
                                )}
                              </td>

                              <td className="p-4 text-right">
                                <button
                                  onClick={() =>
                                    cancelBooking(student.id, student.full_name)
                                  }
                                  disabled={deletingId === student.id}
                                  className="rounded-xl border border-red-500/40 bg-red-500/5 px-3 py-2 text-sm font-bold text-red-200 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                  {deletingId === student.id
                                    ? "Eliminando..."
                                    : "Eliminar"}
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </article>
                ))
              )}
            </section>
          </>
        ) : (
          <>
            <section className="mb-6 grid gap-4 md:grid-cols-3">
              <PremiumStatCard
                label="Actividad más reservada"
                value={stats?.top_activity ?? "Sin datos"}
              />
              <PremiumStatCard
                label="Horario más concurrido"
                value={stats?.top_hour ?? "Sin datos"}
              />
              <PremiumStatCard
                label="Día más fuerte"
                value={stats?.top_weekday ?? "Sin datos"}
              />
            </section>

            {loadingStats ? (
              <div className="rounded-3xl border border-white/10 bg-zinc-950/80 p-6 text-zinc-400">
                Cargando estadísticas...
              </div>
            ) : (
              <section className="grid gap-5 xl:grid-cols-3">
                <BreakdownCard
                  title="Reservas por actividad"
                  items={stats?.activity_breakdown ?? []}
                  labelKey="activity"
                  valueKey="total"
                />

                <BreakdownCard
                  title="Reservas por horario"
                  items={stats?.hour_breakdown ?? []}
                  labelKey="hour"
                  valueKey="total"
                />

                <BreakdownCard
                  title="Reservas por día de la semana"
                  items={stats?.weekday_breakdown ?? []}
                  labelKey="day"
                  valueKey="total"
                />
              </section>
            )}
          </>
        )}
      </div>
    </main>
  );
}