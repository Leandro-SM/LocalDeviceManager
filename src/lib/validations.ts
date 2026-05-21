import { z } from "zod";

// ---------- Auth ----------
export const loginSchema = z.object({
  username: z
    .string()
    .min(3, "Usuário deve ter ao menos 3 caracteres")
    .max(50, "Usuário muito longo"),
  password: z
    .string()
    .min(4, "Senha deve ter ao menos 4 caracteres")
    .max(100, "Senha muito longa"),
});
export type LoginInput = z.infer<typeof loginSchema>;

// ---------- Categoria ----------
export const categorySchema = z.object({
  name: z
    .string()
    .min(2, "Nome deve ter ao menos 2 caracteres")
    .max(50, "Nome muito longo"),
  description: z.string().max(255, "Descrição muito longa").optional().nullable(),
  color: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/, "Cor deve estar no formato #RRGGBB")
    .optional()
    .nullable(),
});
export type CategoryInput = z.infer<typeof categorySchema>;

// ---------- Dispositivo ----------
export const deviceStatusEnum = z.enum([
  "available",
  "in_use",
  "maintenance",
  "retired",
]);
export type DeviceStatus = z.infer<typeof deviceStatusEnum>;

export const deviceSchema = z.object({
  name: z
    .string()
    .min(2, "Nome deve ter ao menos 2 caracteres")
    .max(100, "Nome muito longo"),
  serialNumber: z
    .string()
    .max(100, "Número de série muito longo")
    .optional()
    .nullable(),
  model: z.string().max(100).optional().nullable(),
  manufacturer: z.string().max(100).optional().nullable(),
  status: deviceStatusEnum.default("available"),
  location: z.string().max(150).optional().nullable(),
  notes: z.string().max(1000).optional().nullable(),
  quantity: z
    .number()
    .int("Quantidade deve ser inteira")
    .min(1, "Quantidade mínima é 1")
    .default(1),
  acquiredAt: z
    .union([z.string().datetime(), z.date(), z.null()])
    .optional()
    .nullable(),
  categoryId: z.string().min(1, "Categoria é obrigatória"),
});
export type DeviceInput = z.infer<typeof deviceSchema>;

// ---------- Usuário ----------
export const userRoleEnum = z.enum(["admin", "user"]);
export type UserRole = z.infer<typeof userRoleEnum>;

export const userCreateSchema = z.object({
  username: z
    .string()
    .min(3, "Usuário deve ter ao menos 3 caracteres")
    .max(50, "Usuário muito longo")
    .regex(/^[a-zA-Z0-9_.-]+$/, "Usuário contém caracteres inválidos"),
  name: z.string().max(100).optional().nullable(),
  password: z
    .string()
    .min(4, "Senha deve ter ao menos 4 caracteres")
    .max(100, "Senha muito longa"),
  role: userRoleEnum.default("user"),
});
export type UserCreateInput = z.infer<typeof userCreateSchema>;

export const userUpdateSchema = z.object({
  name: z.string().max(100).optional().nullable(),
  password: z
    .string()
    .min(4, "Senha deve ter ao menos 4 caracteres")
    .max(100, "Senha muito longa")
    .optional(),
  role: userRoleEnum.optional(),
});
export type UserUpdateInput = z.infer<typeof userUpdateSchema>;
