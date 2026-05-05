import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

type RouteParams = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(_request: Request, { params }: RouteParams) {
  const cookieStore = await cookies();
  const isAdmin = cookieStore.get("alex_admin")?.value === "true";

  if (!isAdmin) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { id } = await params;

  if (!id) {
    return NextResponse.json(
      { error: "Falta ID de reserva" },
      { status: 400 }
    );
  }

  const { error } = await supabaseAdmin
    .from("bookings")
    .update({ status: "cancelled" })
    .eq("id", id);

  if (error) {
    console.error("Error cancelando reserva:", error);

    return NextResponse.json(
      { error: "No se pudo eliminar la reserva" },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}