import { checkoutAction } from "@/app/actions";
import { Header } from "@/components/header";
import { CheckoutSuccessModal } from "@/components/checkout-success-modal";
import { getCurrentUsername } from "@/lib/auth";
import { getUserByUsername } from "@/lib/store";
import { redirect } from "next/navigation";

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; error?: string }>;
}) {
  const { success, error } = await searchParams;
  const username = await getCurrentUsername();
  if (!username) redirect("/login");

  const user = getUserByUsername(username);
  if (!user) redirect("/profile");

  return (
    <div className="min-h-screen bg-[#eceff3] text-slate-900">
      <Header />
      <main className="mx-auto grid max-w-5xl gap-6 px-6 py-10 lg:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-md">
          <h1 className="text-3xl font-semibold">Оформление заказа</h1>
          <p className="mt-2 text-slate-700">Данные покупателя автоматически подставлены из личного кабинета.</p>
          <form action={checkoutAction} className="mt-6 space-y-3">
            <input className="w-full rounded-lg border px-4 py-3" value={user.fullName} readOnly />
            <input className="w-full rounded-lg border px-4 py-3" value={user.phone} readOnly />
            <input className="w-full rounded-lg border px-4 py-3" value={user.birthDate} readOnly />
            <select name="paymentMethod" className="w-full rounded-lg border px-4 py-3" required>
              <option value="">Выберите способ оплаты</option>
              {user.paymentMethods.map((method) => (
                <option key={method} value={method}>{method}</option>
              ))}
            </select>
            {error ? <p className="text-sm text-red-700">Выбран неверный способ оплаты.</p> : null}
            {success ? <p className="text-sm text-green-700">Заявка отправлена.</p> : null}
            <button type="submit" className="w-full rounded-full bg-black py-3 text-white">Отправить заявку</button>
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
      <CheckoutSuccessModal openInitially={Boolean(success)} />
    </div>
  );
}
