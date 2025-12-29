import { redirect } from 'next/navigation';

export default function CreateNewsPage() {
  // Redirect to insights page with create news mode
  redirect('/dashboard/insights?create=news');
}
