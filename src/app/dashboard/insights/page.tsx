import { getInsights, getNews } from '@/app/actions';
import InsightsClientPage from './insights-client-page';

// Force dynamic rendering to avoid Firestore issues during build
export const dynamic = 'force-dynamic';

export default async function InsightsAdminPage() {
  // Fetch initial data on the server
  let insightsResult;
  let newsResult;
  
  try {
    insightsResult = await getInsights(true); // Include unpublished for admin
    console.log('Insights fetch result:', {
      success: insightsResult.success,
      count: insightsResult.data?.length || 0,
      error: insightsResult.error,
    });
  } catch (error: any) {
    console.error('Error fetching insights:', error);
    insightsResult = { success: false, error: error.message || 'Failed to fetch insights', data: [] };
  }
  
  try {
    newsResult = await getNews(true); // Include unpublished for admin
    console.log('News fetch result:', {
      success: newsResult.success,
      count: newsResult.data?.length || 0,
      error: newsResult.error,
    });
  } catch (error: any) {
    console.error('Error fetching news:', error);
    newsResult = { success: false, error: error.message || 'Failed to fetch news', data: [] };
  }

  return (
    <InsightsClientPage
      initialInsights={insightsResult.success ? insightsResult.data : []}
      initialNews={newsResult.success ? newsResult.data : []}
      initialInsightsError={insightsResult.error}
      initialNewsError={newsResult.error}
    />
  );
}

