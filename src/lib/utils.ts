import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combina classes do Tailwind resolvendo conflitos.
 * Usado por todos os componentes do shadcn/ui.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formata data ISO para pt-BR (dd/mm/aaaa HH:mm).
 */
export function formatDateBR(date: Date | string | null | undefined): string {
  if (!date) return "—";
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

/**
 * Traduz status técnico para rótulo amigável em pt-BR.
 */
export function translateStatus(status: string): string {
  const map: Record<string, string> = {
    available: "Disponível",
    in_use: "Em uso",
    maintenance: "Manutenção",
    retired: "Descartado",
  };
  return map[status] ?? status;
}
