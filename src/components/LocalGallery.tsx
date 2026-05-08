import Image from "next/image";

const featuredPhoto = {
  src: "/local/local-9.jpg",
  title: "Un espacio pensado para entrenar mejor",
  description:
    "Ambiente equipado, cómodo y preparado para entrenamientos funcionales, crosstraining y clases personalizadas.",
};

const localPhotos = [
  {
    src: "/local/local-1.jpg",
    title: "Entrada del local",
    category: "Exterior",
  },
  {
    src: "/local/local-2.jpg",
    title: "Vista exterior",
    category: "Local",
  },
  {
    src: "/local/local-3.jpg",
    title: "Área principal de entrenamiento",
    category: "Entrenamiento",
  },
  {
    src: "/local/local-4.jpg",
    title: "Zona funcional",
    category: "Funcional",
  },
  {
    src: "/local/local-5.jpg",
    title: "Espacio para clases",
    category: "Clases",
  },
  {
    src: "/local/local-6.jpg",
    title: "Sector de fuerza",
    category: "Fuerza",
  },
  {
    src: "/local/local-7.jpg",
    title: "Equipamiento disponible",
    category: "Equipamiento",
  },
  {
    src: "/local/local-8.jpg",
    title: "Detalles del espacio",
    category: "Ambiente",
  },
  {
    src: "/local/local-9.jpg",
    title: "Alex Conforte Personal Trainer",
    category: "Trainer",
  },
  {
    src: "/local/local-10.jpg",
    title: "Equipo de Trabajo",
    category: "Instalaciones",
  },
  {
    src: "/local/local-11.jpg",
    title: "Identidad del gimnasio",
    category: "Marca",
  },
  {
    src: "/local/local-12.jpg",
    title: "Espacio iluminado",
    category: "Ambiente",
  },
];

export default function LocalGallery() {
  return (
    <section
      id="local"
      className="border-y border-white/10 bg-[linear-gradient(180deg,rgba(9,9,11,0.98),rgba(24,24,27,0.9),rgba(9,9,11,0.98))]"
    >
      <div className="mx-auto max-w-7xl px-5 py-16 md:px-8">
        <div className="mb-10 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-red-500">
              El local
            </p>

            <h2 className="mt-2 max-w-3xl text-4xl font-black tracking-tight text-white md:text-5xl">
              Conocé el espacio de entrenamiento
            </h2>

            <p className="mt-4 max-w-2xl leading-8 text-zinc-400">
              Un ambiente preparado para entrenar con intensidad, comodidad y
              seguimiento profesional.
            </p>
          </div>

          <a
            href="#reservar"
            className="rounded-2xl bg-gradient-to-r from-red-600 to-red-500 px-6 py-4 text-center font-black text-white shadow-[0_12px_35px_rgba(220,38,38,0.25)] transition hover:opacity-95"
          >
            Reservar una clase
          </a>
        </div>

        <article className="relative mb-8 min-h-[560px] overflow-hidden rounded-[2.5rem] border border-white/10 bg-zinc-950 shadow-[0_30px_100px_rgba(0,0,0,0.65)]">
          <Image
            src={featuredPhoto.src}
            alt={featuredPhoto.title}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-black/10" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(220,38,38,0.30),transparent_34%)]" />

          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
            <p className="inline-flex rounded-full border border-red-500/30 bg-red-500/15 px-4 py-2 text-xs font-black uppercase tracking-[0.25em] text-red-100 backdrop-blur">
              Alex Conforte Personal Trainer
            </p>

            <h3 className="mt-5 max-w-4xl text-4xl font-black tracking-tight text-white md:text-6xl">
              {featuredPhoto.title}
            </h3>

            <p className="mt-4 max-w-2xl text-base leading-8 text-zinc-200">
              {featuredPhoto.description}
            </p>
          </div>
        </article>

        <div className="mb-6 flex flex-col justify-between gap-3 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-red-500">
              Galería
            </p>

            <h3 className="mt-2 text-3xl font-black text-white">
              Fotos del espacio
            </h3>
          </div>

          <p className="max-w-xl text-sm leading-6 text-zinc-500">
            Imágenes del local, equipamiento y ambiente de entrenamiento.
          </p>
        </div>

        <div className="grid auto-rows-[260px] gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {localPhotos.map((photo, index) => {
            const isLarge = index === 0 || index === 4 || index === 8;

            return (
              <article
                key={photo.src}
                className={`group relative overflow-hidden rounded-[2rem] border border-white/10 bg-zinc-950 shadow-[0_14px_45px_rgba(0,0,0,0.42)] ${
                  isLarge ? "sm:row-span-2" : ""
                } ${index === 8 ? "lg:col-span-2" : ""}`}
              >
                <Image
                  src={photo.src}
                  alt={photo.title}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent" />
                <div className="absolute inset-0 opacity-0 transition group-hover:bg-red-950/10 group-hover:opacity-100" />

                <div className="absolute left-0 right-0 top-0 flex justify-between p-4">
                  <span className="rounded-full border border-white/10 bg-black/45 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-200 backdrop-blur">
                    {photo.category}
                  </span>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h4 className="text-xl font-black leading-tight text-white">
                    {photo.title}
                  </h4>

                  <div className="mt-3 h-1 w-12 rounded-full bg-red-600 transition-all duration-300 group-hover:w-24" />
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}