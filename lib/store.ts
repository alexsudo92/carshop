import fs from "node:fs";
import path from "node:path";
import carsData from "@/data/cars.json";
import type { Car, UserProfile } from "@/lib/types";

const usersPath = path.join(process.cwd(), "data", "users.json");

export function getCars(): Car[] {
  return carsData as Car[];
}

export function getCarById(id: string): Car | undefined {
  return getCars().find((car) => car.id === id);
}

function readUsers(): UserProfile[] {
  const raw = fs.readFileSync(usersPath, "utf-8");
  return JSON.parse(raw) as UserProfile[];
}

function writeUsers(users: UserProfile[]): void {
  fs.writeFileSync(usersPath, JSON.stringify(users, null, 2), "utf-8");
}

export function validateCredentials(username: string, password: string): boolean {
  const user = readUsers().find((item) => item.username === username);
  return Boolean(user && user.password === password);
}

export function getUserByUsername(username: string): UserProfile | undefined {
  return readUsers().find((item) => item.username === username);
}

export function registerUser(payload: Omit<UserProfile, "id">): boolean {
  const users = readUsers();
  if (users.some((item) => item.username === payload.username)) {
    return false;
  }

  users.push({
    id: crypto.randomUUID(),
    ...payload,
  });

  writeUsers(users);
  return true;
}

export function updateUser(username: string, payload: Omit<UserProfile, "id" | "username">): void {
  const users = readUsers();
  const index = users.findIndex((item) => item.username === username);

  if (index === -1) {
    return;
  }

  users[index] = {
    ...users[index],
    ...payload,
  };

  writeUsers(users);
}
