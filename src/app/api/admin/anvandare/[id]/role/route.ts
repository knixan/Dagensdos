import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/server-auth";

type Role = "admin" | "editor" | "subscriber" | "user";

function isValidRole(value: string): value is Role {
  return ["admin", "editor", "subscriber", "user"].includes(value);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await requireAdmin();

  const { id } = await params;
  let body: Record<string, unknown> = {};
  try {
    // parse body if present
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    body = {};
  }

  const roleInput =
    typeof body?.role === "string" ? body.role.toLowerCase() : undefined;
  
  if (!roleInput || !isValidRole(roleInput)) {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }

  try {
    const user = await prisma.user.update({
      where: { id },
      data: { role: roleInput },
      select: { id: true, role: true },
    });
    return NextResponse.json({ ok: true, user });
  } catch (error) {
    console.error("Error updating user role:", error);
    return NextResponse.json(
      { error: "Could not update user" },
      { status: 500 }
    );
  }
}
