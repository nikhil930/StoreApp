import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function convertToPlainObject<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

export function formatPriceforProduct(value: number): string {
  const [intVal, decVal] = value.toString().split(".");

  return decVal ? `${intVal}.${decVal.padEnd(2, "0")}` : `${intVal}.00`;
}
