"use server";

import { redirect } from "next/navigation";
import { clearAuthCookie, getCurrentUsername, setAuthCookie } from "@/lib/auth";
import { getUserByUsername, registerUser, updateUser, validateCredentials } from "@/lib/store";

export async function loginAction(formData: FormData): Promise<void> {
  const username = String(formData.get("username") ?? "");
  const password = String(formData.get("password") ?? "");

  if (!validateCredentials(username, password)) {
    redirect("/login?error=1");
  }

  await setAuthCookie(username);
  redirect("/catalog");
}

export async function registerAction(formData: FormData): Promise<void> {
  const username = String(formData.get("username") ?? "").trim();
  const fullName = String(formData.get("fullName") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const password = String(formData.get("password") ?? "").trim();
  const birthDate = String(formData.get("birthDate") ?? "").trim();

  const ok = registerUser({ username, fullName, phone, password, birthDate, paymentMethods: [] });
  if (!ok) {
    redirect("/register?error=exists");
  }

  await setAuthCookie(username);
  redirect("/profile?success=registered");
}

export async function updateProfileAction(formData: FormData): Promise<void> {
  const currentUsername = await getCurrentUsername();
  if (!currentUsername) {
    redirect("/login");
  }

  const fullName = String(formData.get("fullName") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const password = String(formData.get("password") ?? "").trim();
  const birthDate = String(formData.get("birthDate") ?? "").trim();
  const paymentMethods = String(formData.get("paymentMethods") ?? "")
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);

  updateUser(currentUsername, { fullName, phone, password, birthDate, paymentMethods });
  redirect("/profile?success=1");
}

export async function checkoutAction(formData: FormData): Promise<void> {
  const currentUsername = await getCurrentUsername();
  if (!currentUsername) {
    redirect("/login");
  }

  const user = getUserByUsername(currentUsername);
  if (!user) {
    redirect("/profile");
  }

  const selectedPayment = String(formData.get("paymentMethod") ?? "");
  if (selectedPayment && !user.paymentMethods.includes(selectedPayment)) {
    redirect("/checkout?error=payment");
  }

  redirect("/checkout?success=1");
}

export async function logoutAction(): Promise<void> {
  await clearAuthCookie();
  redirect("/login");
}
