import Image from "next/image";
import Link from "next/link";
import ContactForm from "@/components/ContactForm";

const services = [
  {
    title: "Control prenatal a domicilio",
    desc: "Seguimiento del embarazo, orientación clara y acompañamiento personalizado.",
    icon: "🤰",
  },
  {
    title: "Control postparto y apoyo en lactancia",
    desc: "Evaluación integral, educación práctica y apoyo en tu etapa de recuperación.",
    icon: "🍼",
  },
  {
    title: "Administración de inyectables",
    desc: "Aplicación profesional de tratamientos indicados y orientación segura.",
    icon: "💉",
  },
  {
    title: "Salud sexual y reproductiva",
    desc: "Consejería, educación y guía para tomar decisiones informadas.",
    icon: "🌿",
  },
  {
    title: "Orientación y seguimiento",
    desc: "Resolvemos dudas con información clara y enfoque basado en evidencia.",
    icon: "🧠",
  },
  {
    title: "Recetas y derivaciones",
    desc: "Según alcance profesional y normativa vigente cuando corresponda.",
    icon: "📄",
  },
];

const faqs = [
  {
    q: "¿Cómo agendo una atención?",
    a: "Completa el formulario y te contactaremos a la brevedad para confirmar disponibilidad, zona y detalles.",
  },
  {
    q: "¿Qué comunas cubres?",
    a: "Santiago y alrededores. Al enviar tu solicitud, indícanos tu comuna y dirección aproximada para coordinar.",
  },
  {
    q: "¿Cuánto demoras en responder?",
    a: "Normalmente dentro del mismo día. Si estás con una urgencia, acude a un servicio de urgencias.",
  },
  {
    q: "¿Qué incluye la atención?",
    a: "Depende del motivo y etapa. Se coordina previamente y se explica con claridad qué se hará y por qué.",
  },
];

export default function Page() {
  return (
    <main className="min-h-screen bg-[#f9f9f9] text-[#1a1a1a] [scroll-behavior:smooth]">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative h-10 w-10">
              <Image
                src="/logo.png"
                alt="Matrona en Casa"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="leading-tight">
              <p className="text-base font-semibold text-emerald-900">
                Matrona en Casa
              </p>
              <p className="text-xs text-slate-500">
                Atención profesional a domicilio
              </p>
            </div>
          </Link>

          <nav
            aria-label="Navegación principal"
            className="hidden items-center gap-6 text-sm text-slate-600 md:flex"
          >
            <a className="transition-colors duration-200 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-300" href="#servicios">
              Servicios
            </a>
            <a className="transition-colors duration-200 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-300" href="#sobre-mi">
              Sobre mí
            </a>
            <a className="transition-colors duration-200 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-300" href="#faq">
              FAQ
            </a>
            <a className="transition-colors duration-200 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-300" href="#agenda">
              Agenda
            </a>
          </nav>

          <a
            href="#agenda"
            className="rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors duration-200 ease-in-out hover:bg-emerald-800 focus:outline-none focus:ring-4 focus:ring-emerald-200"
            aria-label="Agendar atención"
          >
            Agendar
          </a>
        </div>
      </header>

      {/* HERO (Premium emocional C) */}
      <section className="relative overflow-hidden border-b border-slate-100">
        {/* fondo premium */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-28 left-1/2 h-[420px] w-[780px] -translate-x-1/2 rounded-full bg-emerald-200/35 blur-3xl" />
          <div className="absolute top-32 right-[-12rem] h-80 w-80 rounded-full bg-slate-200/45 blur-3xl" />
          <div className="absolute bottom-[-10rem] left-[-10rem] h-80 w-80 rounded-full bg-emerald-100/45 blur-3xl" />
        </div>

        <div className="mx-auto grid max-w-6xl gap-12 px-5 py-14 md:grid-cols-2 md:items-center md:py-20">
          {/* Copy */}
          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-xs text-slate-700 shadow-sm backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Santiago y alrededores • Atención a domicilio
            </div>

            <h1 className="mt-6 text-4xl font-extrabold tracking-tighter text-slate-900 md:text-5xl">
              Matrona en Casa
            </h1>

            <p className="mt-3 text-base leading-relaxed text-slate-600 md:text-lg">
              Atención profesional a domicilio en Santiago. Acompañamiento humano, claro y basado en evidencia
              para embarazo, postparto y salud femenina.
            </p>

            {/* Chips confianza */}
            <div className="mt-6 flex flex-wrap gap-2">
              <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-700 shadow-sm">
                Confidencialidad
              </span>
              <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-700 shadow-sm">
                Enfoque basado en evidencia
              </span>
              <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-700 shadow-sm">
                Atención personalizada
              </span>
            </div>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="#agenda"
                className="inline-flex items-center justify-center rounded-2xl bg-emerald-700 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-emerald-800 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-emerald-200"
              >
                Agendar atención
              </a>

              <a
                href="#servicios"
                className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow-sm transition-colors duration-200 hover:bg-slate-50 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-slate-200"
              >
                Ver servicios
              </a>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <MiniCard title="Cercanía" desc="Atención personalizada" />
              <MiniCard title="Seguridad" desc="Enfoque basado en evidencia" />
              <MiniCard title="Comodidad" desc="Atención en tu hogar" />
            </div>

            <p className="mt-8 max-w-xl text-xs leading-relaxed text-slate-400">
              *La información entregada no reemplaza una evaluación presencial. En caso de urgencia,
              acude a un servicio de urgencias.
            </p>
          </div>

          {/* Imagen protagonista */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-slate-50 shadow-sm">
              <div className="relative aspect-[4/5] w-full">
                <Image
                  src="/hero-banner.jpg"
                  alt="Atención profesional de matrona a domicilio"
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-black/0 to-black/0" />

              <div className="absolute bottom-4 left-4 right-4">
                <div className="rounded-2xl border border-white/20 bg-white/80 p-4 shadow-sm backdrop-blur">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        Atención a domicilio
                      </p>
                      <p className="mt-1 text-sm text-slate-600">
                        Coordinación rápida por formulario • Santiago y alrededores
                      </p>
                    </div>

                    <div className="hidden rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 md:block">
                      Respuesta el mismo día
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <div className="rounded-xl border border-slate-200 bg-white p-3">
                      <p className="text-xs text-slate-400">Cobertura</p>
                      <p className="mt-1 text-sm font-semibold text-slate-900">
                        Santiago + alrededores
                      </p>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-white p-3">
                      <p className="text-xs text-slate-400">Agendamiento</p>
                      <p className="mt-1 text-sm font-semibold text-slate-900">
                        Formulario web
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-400">
              <span className="h-1 w-1 rounded-full bg-emerald-500" />
              Cuidado profesional • Cercanía • Seguridad
            </div>
          </div>
        </div>
      </section>

      {/* About section (mejorada + pasos) */}
      <section className="border-t border-slate-100 bg-white py-16">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-2 md:items-center">
          <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-sm">
            <Image
              src="/about.jpg"
              alt="Atención personalizada en domicilio"
              width={900}
              height={700}
              className="h-auto w-full object-cover"
              priority={false}
            />
          </div>

          <div>
            <h2 className="text-2xl font-semibold tracking-tight">
              Atención profesional en la comodidad de tu hogar
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-600">
              Brindamos acompañamiento cercano, seguro y basado en evidencia para la salud femenina,
              embarazo y postparto. Priorizamos el respeto, la confidencialidad y la atención personalizada.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <StepCard n="1" title="Envías tu solicitud" desc="Completa el formulario con tu motivo." />
              <StepCard n="2" title="Coordinamos contigo" desc="Confirmamos disponibilidad y zona." />
              <StepCard n="3" title="Atención en tu hogar" desc="Atención profesional y cercana." />
            </div>

            <a
              href="#agenda"
              className="mt-6 inline-flex rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors duration-200 ease-in-out hover:bg-emerald-800 focus:outline-none focus:ring-4 focus:ring-emerald-200"
            >
              Solicitar atención
            </a>
          </div>
        </div>
      </section>

      {/* Servicios */}
      <section id="servicios" className="border-t border-slate-100 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight">Servicios</h2>
              <p className="mt-2 text-sm text-slate-600">
                Servicios orientados a acompañarte con claridad y tranquilidad.
              </p>
            </div>

            <a
              href="#agenda"
              className="mt-3 inline-flex w-fit items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm transition-colors duration-200 ease-in-out hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-200 md:mt-0"
            >
              Agendar atención
            </a>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <div
                key={s.title}
                className="group rounded-2xl border border-slate-100 bg-white p-8 shadow-sm transition duration-300 ease-in-out hover:-translate-y-0.5 hover:shadow-lg/5"
              >
                <div className="flex items-start gap-3">
                  <div className="grid h-11 w-11 place-items-center rounded-2xl border border-slate-200 bg-slate-50 text-xl transition group-hover:bg-white">
                    {s.icon}
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{s.title}</div>
                    <div className="mt-1 text-sm text-slate-600">{s.desc}</div>
                  </div>
                </div>
                <div className="mt-4 h-px w-full bg-slate-100" />
                <div className="mt-4 text-xs text-slate-400">
                  Coordinación por formulario • Atención a domicilio
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-2xl border border-emerald-100 bg-emerald-50 p-6">
            <div className="text-sm font-semibold text-emerald-900">
              ¿No sabes qué servicio necesitas?
            </div>
            <p className="mt-2 text-sm text-emerald-900/80">
              Describe tu caso en el formulario y te orientaré sobre el mejor camino.
            </p>
            <a
              href="#agenda"
              className="mt-4 inline-flex rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors duration-200 ease-in-out hover:bg-emerald-800 focus:outline-none focus:ring-4 focus:ring-emerald-200"
            >
              Solicitar orientación
            </a>
          </div>
        </div>
      </section>

      {/* Sobre mí */}
      <section id="sobre-mi" className="border-t border-slate-100 bg-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-2 md:items-center">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="relative h-16 w-16 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                <Image
                  src="/logo.png"
                  alt="Logo Matrona en Casa"
                  fill
                  className="object-contain p-2"
                />
              </div>

              <div>
                <div className="text-lg font-semibold">Matrona en Casa</div>
                <div className="text-sm text-slate-600">
                  Matrona • Atención a domicilio en Santiago
                </div>
              </div>
            </div>

            <div className="mt-5 space-y-3 text-sm text-slate-600">
              <p>
                Mi objetivo es acompañarte con un enfoque humano, claro y seguro. En cada atención
                buscamos resolver dudas, orientar y entregar apoyo práctico según tu etapa.
              </p>
              <p>
                La atención a domicilio permite mayor privacidad y comodidad, ideal para embarazo,
                postparto y lactancia, además de consejería en salud sexual y reproductiva.
              </p>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <Badge title="Confidencialidad" />
              <Badge title="Cercanía" />
              <Badge title="Evidencia" />
            </div>

            <a
              href="#agenda"
              className="mt-6 inline-flex rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm transition-colors duration-200 ease-in-out hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-200"
            >
              Agendar atención
            </a>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-sm">
            <div className="aspect-[4/3] w-full">
              <Image
                src="/hero2.jpg"
                alt="Atención a domicilio - Matrona"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-black/0 to-black/0" />
            <div className="absolute bottom-4 left-4 right-4">
              <div className="rounded-2xl border border-white/20 bg-white/80 p-4 backdrop-blur">
                <div className="text-sm font-semibold text-slate-900">
                  Un espacio cómodo y seguro
                </div>
                <div className="mt-1 text-sm text-slate-600">
                  Coordinación flexible • Atención a domicilio
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="border-t border-slate-100 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className="text-2xl font-extrabold tracking-tight">Preguntas frecuentes</h2>
          <p className="mt-2 text-sm text-slate-600">
            Respuestas rápidas para que agendes con tranquilidad.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {faqs.map((f) => (
              <details
                key={f.q}
                className="group rounded-2xl border border-slate-100 bg-white p-8 shadow-sm transition-shadow duration-300 ease-in-out hover:shadow-lg/5 focus-within:shadow-lg/5 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              >
                <summary className="cursor-pointer list-none text-sm font-extrabold tracking-tight text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-200">
                  <div className="flex items-center justify-between gap-4">
                    <span>{f.q}</span>
                    <span className="text-slate-400 transition group-open:rotate-45">+</span>
                  </div>
                </summary>
                <p className="mt-3 text-sm text-slate-600">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Agenda */}
      <section id="agenda" className="border-t border-slate-100 bg-white">
        <div className="mx-auto max-w-6xl px-5 py-14">
          <div className="grid gap-10 md:grid-cols-2 md:items-start">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">Agenda una atención</h2>
              <p className="mt-2 text-sm text-slate-600">
                Completa el formulario con tus datos y una breve descripción. Te contactaremos a la brevedad.
              </p>

              <div className="mt-6 grid gap-3">
                <InfoCard title="Cobertura" desc="Santiago y alrededores." />
                <InfoCard
                  title="Privacidad"
                  desc="Tu información se utiliza solo para coordinar la atención."
                />
                <InfoCard
                  title="Tiempos"
                  desc="Normalmente respondemos dentro del mismo día."
                />
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <ContactForm />
            </div>
          </div>

          <p className="mt-10 text-xs text-slate-400">
            *La información entregada no reemplaza una evaluación clínica presencial. En caso de urgencia,
            acude a un servicio de urgencias.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 bg-white">
        <div className="mx-auto max-w-6xl px-5 py-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <div className="relative h-10 w-10">
                <Image
                  src="/logo.png"
                  alt="Matrona en Casa"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <div>
                <div className="text-sm font-semibold">Matrona en Casa</div>
                <div className="text-xs text-slate-400">Matrona • Santiago, Chile</div>
              </div>
            </div>

            <div className="text-xs text-slate-400">
              © {new Date().getFullYear()} Matrona en Casa • Atención a domicilio
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}

function MiniCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow duration-200 ease-in-out hover:shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-200">
      <div className="text-sm font-extrabold tracking-tight">{title}</div>
      <div className="mt-1 text-xs leading-relaxed text-slate-600">{desc}</div>
    </div>
  );
}

function StepCard({
  n,
  title,
  desc,
}: {
  n: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow duration-200 ease-in-out hover:shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-200">
      <div className="flex items-center gap-2">
        <div className="grid h-7 w-7 place-items-center rounded-full bg-emerald-700 text-xs font-semibold text-white">
          {n}
        </div>
        <div className="text-sm font-extrabold tracking-tight">{title}</div>
      </div>
      <div className="mt-2 text-xs leading-relaxed text-slate-600">{desc}</div>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow duration-200 ease-in-out hover:shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-200">
      <div className="text-xs text-slate-400">{title}</div>
      <div className="mt-1 text-sm font-extrabold">{value}</div>
    </div>
  );
}

function Badge({ title }: { title: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700">
      {title}
    </div>
  );
}

function InfoCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow duration-200 ease-in-out hover:shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-200">
      <div className="text-sm font-extrabold tracking-tight">{title}</div>
      <div className="mt-1 text-sm text-slate-600">{desc}</div>
    </div>
  );
}