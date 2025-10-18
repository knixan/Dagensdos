import { requireAdmin } from '@/lib/server-auth';
import AdminPageClient from './page.client';

export default async function AdminPage() {
  await requireAdmin();

  return <AdminPageClient />;
}
