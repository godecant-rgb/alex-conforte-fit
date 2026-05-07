"use client";

type AlertConfig = {
  title: string;
  message: string;
  tone: "normal" | "urgent";
};

function getPaymentAlert(): AlertConfig | null {
  const today = new Date();
  const day = today.getDate();

  if (day === 4 || day === 5) {
    return {
      title: "Recordatorio de pago",
      message:
        "Te recordamos que los pagos mensuales se realizan hasta el día 10 de cada mes. Luego se aplica un recargo del 20%.",
      tone: "normal",
    };
  }

  if (day === 9) {
    return {
      title: "Últimos días para pagar sin recargo",
      message:
        "Recordá que tenés tiempo hasta mañana, día 10, para realizar el pago mensual sin recargo.",
      tone: "urgent",
    };
  }

  return null;
}

export default function PaymentReminderAlert() {
  const alert = getPaymentAlert();

  if (!alert) return null;

  const isUrgent = alert.tone === "urgent";

  return (
    <section
      className={`border-y ${
        isUrgent
          ? "border-red-500/30 bg-red-500/10"
          : "border-amber-500/30 bg-amber-500/10"
      }`}
    >
      <div className="mx-auto max-w-7xl px-5 py-4 md:px-8">
        <div
          className={`rounded-3xl border p-5 shadow-[0_10px_35px_rgba(0,0,0,0.25)] ${
            isUrgent
              ? "border-red-500/30 bg-[linear-gradient(135deg,rgba(127,29,29,0.35),rgba(0,0,0,0.35))]"
              : "border-amber-500/30 bg-[linear-gradient(135deg,rgba(146,64,14,0.28),rgba(0,0,0,0.35))]"
          }`}
        >
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p
                className={`text-xs font-black uppercase tracking-[0.25em] ${
                  isUrgent ? "text-red-300" : "text-amber-300"
                }`}
              >
                Aviso importante
              </p>

              <h2 className="mt-2 text-2xl font-black text-white">
                {alert.title}
              </h2>

              <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-200">
                {alert.message}
              </p>
            </div>

            <div
              className={`rounded-2xl px-4 py-3 text-center text-sm font-black ${
                isUrgent
                  ? "bg-red-600 text-white"
                  : "bg-amber-500 text-black"
              }`}
            >
              Pagos hasta el día 10
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}