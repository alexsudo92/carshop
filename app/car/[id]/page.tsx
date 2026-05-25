import Image from "next/image";
import { notFound } from "next/navigation";
import { Header } from "@/components/header";
import { Configurator } from "@/components/configurator";
import { getCarById } from "@/lib/store";

export default async function CarPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const car = getCarById(id);

  if (!car) notFound();

  return (
    <div className="bg-[#eceff3] text-slate-900">
      <Header />
      <main className="mx-auto max-w-7xl px-6 py-8">
        <section className="mb-10 grid gap-4 rounded-3xl bg-white p-4 shadow-sm lg:grid-cols-2 lg:p-8">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-slate-600">Конфигуратор</p>
            <h1 className="mt-1 text-4xl font-semibold">{car.brand} {car.model}</h1>
            <p className="mt-3 text-slate-700">{car.description}</p>
          </div>
          <Image src={car.heroImage} alt={`${car.brand} ${car.model}`} width={900} height={520} className="h-72 w-full rounded-2xl object-cover" />
        </section>
        <section className="mb-10 grid gap-6 rounded-3xl bg-white p-6 shadow-sm lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-semibold">Характеристики</h2>
            <dl className="mt-4 grid grid-cols-1 gap-3 text-sm text-slate-700 sm:grid-cols-2">
              <div><dt className="font-medium text-slate-900">Кузов</dt><dd>{car.specs.body}</dd></div>
              <div><dt className="font-medium text-slate-900">Привод</dt><dd>{car.specs.drivetrain}</dd></div>
              <div><dt className="font-medium text-slate-900">Разгон 0–100</dt><dd>{car.specs.acceleration}</dd></div>
              <div><dt className="font-medium text-slate-900">Макс. скорость</dt><dd>{car.specs.topSpeed}</dd></div>
              <div><dt className="font-medium text-slate-900">Расход</dt><dd>{car.specs.consumption}</dd></div>
              <div><dt className="font-medium text-slate-900">Трансмиссия</dt><dd>{car.specs.transmission}</dd></div>
            </dl>
          </div>
          <div>
            <h2 className="text-2xl font-semibold">Ключевые опции</h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-slate-700">
              {car.highlights.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
        </section>
        <Configurator car={car} />
      </main>
    </div>
  );
}
