import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/server-auth";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  await requireAdmin();

  const { id } = params;
  let body: Record<string, unknown> = {};
  try {
    // parse body if present
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    body = {};
  }

  const role =
    typeof body?.role === "string" ? (body.role as string) : undefined;
  const allowed = ["ADMIN", "EDITOR", "SUBSCRIBER", "USER"];
  if (!role || !allowed.includes(role)) {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }

  try {
    const user = await prisma.user.update({
      where: { id },
      data: { role },
      select: { id: true, role: true },
    });
    return NextResponse.json({ ok: true, user });
  } catch {
    return NextResponse.json(
      { error: "Could not update user" },
      { status: 500 }
    );
  }
}
