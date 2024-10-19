import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

export async function middleware(req) {
  //console.log('Middleware:', req);
  const tokenCookie = cookies(req).get("token");
  const { pathname } = req.nextUrl;

  // Si no está autenticado, redirigir al login

  console.log("Token:", tokenCookie);
  if (!tokenCookie) {
    if (
      pathname !== "/auth/login" &&
      pathname !== "/api/login" && // Permitir la ruta /api/login
      !pathname.startsWith("/_next/") && // Para cargar archivos estáticos como estilos
      !pathname.startsWith("/favicon.ico") // Icono de la página
    ) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
  } else {
    const token = tokenCookie.value;

    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET)
    );
    const userRole = payload.role;
    console.log("Role:", userRole);

    // Proteger rutas según el rol
    if (pathname.startsWith("/admin") && userRole !== "admin") {
      return NextResponse.redirect(new URL("/restricted", req.url));
    }
    if (pathname.startsWith("/teacher") && userRole !== "teacher") {
      return NextResponse.redirect(new URL("/restricted", req.url));
    }
    if (pathname.startsWith("/students") && userRole !== "student") {
      return NextResponse.redirect(new URL("/restricted", req.url));
    }
    if (pathname.startsWith("/superadmin") && userRole !== "superadmin") {
      return NextResponse.redirect(new URL("/restricted", req.url));
    }

    return NextResponse.next();
  }
}
