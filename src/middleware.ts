import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest, NextResponse } from "next/server";

const intlMiddleware = createMiddleware(routing);

const protectRoute = ["/user"];
const authRoute = ["/signin", "/signup"];

export default function middleware(request: NextRequest) {
    const pathName = request.nextUrl.pathname;

    const isLogin =
        request.cookies.has("better-auth.session_token") ||
        request.cookies.has("__Secure-better-auth.session_token");

    const isAuthRoute = authRoute.some((route) => pathName.includes(route));
    const isProtectRoute = protectRoute.some((route) => pathName.includes(route));

    if (isLogin && isAuthRoute) {
        return NextResponse.redirect(new URL("/user", request.url));
    }
    if (!isLogin && isProtectRoute) {
        return NextResponse.redirect(new URL("/signin", request.url));
    }
    return intlMiddleware(request);
}

export const config = {
    matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
