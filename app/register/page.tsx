import Link from "next/link";
import { registerAction } from "@/app/actions";

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 bg-white">
      <h1 className="mb-2 text-3xl font-bold text-slate-900">Регистрация</h1>
      <p className="mb-8 text-sm text-slate-600">Создайте личный кабинет для покупки автомобилей.</p>
      <form action={registerAction} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <input name="fullName" required className="w-full rounded-lg border border-slate-300 px-3 py-2" placeholder="ФИО" />
        <input name="phone" required className="w-full rounded-lg border border-slate-300 px-3 py-2" placeholder="Номер телефона" />
        <input name="birthDate" type="date" required className="w-full rounded-lg border border-slate-300 px-3 py-2" />
        <input name="username" required className="w-full rounded-lg border border-slate-300 px-3 py-2" placeholder="Логин" />
        <input name="password" type="password" required className="w-full rounded-lg border border-slate-300 px-3 py-2" placeholder="Пароль" />
        {error ? <p className="text-sm font-medium text-red-700">Пользователь с таким логином уже существует</p> : null}
        <button type="submit" className="w-full rounded-lg bg-slate-900 py-2 text-white">Зарегистрироваться</button>
      </form>
      <p className="mt-5 text-sm text-slate-700">
        Уже есть аккаунт? <Link href="/login" className="font-semibold text-slate-900 underline">Войти</Link>
      </p>
    </main>
  );
}
