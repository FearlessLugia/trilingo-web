import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatWord(word: string) {
  if (!word) return '';
  return word.replace(/_/g, ' ');
}
