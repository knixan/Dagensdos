import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
// Använd denna hjälpfunktion för att kombinera och optimera CSS-klasser med Tailwind CSS och clsx
// Genom att använda både clsx och tailwind-merge kan vi enkelt hantera villkorliga klasser och undvika dubbletter eller konflikter i Tailwind CSS-klasser.
// Exempel på användning: cn("p-4", isActive && "bg-blue-500", "text-white", "p-4") => "p-4 bg-blue-500 text-white"
