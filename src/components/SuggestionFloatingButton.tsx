"use client";

import { useState } from "react";

const categories = [
  "Horarios",
  "Actividades",
  "Instalaciones",
  "Pagos",
  "Otra sugerencia",
];

export default function SuggestionFloatingButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Horarios");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">(
    "idle"
  );
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setStatus("sending");
    setError("");

    try {
      const response = await fetch("/api/suggestions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          category,
          message,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error ?? "No se pudo enviar la sugerencia.");
      }

      setStatus("success");
      setName("");
      setCategory("Horarios");
      setMessage("");
    } catch (err) {
      setStatus("error");
      setError(
        err instanceof Error
          ? err.message
          : "Ocurrió un error al enviar la sugerencia."
      );
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-5 right-5 z-[70] rounded-full border border-red-400/30 bg-gradient-to-r from-red-600 to-red-500 px-5 py-4 text-sm font-black text-white shadow-[0_18px_45px_rgba(220,38,38,0.35)] transition hover:scale-[1.03] hover:opacity-95"
      >
        Sugerencias
      </button>

      {isOpen ? (
        <div className="fixed inset-0 z-[80] flex items-end justify-center bg-black/70 px-4 py-5 backdrop-blur-sm sm:items-center">
          <div className="w-full max-w-lg overflow-hidden rounded-[2rem] border border-white/10 bg-zinc-950 shadow-[0_25px_90px_rgba(0,0,0,0.65)]">
            <div className="border-b border-white/10 bg-[linear-gradient(135deg,rgba(127,29,29,0.38),rgba(9,9,11,0.95))] p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.25em] text-red-300">
                    Tu opinión importa
                  </p>

                  <h2 className="mt-2 text-3xl font-black text-white">
                    ¿Tenés una sugerencia?
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-zinc-300">
                    Queremos mejorar la experiencia de entrenamiento. Dejanos tu
                    comentario sobre horarios, actividades o el gimnasio.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm font-black text-zinc-300 transition hover:bg-white/10 hover:text-white"
                >
                  ✕
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-4 p-6">
              <label className="grid gap-2">
                <span className="text-sm font-bold text-zinc-300">Nombre</span>
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Tu nombre"
                  required
                  className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-red-500/60"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-bold text-zinc-300">
                  Categoría
                </span>
                <select
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition focus:border-red-500/60"
                >
                  {categories.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-bold text-zinc-300">
                  Mensaje
                </span>
                <textarea
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  placeholder="Escribí tu sugerencia..."
                  required
                  minLength={5}
                  rows={5}
                  className="resize-none rounded-2xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-red-500/60"
                />
              </label>

              {status === "success" ? (
                <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm font-bold text-emerald-200">
                  Sugerencia enviada correctamente. ¡Gracias por ayudarnos a
                  mejorar!
                </div>
              ) : null}

              {status === "error" ? (
                <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm font-bold text-red-200">
                  {error}
                </div>
              ) : null}

              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 font-black text-zinc-300 transition hover:border-white/20 hover:text-white"
                >
                  Cerrar
                </button>

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="rounded-2xl bg-gradient-to-r from-red-600 to-red-500 px-5 py-4 font-black text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {status === "sending" ? "Enviando..." : "Enviar sugerencia"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}