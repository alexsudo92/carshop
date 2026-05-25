import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const AUTH_COOKIE = "carshop_auth";

export function middleware(request: NextRequest) {
  const isAuth = request.cookies.get(AUTH_COOKIE)?.value === "1";
  const isLoginPage = request.nextUrl.pathname === "/login";

  if (!isAuth && !isLoginPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isAuth && isLoginPage) {
    return NextResponse.redirect(new URL("/catalog", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/catalog/:path*", "/car/:path*", "/checkout/:path*", "/about", "/support", "/login"],
};
