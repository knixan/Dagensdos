import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session || session.user?.role !== 'admin' && session.user?.role !== 'editor') {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const id = body?.id;
    if (!id || typeof id !== 'string') {
      return NextResponse.json({ ok: false, error: 'Invalid id' }, { status: 400 });
    }

    await prisma.article.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Failed to delete article', err);
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
