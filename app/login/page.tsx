import { loginAction } from "@/app/actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6">
      <h1 className="mb-2 text-3xl font-bold">Вход в AutoMarket</h1>
      <p className="mb-8 text-sm text-slate-700">Логин и пароль по умолчанию: admin / admin</p>
      <form action={loginAction} className="space-y-4 rounded border border-slate-200 p-6 shadow-md">
        <div>
          <label htmlFor="username" className="mb-1 block text-sm">
            Логин
          </label>
          <input id="username" name="username" required className="w-full rounded border px-3 py-2" />
        </div>
        <div>
          <label htmlFor="password" className="mb-1 block text-sm">
            Пароль
          </label>
          <input id="password" name="password" type="password" required className="w-full rounded border px-3 py-2" />
        </div>
        {error ? <p className="text-sm text-red-700 font-medium">Неверный логин или пароль</p> : null}
        <button type="submit" className="w-full rounded bg-black py-2 text-white">
          Войти
        </button>
      </form>
    </main>
  );
}
