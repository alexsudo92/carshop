import carsData from "@/data/cars.json";
import credentials from "@/data/credentials.json";
import type { Car } from "@/lib/types";

export function getCars(): Car[] {
  return carsData as Car[];
}

export function getCarById(id: string): Car | undefined {
  return getCars().find((car) => car.id === id);
}

export function validateCredentials(username: string, password: string): boolean {
  return username === credentials.username && password === credentials.password;
}
