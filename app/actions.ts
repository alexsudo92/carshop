"use server";

import { redirect } from "next/navigation";
import { clearAuthCookie, setAuthCookie } from "@/lib/auth";
import { validateCredentials } from "@/lib/store";

export async function loginAction(formData: FormData): Promise<void> {
  const username = String(formData.get("username") ?? "");
  const password = String(formData.get("password") ?? "");

  if (!validateCredentials(username, password)) {
    redirect("/login?error=1");
  }

  await setAuthCookie();
  redirect("/catalog");
}

export async function logoutAction(): Promise<void> {
  await clearAuthCookie();
  redirect("/login");
}
