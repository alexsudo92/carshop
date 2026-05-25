"use client";

import { useState } from "react";

export function CheckoutSuccessModal({ openInitially }: { openInitially: boolean }) {
  const [open, setOpen] = useState(openInitially);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <h3 className="text-2xl font-semibold text-slate-900">Заявка подтверждена</h3>
        <p className="mt-2 text-slate-700">Спасибо! Мы уже получили вашу заявку и скоро свяжемся с вами.</p>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="mt-5 w-full rounded-lg bg-slate-900 py-2 text-white"
        >
          Закрыть
        </button>
      </div>
    </div>
  );
}
