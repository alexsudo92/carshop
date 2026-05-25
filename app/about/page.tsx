import { Header } from "@/components/header";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#eceff3] text-slate-900">
      <Header />
      <main className="mx-auto max-w-4xl px-6 py-10">
        <h1 className="text-4xl font-semibold">О нас</h1>
        <p className="mt-4 text-lg text-slate-800">AutoMarket Studio — цифровой бутик премиальных автомобилей. Мы объединяем удобный онлайн-конфигуратор и персональный сервис, чтобы путь к вашему автомобилю был таким же приятным, как вождение.</p>
      </main>
    </div>
  );
}
