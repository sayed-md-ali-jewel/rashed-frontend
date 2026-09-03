import { NextResponse, type NextRequest } from "next/server";

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
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }

    if (hasAdminSession && isAdminLogin) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin";
      return NextResponse.redirect(url);
    }
  }

  if (isPatientRoute) {
    const hasPatientSession = Boolean(request.cookies.get("patient_session")?.value);

    if (!hasPatientSession && !isPatientLogin) {
      const url = request.nextUrl.clone();
      url.pathname = "/patient/login";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }

    if (hasPatientSession && isPatientLogin) {
      const url = request.nextUrl.clone();
      url.pathname = "/patient";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*", "/patient/:path*"]
};
