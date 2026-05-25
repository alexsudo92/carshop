"use client";

import { useMemo, useState } from "react";
import type { Car } from "@/lib/types";

function money(value: number): string {
  return `$${value.toLocaleString("en-US")}`;
}

export function Configurator({ car }: { car: Car }) {
  const [engine, setEngine] = useState(car.engineOptions[0].id);
  const [color, setColor] = useState(car.colors[0].id);
  const [wheel, setWheel] = useState(car.wheels[0].id);
  const [interior, setInterior] = useState(car.interior[0].id);
  const [selectedPackages, setSelectedPackages] = useState<string[]>([]);

  const config = useMemo(() => {
    const find = <T extends { id: string }>(arr: T[], id: string) => arr.find((item) => item.id === id)!;
    const engineObj = find(car.engineOptions, engine);
    const colorObj = find(car.colors, color);
    const wheelObj = find(car.wheels, wheel);
    const interiorObj = find(car.interior, interior);
    const packageObjs = car.packages.filter((item) => selectedPackages.includes(item.id));
    const total =
      car.basePrice +
      engineObj.priceModifier +
      colorObj.priceModifier +
      wheelObj.priceModifier +
      interiorObj.priceModifier +
      packageObjs.reduce((acc, item) => acc + item.priceModifier, 0);

    return { engineObj, colorObj, wheelObj, interiorObj, packageObjs, total };
  }, [car, color, engine, interior, selectedPackages, wheel]);

  return (
    <section className="grid gap-8 lg:grid-cols-[1.3fr_1fr]">
      <div className="space-y-6">
        <OptionSection title="Двигатель" options={car.engineOptions} active={engine} onChange={setEngine} />
        <ColorSection colors={car.colors} active={color} onChange={setColor} />
        <OptionSection title="Диски" options={car.wheels} active={wheel} onChange={setWheel} />
        <OptionSection title="Интерьер" options={car.interior} active={interior} onChange={setInterior} />
        <PackageSection
          packages={car.packages}
          selected={selectedPackages}
          onToggle={(id) =>
            setSelectedPackages((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
          }
        />
      </div>
      <aside className="h-fit rounded-2xl border-2 border-slate-300 bg-white p-5 shadow-md lg:sticky lg:top-24">
        <h3 className="text-xl font-semibold">Ваш автомобиль</h3>
        <p className="text-sm text-slate-600">{car.brand} {car.model} {car.year}</p>
        <ul className="mt-4 space-y-2 text-sm">
          <li>{config.engineObj.name}</li>
          <li>{config.colorObj.name}</li>
          <li>{config.wheelObj.name}</li>
          <li>{config.interiorObj.name}</li>
          {config.packageObjs.map((item) => <li key={item.id}>{item.name}</li>)}
        </ul>
        <p className="mt-6 text-3xl font-bold">{money(config.total)}</p>
        <a href={`/checkout?carId=${car.id}&trimId=${config.engineObj.id}`} className="mt-4 block rounded-full bg-black px-4 py-3 text-center text-white">
          Перейти к покупке
        </a>
      </aside>
    </section>
  );
}

function OptionSection({ title, options, active, onChange }: { title: string; options: { id: string; name: string; priceModifier: number }[]; active: string; onChange: (id: string) => void; }) {
  return (
    <div>
      <h3 className="mb-2 text-lg font-semibold">{title}</h3>
      <div className="grid gap-2 md:grid-cols-2">
        {options.map((opt) => (
          <button key={opt.id} onClick={() => onChange(opt.id)} className={`rounded-xl border border-slate-300 p-3 text-left transition ${active === opt.id ? "border-slate-900 bg-slate-900 text-white" : "bg-white text-slate-900 hover:border-slate-400"}`}>
            <p className="font-medium">{opt.name}</p>
            <p className="text-sm">{opt.priceModifier ? `+ $${opt.priceModifier.toLocaleString("en-US")}` : "Включено"}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

function ColorSection({ colors, active, onChange }: { colors: { id: string; name: string; priceModifier: number; hex: string }[]; active: string; onChange: (id: string) => void; }) {
  return (
    <div>
      <h3 className="mb-2 text-lg font-semibold">Цвет кузова</h3>
      <div className="grid gap-2 md:grid-cols-3">
        {colors.map((opt) => (
          <button key={opt.id} onClick={() => onChange(opt.id)} className={`rounded-xl border border-slate-300 p-3 text-slate-900 transition ${active === opt.id ? "border-slate-900 bg-slate-100" : "hover:border-slate-400"}`}>
            <div className="mb-2 h-8 w-8 rounded-full border" style={{ background: opt.hex }} />
            <p className="text-left text-sm font-medium">{opt.name}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

function PackageSection({ packages, selected, onToggle }: { packages: { id: string; name: string; priceModifier: number }[]; selected: string[]; onToggle: (id: string) => void; }) {
  return (
    <div>
      <h3 className="mb-2 text-lg font-semibold">Пакеты опций</h3>
      <div className="space-y-2">
        {packages.map((pack) => (
          <label key={pack.id} className="flex items-center justify-between rounded-xl border border-slate-300 p-3">
            <span>{pack.name}</span>
            <span className="flex items-center gap-3">
              <span className="text-sm text-slate-700">+ ${pack.priceModifier.toLocaleString("en-US")}</span>
              <input type="checkbox" checked={selected.includes(pack.id)} onChange={() => onToggle(pack.id)} />
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}
