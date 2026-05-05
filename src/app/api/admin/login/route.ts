import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const password = String(body.password ?? "");

  if (!process.env.ADMIN_PASSWORD) {
    return NextResponse.json(
      { error: "Falta ADMIN_PASSWORD en el entorno" },
      { status: 500 }
    );
  }

  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json(
      { error: "Contraseña incorrecta" },
      { status: 401 }
    );
  }

  const response = NextResponse.json({ ok: true });

  response.cookies.set("alex_admin", "true", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}