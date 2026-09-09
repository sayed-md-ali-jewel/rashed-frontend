import { NextResponse, type NextRequest } from "next/server";

function getOrigin(request: NextRequest): string {
  const forwardedHost = request.headers.get("x-forwarded-host");
  const host = forwardedHost
    ? forwardedHost.split(",")[0].trim()
    : request.headers.get("host") || request.nextUrl.host;
  const forwardedProto = request.headers.get("x-forwarded-proto");
  const proto = forwardedProto
    ? forwardedProto.split(",")[0].trim()
    : request.nextUrl.protocol.replace(":", "") || "https";

  return `${proto}://${host}`;
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

