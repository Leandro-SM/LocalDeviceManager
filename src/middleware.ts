import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const AUTH_SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET || "troque-este-segredo-em-producao"
);

// Rotas que exigem autenticação
const PROTECTED_PREFIXES = ["/dashboard", "/devices", "/categories", "/users", "/reports"];

// Rotas públicas (não exigem auth)
const PUBLIC_ROUTES = ["/login", "/api/auth/login", "/api/auth/logout"];

async function isValidToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  try {
    await jwtVerify(token, AUTH_SECRET);
    return true;
  } catch {
    return false;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Permite assets e rotas públicas sem checagem
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    PUBLIC_ROUTES.includes(pathname)
  ) {
    return NextResponse.next();
  }

  const token = req.cookies.get("auth_token")?.value;
  const authenticated = await isValidToken(token);

  const isProtected = PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));

  // Se rota protegida e não autenticado -> /login
  if (isProtected && !authenticated) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Se já autenticado e tentando acessar /login -> /dashboard
  if (pathname === "/login" && authenticated) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Aplica em todas as rotas exceto:
     * - _next/static, _next/image, favicon
     * - arquivos estáticos com extensão
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};
