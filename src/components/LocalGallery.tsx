import Image from "next/image";

const localPhotos = [
  {
    src: "/local/local-1.jpg",
    title: "Espacio de entrenamiento",
    description:
      "Un ambiente preparado para entrenar con comodidad, energía y seguimiento.",
  },
  {
    src: "/local/local-2.jpg",
    title: "Clases dinámicas",
    description:
      "Entrenamientos funcionales y crosstraining adaptados a distintos niveles.",
  },
  {
    src: "/local/local-3.jpg",
    title: "Equipamiento",
    description:
      "Materiales y elementos para trabajar fuerza, resistencia y movilidad.",
  },
  {
    src: "/local/local-4.jpg",
    title: "Seguimiento personalizado",
    description:
      "Acompañamiento cercano para mejorar técnica, constancia y progreso.",
  },
];

export default function LocalGallery() {
  return (
    <section
      id="local"
      className="border-y border-white/10 bg-[linear-gradient(180deg,rgba(9,9,11,0.96),rgba(24,24,27,0.74),rgba(9,9,11,0.96))]"
    >
      <div className="mx-auto max-w-7xl px-5 py-16 md:px-8">
        <div className="mb-10 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-red-500">
              El espacio
            </p>

            <h2 className="mt-2 max-w-3xl text-4xl font-black tracking-tight md:text-5xl">
              Conocé el lugar donde vas a entrenar
            </h2>

            <p className="mt-4 max-w-2xl leading-8 text-zinc-400">
              Un local pensado para entrenamientos funcionales, crosstraining y
              clases personalizadas, con ambiente cercano y acompañamiento real.
            </p>
          </div>

          <a
            href="#reservar"
            className="rounded-2xl bg-gradient-to-r from-red-600 to-red-500 px-6 py-4 text-center font-black text-white transition hover:opacity-95"
          >
            Reservar una clase
          </a>
        </div>

        <div className="grid gap-5 lg:grid-cols-4">
          <article className="relative min-h-[420px] overflow-hidden rounded-[2rem] border border-white/10 bg-zinc-950 shadow-[0_20px_70px_rgba(0,0,0,0.45)] lg:col-span-2">
            <Image
              src={localPhotos[0].src}
              alt={localPhotos[0].title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent" />

            <div className="absolute bottom-0 p-6">
              <p className="inline-flex rounded-full border border-red-500/30 bg-red-500/15 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-red-200">
                Alex Conforte PT
              </p>

              <h3 className="mt-4 text-3xl font-black text-white">
                {localPhotos[0].title}
              </h3>

              <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-300">
                {localPhotos[0].description}
              </p>
            </div>
          </article>

          <div className="grid gap-5 lg:col-span-2">
            {localPhotos.slice(1).map((photo) => (
              <article
                key={photo.src}
                className="group grid overflow-hidden rounded-[2rem] border border-white/10 bg-zinc-950 shadow-[0_10px_40px_rgba(0,0,0,0.35)] sm:grid-cols-[0.9fr_1.1fr]"
              >
                <div className="relative min-h-[190px] overflow-hidden">
                  <Image
                    src={photo.src}
                    alt={photo.title}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, 35vw"
                  />

                  <div className="absolute inset-0 bg-black/10" />
                </div>

                <div className="flex flex-col justify-center p-5">
                  <h3 className="text-2xl font-black text-white">
                    {photo.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-zinc-400">
                    {photo.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}