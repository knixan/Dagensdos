import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from './auth';

/**
 * Ensure the current request has an authenticated admin session.
 * If not authenticated or not an admin, redirect to login page.
 */
export async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session || !session.user || session.user.role !== 'admin') {
    // Redirect to login. Using redirect keeps the check server-side.
    redirect('/logga-in');
  }

  return session;
}

export async function getSession() {
  const session = await auth.api.getSession({ headers: await headers() });
  return session;
}

export async function requireUser() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    redirect('/logga-in');
  }
  return session;
}
