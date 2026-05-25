import { Header } from "@/components/header";

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-[#eceff3] text-slate-900">
      <Header />
      <main className="mx-auto grid max-w-5xl gap-6 px-6 py-10 lg:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md">
          <h1 className="text-3xl font-semibold">Оформление заказа</h1>
          <p className="mt-2 text-slate-700">Оставьте контакты — персональный менеджер подтвердит конфигурацию и финальную цену.</p>
          <form className="mt-6 space-y-3">
            <input className="w-full rounded-lg border px-4 py-3" placeholder="Имя и фамилия" required />
            <input className="w-full rounded-lg border px-4 py-3" placeholder="Телефон" required />
            <input className="w-full rounded-lg border px-4 py-3" placeholder="Email" type="email" required />
            <textarea className="h-28 w-full rounded-lg border px-4 py-3" placeholder="Комментарий к заказу" />
            <button type="button" className="w-full rounded-full bg-black py-3 text-white">Отправить заявку</button>
          </form>
        </section>
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md">
          <h2 className="text-xl font-semibold">Что дальше</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-800">
            <li>Менеджер свяжется с вами в течение 30 минут в рабочее время.</li>
            <li>Подтвердим наличие и сроки поставки.</li>
            <li>Согласуем трейд-ин, кредит или лизинг при необходимости.</li>
          </ul>
        </section>
      </main>
    </div>
  );
}
