import Image from "next/image";
import BookingForm from "@/components/booking/BookingForm";
import PaymentReminderAlert from "@/components/PaymentReminderAlert";
import SuggestionFloatingButton from "@/components/SuggestionFloatingButton";
import LocalGallery from "@/components/LocalGallery";

const services = [
  {
    title: "Funcional",
    tag: "Fuerza · Resistencia · Movilidad",
    text: "Clases dinámicas para mejorar fuerza, resistencia, movilidad y condición física general.",
  },
  {
    title: "Crosstraining",
    tag: "Intensidad · Técnica · Superación",
    text: "Entrenamientos variados que combinan fuerza, cardio, técnica y rendimiento.",
  },
  {
    title: "GAP",
    tag: "Glúteos · Abdomen · Piernas",
    text: "Entrenamiento específico para glúteos, abdomen y piernas. Una clase ideal para fortalecer, tonificar y mejorar la resistencia muscular, trabajando zonas clave del cuerpo con ejercicios dinámicos y progresivos.",
  },
  {
    title: "Personalizado",
    tag: "Seguimiento · Objetivos · Progreso",
    text: "Entrenamiento adaptado a tus objetivos, nivel físico, disponibilidad y evolución.",
  },
];

const activityPlans = [
  { title: "2 días por semana", price: "$1400", note: "Ideal para empezar" },
  { title: "3 días por semana", price: "$1600", note: "Más constancia" },
  { title: "5 días por semana", price: "$1900", note: "Mayor progreso" },
];

const personalPlans = [
  { title: "1 día por semana", price: "$2400" },
  { title: "2 días por semana", price: "$3000" },
  { title: "3 días por semana", price: "$3500" },
  { title: "4 días por semana", price: "$4000" },
  { title: "5 días por semana", price: "$4500" },
  { title: "6 días por semana", price: "$5000" },
];

const weeklySchedule = [
  {
    day: "Lunes",
    classes: [
      { time: "06:00", activity: "Funcional" },
      { time: "07:00", activity: "Funcional" },
      { time: "08:00", activity: "GAP" },
      { time: "08:30", activity: "Crosstraining" },
      { time: "10:00", activity: "Crosstraining" },
      { time: "14:00", activity: "GAP" },
      { time: "15:00", activity: "GAP y Crosstraining" },
      { time: "16:00", activity: "Funcional" },
      { time: "18:30", activity: "Funcional" },
      { time: "19:30", activity: "Funcional" },
      { time: "21:00", activity: "Crosstraining" },
    ],
  },
  {
    day: "Martes",
    classes: [
      { time: "06:00", activity: "Funcional" },
      { time: "07:00", activity: "Funcional" },
      { time: "08:30", activity: "Crosstraining" },
      { time: "10:00", activity: "Crosstraining" },
      { time: "14:00", activity: "GAP" },
      { time: "15:00", activity: "GAP y Crosstraining" },
      { time: "16:00", activity: "Funcional" },
      { time: "18:30", activity: "Funcional" },
      { time: "19:30", activity: "Funcional" },
      { time: "21:00", activity: "Crosstraining" },
    ],
  },
  {
    day: "Miércoles",
    classes: [
      { time: "06:00", activity: "Funcional" },
      { time: "07:00", activity: "Funcional" },
      { time: "08:00", activity: "GAP" },
      { time: "08:30", activity: "Crosstraining" },
      { time: "10:00", activity: "Crosstraining" },
      { time: "14:00", activity: "GAP" },
      { time: "15:00", activity: "GAP y Crosstraining" },
      { time: "16:00", activity: "Funcional" },
      { time: "18:30", activity: "Funcional" },
      { time: "19:30", activity: "Funcional" },
      { time: "21:00", activity: "Crosstraining" },
    ],
  },
  {
    day: "Jueves",
    classes: [
      { time: "06:00", activity: "Funcional" },
      { time: "07:00", activity: "Funcional" },
      { time: "08:30", activity: "Crosstraining" },
      { time: "10:00", activity: "Crosstraining" },
      { time: "14:00", activity: "GAP" },
      { time: "15:00", activity: "GAP y Crosstraining" },
      { time: "16:00", activity: "Funcional" },
      { time: "18:30", activity: "Funcional" },
      { time: "19:30", activity: "Funcional" },
      { time: "21:00", activity: "Crosstraining" },
    ],
  },
  {
    day: "Viernes",
    classes: [
      { time: "06:00", activity: "Funcional" },
      { time: "07:00", activity: "Funcional" },
      { time: "08:00", activity: "GAP" },
      { time: "08:30", activity: "Crosstraining" },
      { time: "10:00", activity: "Crosstraining" },
      { time: "14:00", activity: "GAP" },
      { time: "15:00", activity: "GAP y Crosstraining" },
      { time: "16:00", activity: "Funcional" },
      { time: "18:30", activity: "Funcional" },
      { time: "19:30", activity: "Funcional" },
      { time: "21:00", activity: "Crosstraining" },
    ],
  },
  {
    day: "Sábado",
    classes: [
      { time: "08:00 a 10:00", activity: "Open Box" },
    ],
  },
];

const whatsappUrl = "https://wa.me/59893470604";
const instagramUrl = "https://www.instagram.com/entrenador_alexconforte";

const allTimes = Array.from(
  new Set(weeklySchedule.flatMap((day) => day.classes.map((item) => item.time)))
).sort((a, b) => a.localeCompare(b));

function getClassForDayAndTime(dayName: string, time: string) {
  const day = weeklySchedule.find((item) => item.day === dayName);
  return day?.classes.find((item) => item.time === time) ?? null;
}

function ActivityPill({ activity }: { activity: string }) {
  const lowerActivity = activity.toLowerCase();

  const isCross = lowerActivity.includes("cross");
  const isGap = lowerActivity.includes("gap");
  const isCombo = isCross && isGap;

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-bold shadow-sm ${
        isCombo
          ? "border border-red-300/50 bg-red-500/20 text-red-50"
          : isGap
            ? "border border-pink-300/40 bg-pink-500/15 text-pink-100"
            : isCross
              ? "border border-red-400/40 bg-red-500/15 text-red-100"
              : "border border-zinc-500/40 bg-zinc-700/40 text-zinc-100"
      }`}
    >
      {activity}
    </span>
  );
}

function SocialButton({
  href,
  label,
  variant = "dark",
}: {
  href: string;
  label: string;
  variant?: "dark" | "red";
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`rounded-2xl px-5 py-3 text-center font-bold transition ${
        variant === "red"
          ? "bg-red-600 text-white hover:bg-red-500"
          : "border border-white/10 bg-white/5 text-white hover:border-red-500/50 hover:bg-white/[0.07]"
      }`}
    >
      {label}
    </a>
  );
}

function AdminButton({ mobile = false }: { mobile?: boolean }) {
  return (
    <a
      href="/admin"
      className={
        mobile
          ? "rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-zinc-300 transition hover:border-red-500/50 hover:text-white lg:hidden"
          : "rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-center font-bold text-zinc-300 transition hover:border-red-500/50 hover:bg-white/[0.07] hover:text-white"
      }
    >
      Admin
    </a>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 md:px-8">
          <a href="#" className="flex items-center gap-3">
            <div className="relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl border border-white/20 bg-white shadow-[0_8px_30px_rgba(255,255,255,0.08)]">
              <Image
                src="/logo-alex.png"
                alt="Logo Alex Conforte"
                fill
                className="object-contain p-1.5"
                priority
              />
            </div>

            <span>
              <span className="block text-sm font-black leading-none tracking-tight">
                Alex Conforte
              </span>
              <span className="block text-xs text-zinc-500">
                Personal Trainer
              </span>
            </span>
          </a>

          <nav className="hidden items-center gap-6 text-sm text-zinc-300 md:flex">
            <a href="#servicios" className="transition hover:text-white">
              Servicios
            </a>
            <a href="#horarios" className="transition hover:text-white">
              Horarios
            </a>
            <a href="#precios" className="transition hover:text-white">
              Precios
            </a>
            <a href="#agenda-clase" className="transition hover:text-white">
              Reservar
            </a>
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            <SocialButton href={instagramUrl} label="Instagram" />
            <SocialButton href={whatsappUrl} label="WhatsApp" variant="red" />
            <AdminButton />
          </div>

          <AdminButton mobile />
        </div>
      </header>

      <PaymentReminderAlert />

      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(220,38,38,0.32),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(127,29,29,0.22),transparent_32%)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black to-transparent" />

        <div className="relative mx-auto grid max-w-7xl gap-10 px-5 py-16 md:grid-cols-[1.1fr_0.9fr] md:px-8 md:py-24">
          <div className="flex flex-col justify-center">
            <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm font-bold text-red-100">
              <span className="h-2 w-2 rounded-full bg-red-500" />
              Entrenamiento en Sauce, Canelones
            </div>

            <h1 className="max-w-4xl text-5xl font-black leading-[0.95] tracking-tight md:text-7xl">
              Entrená fuerte. Progresá con seguimiento.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-300">
              Funcional, crosstraining, GAP y entrenamiento personalizado con
              clases dinámicas, acompañamiento profesional y reserva online.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#agenda-clase"
                className="rounded-2xl bg-gradient-to-r from-red-600 to-red-500 px-6 py-4 text-center font-black text-white shadow-lg shadow-red-950/30 transition hover:opacity-95"
              >
                Reservar clase
              </a>

              <a
                href="#horarios"
                className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-center font-bold text-white transition hover:border-red-500/50"
              >
                Ver horarios
              </a>
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row lg:hidden">
              <SocialButton href={instagramUrl} label="Instagram" />
              <SocialButton href={whatsappUrl} label="WhatsApp" variant="red" />
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-2xl font-black text-white">4</p>
                <p className="mt-1 text-sm text-zinc-400">
                  modalidades de entrenamiento
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-2xl font-black text-white">Online</p>
                <p className="mt-1 text-sm text-zinc-400">
                  reservas desde la web
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-2xl font-black text-white">Sauce</p>
                <p className="mt-1 text-sm text-zinc-400">
                  Canelones, Uruguay
                </p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 rounded-[2.5rem] bg-red-600/20 blur-3xl" />

            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(39,39,42,0.95),rgba(9,9,11,0.95))] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.55)]">
              <div className="rounded-[1.5rem] border border-white/10 bg-black/40 p-6">
                <p className="text-sm font-bold uppercase tracking-[0.25em] text-red-500">
                  Cómo reservar
                </p>

                <h2 className="mt-4 text-4xl font-black tracking-tight">
                  Proceso simple y claro
                </h2>

                <div className="mt-6 grid gap-4">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                    <p className="text-sm font-bold text-red-400">Paso 1</p>
                    <p className="mt-2 text-zinc-200">
                      Elegí la actividad que querés realizar.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                    <p className="text-sm font-bold text-red-400">Paso 2</p>
                    <p className="mt-2 text-zinc-200">
                      Seleccioná la fecha y el horario disponible.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                    <p className="text-sm font-bold text-red-400">Paso 3</p>
                    <p className="mt-2 text-zinc-200">
                      Completá tus datos y la reserva queda registrada
                      automáticamente.
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <SocialButton
                    href={whatsappUrl}
                    label="Ir a WhatsApp"
                    variant="red"
                  />
                  <SocialButton href={instagramUrl} label="Ver Instagram" />
                </div>

                <a
                  href="#agenda-clase"
                  className="mt-4 block rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-center font-black transition hover:border-red-500/50"
                >
                  Ir al formulario de reserva
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="servicios" className="mx-auto max-w-7xl px-5 py-16 md:px-8">
        <div className="mb-8 max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-red-500">
            Entrenamientos
          </p>

          <h2 className="mt-2 text-4xl font-black tracking-tight md:text-5xl">
            Modalidades para distintos objetivos
          </h2>

          <p className="mt-4 text-zinc-400">
            Elegí el tipo de entrenamiento que mejor se adapta a tu nivel,
            disponibilidad y objetivo.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {services.map((service) => (
            <article
              key={service.title}
              className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-zinc-950 p-6 shadow-[0_10px_40px_rgba(0,0,0,0.35)] transition hover:-translate-y-1 hover:border-red-500/40"
            >
              <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-red-500/10 blur-2xl transition group-hover:bg-red-500/20" />

              <p className="relative text-sm font-bold text-red-400">
                {service.tag}
              </p>

              <h3 className="relative mt-4 text-3xl font-black">
                {service.title}
              </h3>

              <p className="relative mt-4 leading-7 text-zinc-400">
                {service.text}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section id="horarios" className="border-y border-white/10 bg-zinc-950/50">
        <div className="mx-auto max-w-7xl px-5 py-16 md:px-8">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-red-500">
                Horarios
              </p>

              <h2 className="mt-2 text-4xl font-black tracking-tight md:text-5xl">
                Horarios semanales
              </h2>

              <p className="mt-4 max-w-2xl text-zinc-400">
                Visualizá la semana completa con una grilla clara, separada y
                con mejor contraste.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <SocialButton href={instagramUrl} label="Instagram" />
              <SocialButton href={whatsappUrl} label="WhatsApp" variant="red" />
            </div>
          </div>

          <div className="overflow-x-auto rounded-[2rem] border border-white/15 bg-zinc-900/70 shadow-[0_15px_45px_rgba(0,0,0,0.35)]">
            <table className="w-full min-w-[980px] border-collapse">
              <thead>
                <tr className="bg-zinc-800/90">
                  <th className="border-b border-r border-white/15 bg-zinc-800 px-4 py-5 text-left text-sm font-black uppercase tracking-[0.2em] text-zinc-300">
                    Hora
                  </th>

                  {weeklySchedule.map((day) => (
                    <th
                      key={day.day}
                      className="border-b border-r border-white/15 bg-zinc-800 px-4 py-5 text-left text-lg font-black text-white last:border-r-0"
                    >
                      {day.day}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {allTimes.map((time, rowIndex) => (
                  <tr
                    key={time}
                    className={
                      rowIndex % 2 === 0 ? "bg-zinc-900/60" : "bg-zinc-950/70"
                    }
                  >
                    <td className="border-b border-r border-white/10 bg-zinc-800/60 px-4 py-4 font-black text-white">
                      {time}
                    </td>

                    {weeklySchedule.map((day) => {
                      const classItem = getClassForDayAndTime(day.day, time);

                      return (
                        <td
                          key={`${day.day}-${time}`}
                          className="border-b border-r border-white/10 px-3 py-3 align-middle last:border-r-0"
                        >
                          {classItem ? (
                            <div className="rounded-2xl border border-white/15 bg-zinc-800/70 px-3 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                              <div className="flex items-center justify-center text-center">
                                <ActivityPill activity={classItem.activity} />
                              </div>
                            </div>
                          ) : (
                            <div className="flex h-[52px] items-center justify-center rounded-2xl border border-dashed border-white/10 bg-zinc-900/40 text-xs text-zinc-600">
                              —
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-5 flex flex-wrap gap-3 text-sm text-zinc-400">
            <span className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2">
              Funcional
            </span>

            <span className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2">
              Crosstraining
            </span>

            <span className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2">
              GAP
            </span>

            <span className="rounded-full border border-red-500/20 bg-red-500/10 px-4 py-2 text-red-100">
              Horarios combinados: GAP y Crosstraining
            </span>
          </div>
        </div>
      </section>

      <LocalGallery />

      <section id="precios" className="mx-auto max-w-7xl px-5 py-16 md:px-8">
        <div className="mb-8">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-red-500">
            Planes
          </p>

          <h2 className="mt-2 text-4xl font-black tracking-tight md:text-5xl">
            Precios mensuales
          </h2>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-white/10 bg-zinc-950 p-6 shadow-[0_10px_40px_rgba(0,0,0,0.35)]">
            <h3 className="text-2xl font-black">
              Funcional / Crosstraining / GAP
            </h3>

            <p className="mt-2 text-sm text-zinc-400">
              Planes por frecuencia semanal.
            </p>

            <div className="mt-6 grid gap-4">
              {activityPlans.map((plan) => (
                <div
                  key={plan.title}
                  className="flex items-center justify-between gap-4 rounded-3xl border border-white/10 bg-black/40 p-5"
                >
                  <div>
                    <p className="font-bold">{plan.title}</p>
                    <p className="mt-1 text-sm text-zinc-500">{plan.note}</p>
                  </div>

                  <span className="text-3xl font-black text-red-500">
                    {plan.price}
                  </span>
                </div>
              ))}
            </div>

            <p className="mt-4 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-100">
              Promo: realizando 2 actividades obtenés 20% de descuento.
            </p>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-zinc-950 p-6 shadow-[0_10px_40px_rgba(0,0,0,0.35)]">
            <h3 className="text-2xl font-black">
              Entrenamiento personalizado
            </h3>

            <p className="mt-2 text-sm text-zinc-400">
              Seguimiento individual según objetivo y disponibilidad.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {personalPlans.map((plan) => (
                <div
                  key={plan.title}
                  className="rounded-3xl border border-white/10 bg-black/40 p-5"
                >
                  <p className="font-bold">{plan.title}</p>
                  <p className="mt-2 text-3xl font-black text-red-500">
                    {plan.price}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-4 grid gap-3 text-sm text-zinc-300">
              <p className="rounded-2xl border border-white/10 bg-black/40 p-4">
                Trimestral: 10% de descuento.
              </p>

              <p className="rounded-2xl border border-white/10 bg-black/40 p-4">
                Semestral: 15% de descuento.
              </p>

              <p className="rounded-2xl border border-white/10 bg-black/40 p-4">
                Anual: entrená 12 meses y pagá 10.
              </p>
            </div>
          </div>
        </div>

        <p className="mt-6 text-sm text-zinc-500">
          Fecha de pago hasta el 10 de cada mes. Pasada la fecha, se cobra un
          20% adicional.
        </p>
      </section>

      <section
        id="reservar"
        className="border-y border-white/10 bg-zinc-950/40"
      >
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-16 md:px-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-red-500">
              Agenda online
            </p>

            <h2 className="mt-2 text-4xl font-black tracking-tight md:text-5xl">
              Reservá tu clase en segundos
            </h2>

            <p className="mt-4 leading-8 text-zinc-400">
              Completá nombre, teléfono, actividad, fecha y horario. No
              necesitás crear usuario ni contraseña.
            </p>

            <div className="mt-8 grid gap-5">
              <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(39,39,42,0.92),rgba(9,9,11,0.96))] shadow-[0_15px_45px_rgba(0,0,0,0.35)]">
                <div className="border-b border-white/10 p-6">
                  <p className="inline-flex rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-red-300">
                    Contacto directo
                  </p>

                  <h3 className="mt-4 text-2xl font-black text-white">
                    Hablá con Alex
                  </h3>

                  <p className="mt-2 text-sm leading-7 text-zinc-400">
                    Si querés consultar precios, clases o coordinar
                    entrenamiento personalizado, también podés comunicarte
                    directamente.
                  </p>
                </div>

                <div className="grid gap-4 p-6">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
                      Instagram
                    </p>
                    <p className="mt-2 text-base font-semibold text-white">
                      @entrenador_alexconforte
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
                      WhatsApp
                    </p>
                    <p className="mt-2 text-base font-semibold text-white">
                      +598 93 470 604
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
                      Dirección
                    </p>
                    <p className="mt-2 text-base font-semibold text-white">
                      Sauce, Canelones
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <a
                      href={instagramUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-center font-bold text-white transition hover:border-red-500/50 hover:bg-white/[0.07]"
                    >
                      Abrir Instagram
                    </a>

                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-2xl bg-gradient-to-r from-red-600 to-red-500 px-5 py-4 text-center font-bold text-white transition hover:opacity-95"
                    >
                      Enviar WhatsApp
                    </a>
                  </div>
                </div>
              </div>

              <div className="rounded-[2rem] border border-red-500/20 bg-[linear-gradient(135deg,rgba(127,29,29,0.22),rgba(239,68,68,0.12))] p-5 shadow-[0_10px_30px_rgba(127,29,29,0.18)]">
                <p className="text-sm font-bold uppercase tracking-[0.2em] text-red-300">
                  Reserva online
                </p>

                <p className="mt-2 text-lg font-black text-white">
                  Tu reserva queda registrada automáticamente.
                </p>
              </div>
            </div>
          </div>

          <div id="agenda-clase" className="scroll-mt-28">
            <BookingForm />
          </div>
        </div>
      </section>

      <footer className="px-5 py-10 text-center text-sm text-zinc-500">
        <p>Alex Conforte Personal Trainer · Sauce, Canelones</p>

        <div className="mt-4 flex flex-wrap justify-center gap-4">
          <a
            href={instagramUrl}
            target="_blank"
            rel="noreferrer"
            className="text-red-400 transition hover:text-red-300"
          >
            Instagram
          </a>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="text-red-400 transition hover:text-red-300"
          >
            WhatsApp
          </a>

          <a
            href="/admin"
            className="text-zinc-500 transition hover:text-zinc-300"
          >
            Admin
          </a>
        </div>
      </footer>

      <SuggestionFloatingButton />
    </main>
  );
}