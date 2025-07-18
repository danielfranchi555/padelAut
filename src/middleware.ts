import { auth } from "../auth"; // tu archivo auth.ts o auth.config.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicRoutes = ["/", "/login", "/register"];

export async function middleware(request: NextRequest) {
  const session = await auth(); // <- obtiene el usuario autenticado

  const isLoggedIn = !!session?.user;
  const { pathname } = request.nextUrl;

  if (!publicRoutes.includes(pathname) && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|login|register).*)"],
};
