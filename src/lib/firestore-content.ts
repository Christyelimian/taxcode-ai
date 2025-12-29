import { getFirebaseAdmin } from './firebase-server';
import * as admin from 'firebase-admin';

// Types for insights and news
export interface Insight {
  id: string;
  title: string;
  slug: string;
  category: string;
  summary: string;
  body: string;
  tags: string[];
  image?: string;
  publishedAt?: Date;
  isPublished: boolean;
  isFeatured: boolean;
  downloads?: any;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface News {
  id: string;
  title: string;
  slug: string;
  type: string;
  summary: string;
  body: string;
  image?: string;
  externalUrl?: string;
  publishedAt?: Date;
  isPublished: boolean;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

class FirestoreContentService {
  private db: Firestore | null;

  constructor() {
    try {
      const firebaseResult = getFirebaseAdmin();
      console.log('Firebase admin result:', {
        hasApp: !!firebaseResult.app,
        hasAuth: !!firebaseResult.auth,
        hasDb: !!firebaseResult.db,
        dbType: firebaseResult.db ? typeof firebaseResult.db : 'undefined'
      });

      this.db = firebaseResult.db || null;

      if (!this.db) {
        console.warn('Firestore database not available - Firebase credentials may not be configured');
      } else {
        console.log('Firestore database initialized successfully');
      }
    } catch (error) {
      console.error('Firestore initialization error:', error);
      this.db = null;
    }
  }

  // Insights methods
  async getInsights(options: {
    includeUnpublished?: boolean;
    featured?: boolean;
    limit?: number;
    startAfter?: QueryDocumentSnapshot<DocumentData>;
  } = {}): Promise<{ insights: Insight[]; hasMore: boolean; lastDoc?: QueryDocumentSnapshot<DocumentData> }> {
    if (!this.db) {
      console.warn('Firestore not available, returning empty insights');
      return { insights: [], hasMore: false };
    }

    const { includeUnpublished = false, featured = false, limit: limitCount = 20, startAfter: startAfterDoc } = options;

    // Get all insights first, then filter and sort in memory to avoid composite index requirements
    const snapshot = await this.db.collection('insights').get();
    let allInsights = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.() || new Date(doc.data().createdAt),
      updatedAt: doc.data().updatedAt?.toDate?.() || new Date(doc.data().updatedAt),
      publishedAt: doc.data().publishedAt?.toDate?.() || doc.data().publishedAt,
    })) as Insight[];

    // Apply filters in memory
    let filteredInsights = allInsights;

    if (!includeUnpublished) {
      filteredInsights = filteredInsights.filter(insight => insight.isPublished === true);
    }

    if (featured) {
      filteredInsights = filteredInsights.filter(insight => insight.isFeatured === true);
    }

    // Sort by createdAt desc
    filteredInsights.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    // Handle pagination
    const startIndex = startAfterDoc ? allInsights.findIndex(doc => doc.id === startAfterDoc.id) + 1 : 0;
    const endIndex = startIndex + limitCount + 1; // +1 to check if there are more
    const paginatedInsights = filteredInsights.slice(startIndex, endIndex);

    const hasMore = paginatedInsights.length > limitCount;
    const insights = paginatedInsights.slice(0, limitCount);

    // Create a mock lastDoc for pagination (simplified approach)
    const lastDoc = insights.length > 0 ? { id: insights[insights.length - 1].id } as any : undefined;

    return { insights, hasMore, lastDoc };
  }

  async getInsightById(id: string): Promise<Insight | null> {
    if (!this.db) {
      console.warn('Firestore not available, cannot get insight by ID');
      return null;
    }

    const docRef = this.db.collection('insights').doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return null;
    }

    const data = docSnap.data();
    return {
      id: docSnap.id,
      ...data,
      createdAt: data?.createdAt?.toDate?.() || new Date(data?.createdAt),
      updatedAt: data?.updatedAt?.toDate?.() || new Date(data?.updatedAt),
      publishedAt: data?.publishedAt?.toDate?.() || data?.publishedAt,
    } as Insight;
  }

  async getInsightBySlug(slug: string): Promise<Insight | null> {
    if (!this.db) {
      console.warn('Firestore not available, cannot get insight by slug');
      return null;
    }

    const snapshot = await this.db.collection('insights').where('slug', '==', slug).get();
    if (snapshot.empty) {
      return null;
    }

    const doc = snapshot.docs[0];
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: data?.createdAt?.toDate?.() || new Date(data?.createdAt),
      updatedAt: data?.updatedAt?.toDate?.() || new Date(data?.updatedAt),
      publishedAt: data?.publishedAt?.toDate?.() || data?.publishedAt,
    } as Insight;
  }

  async createInsight(insightData: Omit<Insight, 'id' | 'createdAt' | 'updatedAt' | 'viewCount'>): Promise<Insight> {
    if (!this.db) {
      throw new Error('Firestore not available - Firebase credentials may not be configured');
    }

    try {
      const now = new Date();
      const data = {
        ...insightData,
        viewCount: 0,
        createdAt: now,
        updatedAt: now,
      };

      console.log('Creating insight with data:', data);
      console.log('DB object type:', typeof this.db);

      const docRef = await this.db.collection('insights').add(data);
      console.log('Created insight with ID:', docRef.id);

      return {
        id: docRef.id,
        ...data,
      };
    } catch (error) {
      console.error('Error creating insight:', error);
      console.error('Error stack:', error?.stack);
      throw error;
    }
  }

  async updateInsight(id: string, updates: Partial<Omit<Insight, 'id' | 'createdAt'>>): Promise<void> {
    if (!this.db) {
      throw new Error('Firestore not available - Firebase credentials not configured');
    }

    const docRef = this.db.collection('insights').doc(id);
    await docRef.update({
      ...updates,
      updatedAt: new Date(),
    });
  }

  async deleteInsight(id: string): Promise<void> {
    if (!this.db) {
      throw new Error('Firestore not available - Firebase credentials not configured');
    }

    const docRef = this.db.collection('insights').doc(id);
    await docRef.delete();
  }

  async incrementInsightViews(id: string): Promise<void> {
    const docRef = this.db.collection('insights').doc(id);
    const docSnap = await docRef.get();

    if (docSnap.exists()) {
      const currentViews = docSnap.data()?.viewCount || 0;
      await updateDoc(docRef, {
        viewCount: currentViews + 1,
        updatedAt: new Date(),
      });
    }
  }

  // News methods
  async getNews(options: {
    includeUnpublished?: boolean;
    type?: string;
    limit?: number;
    startAfter?: QueryDocumentSnapshot<DocumentData>;
  } = {}): Promise<{ news: News[]; hasMore: boolean; lastDoc?: QueryDocumentSnapshot<DocumentData> }> {
    if (!this.db) {
      console.warn('Firestore not available, returning empty news');
      return { news: [], hasMore: false };
    }

    const { includeUnpublished = false, type, limit: limitCount = 20, startAfter: startAfterDoc } = options;

    // Use simpler query to avoid composite index requirements
    let q = query(
      collection(this.db, 'news'),
      orderBy('createdAt', 'desc')
    );

    // Apply filters
    if (!includeUnpublished) {
      q = query(q, where('isPublished', '==', true));
    }

    if (type) {
      q = query(q, where('type', '==', type));
    }

    if (startAfterDoc) {
      q = query(q, startAfter(startAfterDoc));
    }

    q = query(q, limit(limitCount + 1)); // +1 to check if there are more

    const snapshot = await getDocs(q);
    const docs = snapshot.docs;

    const hasMore = docs.length > limitCount;
    const news = docs.slice(0, limitCount).map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.() || new Date(doc.data().createdAt),
      updatedAt: doc.data().updatedAt?.toDate?.() || new Date(doc.data().updatedAt),
      publishedAt: doc.data().publishedAt?.toDate?.() || doc.data().publishedAt,
    })) as News[];

    const lastDoc = docs.length > 0 ? docs[docs.length - 1] : undefined;

    return { news, hasMore, lastDoc };
  }

  async getNewsById(id: string): Promise<News | null> {
    if (!this.db) {
      console.warn('Firestore not available, cannot get news by ID');
      return null;
    }

    const docRef = this.db.collection('news').doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists()) {
      return null;
    }

    const data = docSnap.data();
    return {
      id: docSnap.id,
      ...data,
      createdAt: data?.createdAt?.toDate?.() || new Date(data?.createdAt),
      updatedAt: data?.updatedAt?.toDate?.() || new Date(data?.updatedAt),
      publishedAt: data?.publishedAt?.toDate?.() || data?.publishedAt,
    } as News;
  }

  async getNewsBySlug(slug: string): Promise<News | null> {
    const q = query(
      collection(this.db, 'news'),
      where('slug', '==', slug)
    );

    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      return null;
    }

    const doc = snapshot.docs[0];
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: data?.createdAt?.toDate?.() || new Date(data?.createdAt),
      updatedAt: data?.updatedAt?.toDate?.() || new Date(data?.updatedAt),
      publishedAt: data?.publishedAt?.toDate?.() || data?.publishedAt,
    } as News;
  }

  async createNews(newsData: Omit<News, 'id' | 'createdAt' | 'updatedAt' | 'viewCount'>): Promise<News> {
    if (!this.db) {
      throw new Error('Firestore not available - Firebase credentials not configured');
    }

    const now = new Date();
    const data = {
      ...newsData,
      viewCount: 0,
      createdAt: now,
      updatedAt: now,
    };

    const docRef = await this.db.collection('news').add(data);
    return {
      id: docRef.id,
      ...data,
    };
  }

  async updateNews(id: string, updates: Partial<Omit<News, 'id' | 'createdAt'>>): Promise<void> {
    if (!this.db) {
      throw new Error('Firestore not available - Firebase credentials not configured');
    }

    const docRef = this.db.collection('news').doc(id);
    await docRef.update({
      ...updates,
      updatedAt: new Date(),
    });
  }

  async deleteNews(id: string): Promise<void> {
    if (!this.db) {
      throw new Error('Firestore not available - Firebase credentials not configured');
    }

    const docRef = this.db.collection('news').doc(id);
    await docRef.delete();
  }

  async incrementNewsViews(id: string): Promise<void> {
    const docRef = this.db.collection('news').doc(id);
    const docSnap = await docRef.get();

    if (docSnap.exists()) {
      const currentViews = docSnap.data()?.viewCount || 0;
      await updateDoc(docRef, {
        viewCount: currentViews + 1,
        updatedAt: new Date(),
      });
    }
  }
}

// Export singleton instance
export const firestoreContent = new FirestoreContentService();
