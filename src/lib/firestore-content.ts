import { getFirebaseAdmin } from './firebase-server';
import {
  type QueryDocumentSnapshot,
  type DocumentData,
  query,
  collection,
  where,
  orderBy,
  limit,
  startAfter,
  getDocs,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc
} from 'firebase-admin/firestore';

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
  private db: any;

  constructor() {
    try {
      const { db } = getFirebaseAdmin();
      this.db = db;
    } catch (error) {
      console.warn('Firestore not available during build/initialization:', error);
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

    // Use simpler query to avoid composite index requirements
    let queryRef = query(
      collection(this.db, 'insights'),
      orderBy('createdAt', 'desc')
    );

    // Apply filters
    if (!includeUnpublished) {
      queryRef = query(queryRef, where('isPublished', '==', true));
    }

    if (featured) {
      queryRef = query(queryRef, where('isFeatured', '==', true));
    }

    if (startAfterDoc) {
      queryRef = query(queryRef, startAfter(startAfterDoc));
    }

    queryRef = query(queryRef, limit(limitCount + 1)); // +1 to check if there are more

    const snapshot = await getDocs(queryRef);
    const docs = snapshot.docs;

    const hasMore = docs.length > limitCount;
    const insights = docs.slice(0, limitCount).map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.() || new Date(doc.data().createdAt),
      updatedAt: doc.data().updatedAt?.toDate?.() || new Date(doc.data().updatedAt),
      publishedAt: doc.data().publishedAt?.toDate?.() || doc.data().publishedAt,
    })) as Insight[];

    const lastDoc = docs.length > 0 ? docs[docs.length - 1] : undefined;

    return { insights, hasMore, lastDoc };
  }

  async getInsightById(id: string): Promise<Insight | null> {
    if (!this.db) {
      console.warn('Firestore not available, cannot get insight by ID');
      return null;
    }

    const docRef = doc(this.db, 'insights', id);
    const docSnap = await getDoc(docRef);

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
    } as Insight;
  }

  async getInsightBySlug(slug: string): Promise<Insight | null> {
    if (!this.db) {
      console.warn('Firestore not available, cannot get insight by slug');
      return null;
    }

    const q = query(
      collection(this.db, 'insights'),
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
    } as Insight;
  }

  async createInsight(insightData: Omit<Insight, 'id' | 'createdAt' | 'updatedAt' | 'viewCount'>): Promise<Insight> {
    const now = new Date();
    const data = {
      ...insightData,
      viewCount: 0,
      createdAt: now,
      updatedAt: now,
    };

    const docRef = await this.db.collection('insights').add(data);
    return {
      id: docRef.id,
      ...data,
    };
  }

  async updateInsight(id: string, updates: Partial<Omit<Insight, 'id' | 'createdAt'>>): Promise<void> {
    const docRef = this.db.doc(`insights/${id}`);
    await docRef.update({
      ...updates,
      updatedAt: new Date(),
    });
  }

  async deleteInsight(id: string): Promise<void> {
    const docRef = this.db.doc(`insights/${id}`);
    await docRef.delete();
  }

  async incrementInsightViews(id: string): Promise<void> {
    const docRef = doc(this.db, 'insights', id);
    const docSnap = await getDoc(docRef);

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
    const docRef = doc(this.db, 'news', id);
    const docSnap = await getDoc(docRef);

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
    const now = new Date();
    const data = {
      ...newsData,
      viewCount: 0,
      createdAt: now,
      updatedAt: now,
    };

    const docRef = await addDoc(collection(this.db, 'news'), data);
    return {
      id: docRef.id,
      ...data,
    };
  }

  async updateNews(id: string, updates: Partial<Omit<News, 'id' | 'createdAt'>>): Promise<void> {
    const docRef = doc(this.db, 'news', id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date(),
    });
  }

  async deleteNews(id: string): Promise<void> {
    const docRef = doc(this.db, 'news', id);
    await deleteDoc(docRef);
  }

  async incrementNewsViews(id: string): Promise<void> {
    const docRef = doc(this.db, 'news', id);
    const docSnap = await getDoc(docRef);

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
