// src/proxy.ts
import { NextRequest, NextResponse } from "next/server";
import { getDefaultDashboardRoute, getRouteOwner, isAuthRoute, UserRole } from "./lib/authUtils";
import { jwtUtils } from "./lib/jwtUtils";

const BASE_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api/v1";

async function refreshTokensInMiddleware(refreshToken: string, sessionToken?: string): Promise<{
  accessToken: string;
  refreshToken: string;
  sessionToken: string;
} | null> {
  try {
    const res = await fetch(`${BASE_API_URL}/auth/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `refreshToken=${refreshToken}; better-auth.session_token=${sessionToken || ""}`,
      },
    });

    if (!res.ok) return null;

    const data = await res.json();
    if (!data.data?.accessToken) return null;

    return {
      accessToken: data.data.accessToken,
      refreshToken: data.data.refreshToken || refreshToken,
      sessionToken: data.data.token || sessionToken || "",
    };
  } catch (error) {
    console.error("Error refreshing token in proxy:", error);
    return null;
  }
}

export async function proxy(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl;
    const pathWithQuery = `${pathname}${request.nextUrl.search}`;
    let accessToken = request.cookies.get("accessToken")?.value;
    const refreshToken = request.cookies.get("refreshToken")?.value;
    let sessionToken = request.cookies.get("better-auth.session_token")?.value;

    let refreshedTokens: { accessToken: string; refreshToken: string; sessionToken: string } | null = null;

    // Decode current token if present
    const jwtSecret = process.env.JWT_ACCESS_SECRET as string;
    let decodedAccessToken = accessToken && jwtSecret ? jwtUtils.verifyToken(accessToken, jwtSecret).data : (accessToken ? jwtUtils.decodedToken(accessToken) : null);
    let isValidAccessToken = !!(decodedAccessToken && decodedAccessToken.exp && decodedAccessToken.exp * 1000 > Date.now());

    // Proactive / Reactive Refresh: if accessToken is missing or expired, but refreshToken is present
    if (!isValidAccessToken && refreshToken) {
      refreshedTokens = await refreshTokensInMiddleware(refreshToken, sessionToken);
      if (refreshedTokens) {
        accessToken = refreshedTokens.accessToken;
        sessionToken = refreshedTokens.sessionToken;
        decodedAccessToken = jwtSecret ? jwtUtils.verifyToken(accessToken, jwtSecret).data : jwtUtils.decodedToken(accessToken);
        isValidAccessToken = !!(decodedAccessToken && decodedAccessToken.exp && decodedAccessToken.exp * 1000 > Date.now());
      }
    }

    let userRole: UserRole | null = null;
    if (decodedAccessToken && decodedAccessToken.role) {
      userRole = decodedAccessToken.role as UserRole;
    }

    const routeOwner = getRouteOwner(pathname);
    const isAuth = isAuthRoute(pathname);

    // Helper to attach refreshed cookies to response
    const attachRefreshedCookies = (response: NextResponse) => {
      if (refreshedTokens) {
        const isProd = process.env.NODE_ENV === "production";
        response.cookies.set("accessToken", refreshedTokens.accessToken, {
          httpOnly: true,
          secure: isProd,
          sameSite: isProd ? "none" : "lax",
          path: "/",
          maxAge: 24 * 60 * 60,
        });
        if (refreshedTokens.refreshToken) {
          response.cookies.set("refreshToken", refreshedTokens.refreshToken, {
            httpOnly: true,
            secure: isProd,
            sameSite: isProd ? "none" : "lax",
            path: "/",
            maxAge: 7 * 24 * 60 * 60,
          });
        }
        if (refreshedTokens.sessionToken) {
          response.cookies.set("better-auth.session_token", refreshedTokens.sessionToken, {
            httpOnly: true,
            secure: isProd,
            sameSite: isProd ? "none" : "lax",
            path: "/",
            maxAge: 24 * 60 * 60,
          });
        }
      }
      return response;
    };

    // Rule 1: Logged-in users should not access auth pages
    if (isAuth && isValidAccessToken && pathname !== "/verify-email" && pathname !== "/reset-password") {
      const redirectUrl = new URL(getDefaultDashboardRoute(userRole as UserRole), request.url);
      return attachRefreshedCookies(NextResponse.redirect(redirectUrl));
    }

    // Rule 2: Public route -> allow
    if (routeOwner === null) {
      return attachRefreshedCookies(NextResponse.next());
    }

    // Rule 3: Protected route but user is not authenticated -> redirect to login with redirect param
    if (!accessToken || !isValidAccessToken) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathWithQuery);
      return NextResponse.redirect(loginUrl);
    }

    // Rule 4: Common protected route (e.g. /chat, /video-call)
    if (routeOwner === "COMMON") {
      if ((pathname === "/chat" || pathname.startsWith("/video-call")) && (userRole === "ADMIN" || userRole === "SUPER_ADMIN")) {
        return attachRefreshedCookies(NextResponse.redirect(new URL(getDefaultDashboardRoute(userRole as UserRole), request.url)));
      }
      return attachRefreshedCookies(NextResponse.next());
    }

    // Rule 5: Role-based route authorization
    if (routeOwner === "ADMIN") {
      if (userRole !== "SUPER_ADMIN" && userRole !== "ADMIN") {
        return attachRefreshedCookies(NextResponse.redirect(new URL(getDefaultDashboardRoute(userRole as UserRole), request.url)));
      }
    }

    if (routeOwner === "DOCTOR") {
      if (userRole !== "DOCTOR") {
        return attachRefreshedCookies(NextResponse.redirect(new URL(getDefaultDashboardRoute(userRole as UserRole), request.url)));
      }
    }

    if (routeOwner === "PATIENT") {
      if (userRole !== "PATIENT") {
        return attachRefreshedCookies(NextResponse.redirect(new URL(getDefaultDashboardRoute(userRole as UserRole), request.url)));
      }
    }

    return attachRefreshedCookies(NextResponse.next());
  } catch (error) {
    console.error("Error in proxy handler:", error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.well-known).*)',
  ],
};
