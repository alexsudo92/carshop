import { Header } from "@/components/header";

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-[#eceff3] text-slate-900">
      <Header />
      <main className="mx-auto max-w-4xl px-6 py-10">
        <h1 className="text-4xl font-semibold">Поддержка</h1>
        <p className="mt-4 text-lg text-slate-800">Нужна помощь с выбором комплектации, финансированием или доставкой? Наша команда поддержки доступна ежедневно с 09:00 до 21:00. Напишите на support@automarket.local или позвоните +7 (800) 555-10-10.</p>
      </main>
    </div>
  );
}
