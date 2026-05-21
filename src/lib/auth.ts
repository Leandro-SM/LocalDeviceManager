import { SignJWT, jwtVerify, type JWTPayload } from "jose";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

const AUTH_SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET || "troque-este-segredo-em-producao"
);

const COOKIE_NAME = "auth_token";
const DEFAULT_EXPIRATION = "8h";

export type SessionPayload = {
  userId: string;
  username: string;
  name: string | null;
  role: string;
};

/**
 * Gera hash bcrypt para uma senha em texto plano.
 */
export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 10);
}

/**
 * Compara senha em texto plano com hash bcrypt.
 */
export async function comparePassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

/**
 * Assina um token JWT contendo os dados da sessão.
 */
export async function signAuthToken(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload } as unknown as JWTPayload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(DEFAULT_EXPIRATION)
    .sign(AUTH_SECRET);
}

/**
 * Verifica um token JWT e retorna o payload da sessão, ou null se inválido.
 */
export async function verifyAuthToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, AUTH_SECRET);
    return {
      userId: String(payload.userId),
      username: String(payload.username),
      name: (payload.name as string | null) ?? null,
      role: String(payload.role),
    };
  } catch {
    return null;
  }
}

/**
 * Lê o cookie de autenticação no Server Component / Route Handler
 * e retorna a sessão atual, ou null se ausente/inválida.
 */
export async function getSession(): Promise<SessionPayload | null> {
  const token = cookies().get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyAuthToken(token);
}

export const AUTH_COOKIE_NAME = COOKIE_NAME;
