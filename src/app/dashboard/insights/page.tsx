import { getInsights, getNews } from '@/app/actions';
import InsightsClientPage from './insights-client-page';

export default async function InsightsAdminPage() {
  // Fetch initial data on the server
  const insightsResult = await getInsights(true); // Include unpublished for admin
  const newsResult = await getNews(true); // Include unpublished for admin

  return (
    <InsightsClientPage
      initialInsights={insightsResult.success ? insightsResult.data : []}
      initialNews={newsResult.success ? newsResult.data : []}
      initialInsightsError={insightsResult.error}
      initialNewsError={newsResult.error}
    />
  );
}

