import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import AdminForm from './admin-form';

const ADMIN_EMAILS = [
  'tashuaryan61@gmail.com',
  'pk31003510@gmail.com',
];

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !ADMIN_EMAILS.includes(user.email ?? '')) {
    redirect('/');
  }

  return <AdminForm />;
}