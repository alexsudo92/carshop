import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/header";
import { getCars } from "@/lib/store";

export default function CatalogPage() {
  const cars = getCars();
  return (
    <div className="bg-[#eceff3] min-h-screen text-slate-900">
      <Header />
      <main className="mx-auto max-w-7xl px-6 py-10">
        <h1 className="mb-8 text-4xl font-semibold">Выберите модель для конфигурации</h1>
        <div className="grid gap-6 lg:grid-cols-2">
          {cars.map((car) => (
            <article key={car.id} className="overflow-hidden rounded-3xl bg-white shadow-md">
              <Image src={car.heroImage} alt={`${car.brand} ${car.model}`} width={1200} height={600} className="h-72 w-full object-cover" />
              <div className="space-y-3 p-6">
                <h2 className="text-2xl font-semibold">{car.brand} {car.model}</h2>
                <p className="text-slate-700">{car.description}</p>
                <p className="text-sm text-slate-600">{car.specs.body} • {car.specs.drivetrain} • {car.engineOptions.length} варианта двигателя</p>
                <p className="text-xl font-medium">от ${car.basePrice.toLocaleString("en-US")}</p>
                <Link href={`/car/${car.id}`} className="inline-block rounded-full bg-black px-5 py-2 text-white">Открыть конфигуратор</Link>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
