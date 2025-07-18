import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { NextResponse } from "next/server";

export const { auth: middleware } = NextAuth(authConfig);

const publicRoutes = ["/", "/login", "/register"];

export default middleware((req) => {
  const { nextUrl, auth } = req;
  const isloggedIn = !!auth?.user;

  console.log({ isloggedIn });

  if (!publicRoutes.includes(nextUrl.pathname) && !isloggedIn) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
