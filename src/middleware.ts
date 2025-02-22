import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const refreshToken = req.cookies.get("token");

  const publicPaths = ["/login"];

  const isProtectedPage = !publicPaths.includes(req.nextUrl.pathname);

  if ((isProtectedPage || req.nextUrl.pathname === "/") && !refreshToken) {
    const res = NextResponse.redirect(new URL("/login", req.url));
    resetCookies(res);
    return res;
  } else if (!isProtectedPage && refreshToken) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

function resetCookies(response: NextResponse) {
  response.cookies.set("token", "", { maxAge: -1 });
}

export const config = {
  matcher: ["/((?!api|_next|static|.*\\..*|favicon.ico).*)"],
};
