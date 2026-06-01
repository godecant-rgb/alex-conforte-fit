"use client";

import { useEffect, useMemo, useState } from "react";

type SuggestionStatus = "pending" | "reviewed" | "resolved" | "archived";

type Suggestion = {
  id: string;
  name: string;
  category: string;
  message: string;
  status: SuggestionStatus;
  created_at: string;
  updated_at: string;
};

const statusLabels: Record<SuggestionStatus, string> = {
  pending: "Pendiente",
  reviewed: "Revisada",
  resolved: "Resuelta",
  archived: "Archivada",
};

const statusClasses: Record<SuggestionStatus, string> = {
  pending: "border-amber-400/30 bg-amber-400/10 text-amber-200",
  reviewed: "border-sky-400/30 bg-sky-400/10 text-sky-200",
  resolved: "border-emerald-400/30 bg-emerald-400/10 text-emerald-200",
  archived: "border-zinc-400/20 bg-zinc-400/10 text-zinc-300",
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("es-UY", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export default function AdminSuggestionsPanel() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState("");
  const [error, setError] = useState("");

  async function loadSuggestions() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/suggestions", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error ?? "No se pudieron cargar las sugerencias.");
      }

      setSuggestions(data.suggestions ?? []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Error al cargar las sugerencias."
      );
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id: string, status: SuggestionStatus) {
    setUpdatingId(id);
    setError("");

    try {
      const response = await fetch("/api/admin/suggestions", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, status }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error ?? "No se pudo actualizar la sugerencia.");
      }

      await loadSuggestions();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Error al actualizar la sugerencia."
      );
    } finally {
      setUpdatingId("");
    }
  }

  useEffect(() => {
    loadSuggestions();
  }, []);

  const counters = useMemo(() => {
    return {
      total: suggestions.length,
      pending: suggestions.filter((item) => item.status === "pending").length,
      reviewed: suggestions.filter((item) => item.status === "reviewed").length,
      resolved: suggestions.filter((item) => item.status === "resolved").length,
      archived: suggestions.filter((item) => item.status === "archived").length,
    };
  }, [suggestions]);

  return (
    <section className="rounded-[2rem] border border-white/10 bg-zinc-950 p-5 shadow-[0_15px_45px_rgba(0,0,0,0.35)] md:p-6">
      <div className="flex flex-col justify-between gap-4 border-b border-white/10 pb-5 md:flex-row md:items-end">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.25em] text-red-400">
            Feedback
          </p>

          <h2 className="mt-2 text-3xl font-black text-white">
            Sugerencias recibidas
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
            Comentarios enviados desde la web sobre horarios, actividades,
            instalaciones, pagos u otras mejoras.
          </p>
        </div>

        <button
          type="button"
          onClick={loadSuggestions}
          className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-black text-zinc-200 transition hover:border-red-500/40 hover:text-white"
        >
          Actualizar
        </button>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-white/10 bg-black/35 p-4">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
            Total
          </p>
          <p className="mt-2 text-3xl font-black text-white">{counters.total}</p>
        </div>

        <div className="rounded-2xl border border-amber-400/20 bg-amber-400/5 p-4">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-300">
            Pendientes
          </p>
          <p className="mt-2 text-3xl font-black text-white">
            {counters.pending}
          </p>
        </div>

        <div className="rounded-2xl border border-sky-400/20 bg-sky-400/5 p-4">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-300">
            Revisadas
          </p>
          <p className="mt-2 text-3xl font-black text-white">
            {counters.reviewed}
          </p>
        </div>

        <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-4">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-300">
            Resueltas
          </p>
          <p className="mt-2 text-3xl font-black text-white">
            {counters.resolved}
          </p>
        </div>
      </div>

      {error ? (
        <div className="mt-5 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm font-bold text-red-200">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="mt-5 rounded-2xl border border-white/10 bg-black/30 p-5 text-sm text-zinc-400">
          Cargando sugerencias...
        </div>
      ) : suggestions.length === 0 ? (
        <div className="mt-5 rounded-2xl border border-white/10 bg-black/30 p-5 text-sm text-zinc-400">
          Todavía no hay sugerencias recibidas.
        </div>
      ) : (
        <div className="mt-5 grid gap-4">
          {suggestions.map((suggestion) => (
            <article
              key={suggestion.id}
              className="rounded-[1.5rem] border border-white/10 bg-black/35 p-5"
            >
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-black ${
                        statusClasses[suggestion.status]
                      }`}
                    >
                      {statusLabels[suggestion.status]}
                    </span>

                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold text-zinc-300">
                      {suggestion.category}
                    </span>
                  </div>

                  <h3 className="mt-4 text-xl font-black text-white">
                    {suggestion.name}
                  </h3>

                  <p className="mt-1 text-xs text-zinc-500">
                    {formatDate(suggestion.created_at)}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={updatingId === suggestion.id}
                    onClick={() => updateStatus(suggestion.id, "reviewed")}
                    className="rounded-xl border border-sky-400/20 bg-sky-400/10 px-3 py-2 text-xs font-black text-sky-200 transition hover:bg-sky-400/15 disabled:opacity-50"
                  >
                    Revisada
                  </button>

                  <button
                    type="button"
                    disabled={updatingId === suggestion.id}
                    onClick={() => updateStatus(suggestion.id, "resolved")}
                    className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 text-xs font-black text-emerald-200 transition hover:bg-emerald-400/15 disabled:opacity-50"
                  >
                    Resuelta
                  </button>

                  <button
                    type="button"
                    disabled={updatingId === suggestion.id}
                    onClick={() => updateStatus(suggestion.id, "archived")}
                    className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-black text-zinc-300 transition hover:bg-white/10 disabled:opacity-50"
                  >
                    Archivar
                  </button>
                </div>
              </div>

              <p className="mt-4 whitespace-pre-line rounded-2xl border border-white/10 bg-zinc-950/80 p-4 text-sm leading-7 text-zinc-300">
                {suggestion.message}
              </p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}