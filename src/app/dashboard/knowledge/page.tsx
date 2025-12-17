
import { getKnowledgeBaseArticles } from '@/app/actions';
import KnowledgeClientPage from './knowledge-client-page';

export default async function KnowledgeBasePage() {
  // Fetch initial data on the server
  const initialDataResult = await getKnowledgeBaseArticles();

  // Pass the fetched data as a prop to the client component
  // This cleanly separates server data fetching from client-side interactivity
  return (
    <KnowledgeClientPage
      initialArticles={initialDataResult.success ? initialDataResult.data : []}
      initialError={initialDataResult.error}
    />
  );
}
