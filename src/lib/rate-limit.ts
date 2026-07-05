import { prisma } from "@/lib/prisma";

type RateLimitOptions = {
  limit: number;
  windowMs: number;
};

// Not atomic (read-then-write), but collisions are harmless here: worst case a
// couple of extra requests slip through a shared window, which is acceptable
// for this scale of traffic.
export async function checkRateLimit(
  key: string,
  { limit, windowMs }: RateLimitOptions,
): Promise<boolean> {
  const now = new Date();
  const existing = await prisma.actionRateLimit.findUnique({ where: { key } });

  if (!existing || now.getTime() - existing.windowStart.getTime() > windowMs) {
    await prisma.actionRateLimit.upsert({
      where: { key },
      create: { key, count: 1, windowStart: now },
      update: { count: 1, windowStart: now },
    });
    return true;
  }

  if (existing.count >= limit) {
    return false;
  }

  await prisma.actionRateLimit.update({
    where: { key },
    data: { count: { increment: 1 } },
  });
  return true;
}
