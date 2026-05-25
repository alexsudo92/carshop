import Link from "next/link";
import { loginAction } from "@/app/actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 bg-white">
      <h1 className="mb-2 text-3xl font-bold text-slate-900">Вход в AutoMarket</h1>
      <p className="mb-8 text-sm text-slate-600">Войдите в аккаунт, чтобы оформить покупку и управлять профилем.</p>
      <form action={loginAction} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <label htmlFor="username" className="mb-1 block text-sm text-slate-700">Логин</label>
          <input id="username" name="username" required className="w-full rounded-lg border border-slate-300 px-3 py-2" />
        </div>
        <div>
          <label htmlFor="password" className="mb-1 block text-sm text-slate-700">Пароль</label>
          <input id="password" name="password" type="password" required className="w-full rounded-lg border border-slate-300 px-3 py-2" />
        </div>
        {error ? <p className="text-sm font-medium text-red-700">Неверный логин или пароль</p> : null}
        <button type="submit" className="w-full rounded-lg bg-slate-900 py-2 text-white">Войти</button>
      </form>
      <p className="mt-5 text-sm text-slate-700">
        Нет аккаунта? <Link href="/register" className="font-semibold text-slate-900 underline">Зарегистрироваться</Link>
      </p>
    </main>
  );
}
