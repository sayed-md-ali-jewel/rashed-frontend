import { NextResponse, type NextRequest } from "next/server";

function getOrigin(request: NextRequest): string {
  // 1. If explicit NEXT_PUBLIC_SITE_URL or NEXT_PUBLIC_APP_URL is configured and not localhost, use it
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL;
  if (envUrl && !envUrl.includes("localhost") && !envUrl.includes("127.0.0.1")) {
    return envUrl.replace(/\/$/, "");
  }

  // 2. Check X-Forwarded-Host from reverse proxies
  const forwardedHost = request.headers.get("x-forwarded-host");
  if (forwardedHost && !forwardedHost.includes("localhost") && !forwardedHost.includes("127.0.0.1")) {
    const host = forwardedHost.split(",")[0].trim();
    const forwardedProto = request.headers.get("x-forwarded-proto") || "https";
    const proto = forwardedProto.split(",")[0].trim();
    return `${proto}://${host}`;
  }

  // 3. Check Host header
  const host = request.headers.get("host");
  if (host && !host.includes("localhost") && !host.includes("127.0.0.1")) {
    const forwardedProto = request.headers.get("x-forwarded-proto") || "https";
    const proto = forwardedProto.split(",")[0].trim();
    return `${proto}://${host}`;
  }

  // 4. If in production environment, default base URL to https://drrashed.bd
  if (process.env.NODE_ENV === "production") {
    return "https://drrashed.bd";
  }

  // 5. Local development fallback
  const proto = request.nextUrl.protocol.replace(":", "") || "http";
  return `${proto}://${request.nextUrl.host || "localhost:3000"}`;
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

