import { updateProfileAction } from "@/app/actions";
import { getCurrentUsername } from "@/lib/auth";
import { getUserByUsername } from "@/lib/store";
import { redirect } from "next/navigation";
import { Header } from "@/components/header";

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string }>;
}) {
  const { success } = await searchParams;
  const username = await getCurrentUsername();

  if (!username) redirect("/login");

  const user = getUserByUsername(username);
  if (!user) redirect("/login");

  return (
    <div className="min-h-screen bg-[#eceff3] text-slate-900">
      <Header />
      <main className="mx-auto max-w-3xl px-6 py-10">
        <h1 className="text-3xl font-semibold">Личный кабинет</h1>
        {success ? <p className="mt-2 text-green-700">Данные успешно обновлены.</p> : null}
        <form action={updateProfileAction} className="mt-6 space-y-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-md">
          <input name="fullName" defaultValue={user.fullName} className="w-full rounded-lg border px-4 py-3" required />
          <input name="phone" defaultValue={user.phone} className="w-full rounded-lg border px-4 py-3" required />
          <input name="birthDate" type="date" defaultValue={user.birthDate} className="w-full rounded-lg border px-4 py-3" required />
          <input name="password" type="password" defaultValue={user.password} className="w-full rounded-lg border px-4 py-3" required />
          <textarea
            name="paymentMethods"
            defaultValue={user.paymentMethods.join("\n")}
            className="h-32 w-full rounded-lg border px-4 py-3"
            placeholder="Способы оплаты, каждый с новой строки"
          />
          <button type="submit" className="w-full rounded-full bg-black py-3 text-white">Сохранить изменения</button>
        </form>
      </main>
    </div>
  );
}
