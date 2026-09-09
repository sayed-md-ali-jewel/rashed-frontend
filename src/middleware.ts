import { NextResponse, type NextRequest } from "next/server";

function getOrigin(request: NextRequest): string {
  // 1. Check X-Forwarded-Host from reverse proxies (e.g. Nginx, Cloudflare, cPanel)
  const forwardedHost = request.headers.get("x-forwarded-host");
  if (forwardedHost) {
    const host = forwardedHost.split(",")[0].trim();
    if (host && !host.includes("localhost") && !host.includes("127.0.0.1")) {
      const forwardedProto = request.headers.get("x-forwarded-proto") || "https";
      const proto = forwardedProto.split(",")[0].trim();
      return `${proto}://${host}`;
    }
  }

  // 2. Check Host header if it contains a real domain
  const host = request.headers.get("host");
  if (host && !host.includes("localhost") && !host.includes("127.0.0.1")) {
    const forwardedProto = request.headers.get("x-forwarded-proto") || "https";
    const proto = forwardedProto.split(",")[0].trim();
    return `${proto}://${host}`;
  }

  // 3. Check Referer header if available
  const referer = request.headers.get("referer");
  if (referer) {
    try {
      const refUrl = new URL(referer);
      if (
        refUrl.hostname &&
        !refUrl.hostname.includes("localhost") &&
        !refUrl.hostname.includes("127.0.0.1")
      ) {
        return `${refUrl.protocol}//${refUrl.host}`;
      }
    } catch {
      // Ignore URL parsing errors
    }
  }

  // 4. Explicit environment variable if configured with a real domain
  const envUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.SITE_URL;
  if (envUrl && !envUrl.includes("localhost") && !envUrl.includes("127.0.0.1")) {
    return envUrl.replace(/\/$/, "");
  }

  // 5. Development mode: ONLY allow localhost when explicitly running local dev
  if (process.env.NODE_ENV === "development") {
    const devHost = host || "localhost:3000";
    return `http://${devHost}`;
  }

  // 6. In all other scenarios (production, cPanel, PM2, Passenger, Nginx proxy), ALWAYS return the production domain
  return "https://drrashed.bd";
}

function createRedirect(request: NextRequest, targetPath: string, nextParam?: string) {
  const origin = getOrigin(request);
  const redirectUrl = new URL(targetPath, origin);
  if (nextParam) {
    redirectUrl.searchParams.set("next", nextParam);
  }
  return NextResponse.redirect(redirectUrl);
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAdminRoute = pathname.startsWith("/admin");
  const isAdminApiRoute = pathname.startsWith("/api/admin");
  const isAdminLogin = pathname === "/admin/login";
  const isPatientRoute = pathname.startsWith("/patient");
  const isPatientLogin = pathname === "/patient/login";

  if (isAdminRoute || isAdminApiRoute) {
    const hasAdminSession = request.cookies.get("admin_session")?.value === "active";

    if (isAdminApiRoute && !hasAdminSession) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!hasAdminSession && !isAdminLogin) {
      return createRedirect(request, "/admin/login", pathname);
    }

    if (hasAdminSession && isAdminLogin) {
      return createRedirect(request, "/admin");
    }
  }

  if (isPatientRoute) {
    const hasPatientSession = Boolean(request.cookies.get("patient_session")?.value);

    if (!hasPatientSession && !isPatientLogin) {
      return createRedirect(request, "/patient/login", pathname);
    }

    if (hasPatientSession && isPatientLogin) {
      return createRedirect(request, "/patient");
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*", "/patient/:path*"]
};

