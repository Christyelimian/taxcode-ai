import { redirect } from 'next/navigation';

export default function CreateInsightPage() {
  // Redirect to insights page with create mode
  redirect('/dashboard/insights?create=insight');
}
