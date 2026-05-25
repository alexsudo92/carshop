import Link from "next/link";
import { logoutAction } from "@/app/actions";

export function Header() {
  return (
    <header className="sticky top-0 z-20 border-b bg-slate-50/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/catalog" className="text-xl font-semibold tracking-wide">
          AutoMarket Studio
        </Link>
        <nav className="hidden gap-6 text-base md:flex">
          <Link href="/catalog" className="hover:underline">Каталог</Link>
          <Link href="/about" className="hover:underline">О нас</Link>
          <Link href="/support" className="hover:underline">Поддержка</Link>
        </nav>
        <form action={logoutAction}>
          <button type="submit" className="rounded-full border border-slate-400 px-4 py-1.5 text-sm font-medium text-slate-800 hover:bg-slate-900 hover:text-white">Выйти</button>
        </form>
      </div>
    </header>
  );
}
