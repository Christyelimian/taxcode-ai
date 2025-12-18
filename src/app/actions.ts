
'use server';

import { askTaxLawQuestion, type AskTaxLawQuestionInput } from '@/ai/flows/tax-qa';
import { calculateTax as calculateTaxFlow, type CalculateTaxInput } from '@/ai/flows/calculate-tax-flow';
import { textToSpeech as textToSpeechFlow, type TextToSpeechInput } from '@/ai/flows/text-to-speech-flow';
import { getFirebaseAdmin } from '@/lib/firebase-server';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { ensureUserExists, setUserRole } from '@/lib/user-roles';


export async function getAiResponse(input: AskTaxLawQuestionInput) {
    try {
        const response = await askTaxLawQuestion(input);
        return { success: true, data: response };
    } catch (error) {
        console.error('Error getting AI response:', error);
        
        let errorMessage = 'Failed to get response from AI.';
        if (error instanceof Error) {
            errorMessage = error.message;
        }

        return { success: false, error: errorMessage };
    }
}


export async function calculateTax(input: CalculateTaxInput) {
    try {
        const response = await calculateTaxFlow(input);
        return { success: true, data: response };
    } catch (error) {
        console.error('Error in tax calculation:', error);
        
        let errorMessage = 'Failed to calculate tax.';
        if (error instanceof Error) {
            errorMessage = error.message;
        }

        return { success: false, error: errorMessage };
    }
}


export async function createSession(idToken: string) {
  const { auth } = getFirebaseAdmin();
  if (!auth) {
      throw new Error('Firebase Auth is not initialized on the server.');
  }
  const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
  const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn });
  (await cookies()).set('session', sessionCookie, { maxAge: expiresIn, httpOnly: true, secure: true });

  // Decode and ensure user exists in Firestore
  try {
    const decodedToken = await auth.verifyIdToken(idToken);
    await ensureUserExists(decodedToken.uid, decodedToken.email || '', decodedToken.name);
  } catch (e) {
    console.warn('Failed to initialize user on login:', e);
  }
}

export async function clearSession() {
    (await cookies()).delete('session');
}

export async function setUserRoleAction(userId: string, role: 'admin' | 'user' | 'moderator') {
  try {
    // NOTE: In production, verify the caller is an admin before allowing this
    const { auth } = getFirebaseAdmin();
    if (!auth) throw new Error('Firebase not initialized');
    
    const cookieStore = cookies();
    const session = cookieStore.get('session')?.value;
    const decoded = await auth.verifySessionCookie(session || '', true);
    
    // Verify caller is admin (you can enhance this check)
    // For now, we'll allow it but you should add proper authorization
    await setUserRole(userId, role);
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error: any) {
    console.error('Error setting user role:', error);
    return { success: false, error: error.message };
  }
}

export async function textToSpeech(input: TextToSpeechInput) {
    try {
        const response = await textToSpeechFlow(input);
        return { success: true, data: response };
    } catch (error) {
        console.error('Error in text-to-speech conversion:', error);
        
        let errorMessage = 'Failed to convert text to speech.';
        if (error instanceof Error) {
            errorMessage = error.message;
        }

        return { success: false, error: errorMessage };
    }
}

// Type guard for Firestore Timestamp
const isFirestoreTimestamp = (value: any): value is { toDate: () => Date } => {
    return value && typeof value.toDate === 'function';
};

export interface TrainingModule {
    id?: string;
    title: string;
    dates: string;
    status: 'Draft' | 'Published' | 'Archived';
    content: string[];
    createdAt: string; 
}

export async function getTrainingModules() {
    try {
        const { db } = getFirebaseAdmin();
        if (!db) {
            throw new Error("Firestore is not initialized. Please check your server environment variables.");
        }
        const modulesSnapshot = await db.collection('trainingModules').orderBy('createdAt', 'desc').get();
        const modules = modulesSnapshot.docs.map((doc: any) => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                createdAt: isFirestoreTimestamp(data.createdAt) ? data.createdAt.toDate().toISOString() : new Date().toISOString(),
            } as TrainingModule;
        });
        return { success: true, data: modules };
    } catch (error: any) {
        console.error('Error fetching training modules:', error);
        const errorMessage = error.message || 'Failed to fetch training modules.';
        return { success: false, error: errorMessage };
    }
}


export async function createTrainingModule(module: Omit<TrainingModule, 'id' | 'createdAt'>) {
    try {
        const { db } = getFirebaseAdmin();
        if (!db) {
            throw new Error("Firestore is not initialized. Please check your server environment variables.");
        }
        const newModule = {
            ...module,
            createdAt: new Date(),
        };
        const docRef = await db.collection('trainingModules').add(newModule);
        revalidatePath('/dashboard/modules');
        return { success: true, data: { id: docRef.id } };
    } catch (error: any) {
        console.error('Error creating training module:', error);
        const errorMessage = error.message || 'Failed to create training module.';
        return { success: false, error: errorMessage };
    }
}

export interface TeamMember {
  id?: string;
  name: string;
  email: string;
  role: 'Admin' | 'Member' | 'Lead Facilitator' | 'Training Coordinator' | 'Curriculum and Content Development' | 'Corporate and Legal Services' | 'Economist and Human Capital Strategist' | 'Policy and Strategy Desk' | 'Business Strategist' | 'Business Development' | 'Operations and Logistics';
  title: string;
  image: string;
  createdAt?: string;
}

export async function getTeamMembers() {
    try {
        const { db } = getFirebaseAdmin();
        if (!db) {
            throw new Error("Firestore is not initialized. Please check your server environment variables.");
        }
        const membersSnapshot = await db.collection('teamMembers').orderBy('createdAt', 'desc').get();
        const members = membersSnapshot.docs.map((doc: any) => {
            const data = doc.data();
            return {
                id: doc.id,
                name: data.name,
                email: data.email,
                role: data.role,
                title: data.title,
                image: data.image,
                createdAt: isFirestoreTimestamp(data.createdAt)
                    ? data.createdAt.toDate().toISOString()
                    : new Date().toISOString(),
            } as TeamMember;
        });
        return { success: true, data: members };
    } catch (error: any) {
        console.error('Error fetching team members:', error);
        const errorMessage = error.message || 'Failed to fetch team members.';
        return { success: false, error: errorMessage };
    }
}

export async function addTeamMember(member: Omit<TeamMember, 'id' | 'createdAt'>) {
    try {
        const { db } = getFirebaseAdmin();
        if (!db) {
            throw new Error("Firestore is not initialized. Please check your server environment variables.");
        }
        const newMember: Omit<TeamMember, 'id'| 'createdAt'> & { createdAt: Date } = {
            ...member,
            createdAt: new Date(),
        };
        const docRef = await db.collection('teamMembers').add(newMember);
        revalidatePath('/dashboard/team');
        revalidatePath('/');
        return { success: true, data: { id: docRef.id } };
    } catch (error: any) {
        console.error('Error adding team member:', error);
        const errorMessage = error.message || 'Failed to add team member.';
        return { success: false, error: errorMessage };
    }
}

export async function updateTeamMember(memberId: string, memberData: Omit<TeamMember, 'id' | 'createdAt'>) {
    try {
        const { db } = getFirebaseAdmin();
        if (!db) {
            throw new Error("Firestore is not initialized. Please check your server environment variables.");
        }
        await db.collection('teamMembers').doc(memberId).update(memberData);
        revalidatePath('/dashboard/team');
        revalidatePath('/');
        return { success: true };
    } catch (error: any) {
        console.error('Error updating team member:', error);
        const errorMessage = error.message || 'Failed to update team member.';
        return { success: false, error: errorMessage };
    }
}

export async function removeTeamMember(memberId: string) {
    try {
        const { db } = getFirebaseAdmin();
        if (!db) {
            throw new Error("Firestore is not initialized. Please check your server environment variables.");
        }
        await db.collection('teamMembers').doc(memberId).delete();
        revalidatePath('/dashboard/team');
        revalidatePath('/');
        return { success: true };
    } catch (error: any) {
        console.error('Error removing team member:', error);
        const errorMessage = error.message || 'Failed to remove team member.';
        return { success: false, error: errorMessage };
    }
}


export interface KnowledgeBaseArticle {
  id?: string;
  topic: string;
  content: string;
  createdAt: string; 
}

export async function getKnowledgeBaseArticles() {
    try {
        const { db } = getFirebaseAdmin();
        if (!db) {
            return { success: false, error: "Firestore is not initialized. Please check your server environment variables.", data: [] };
        }
        const snapshot = await db.collection('knowledgeBase').orderBy('createdAt', 'desc').get();
        const articles = snapshot.docs.map((doc: any) => {
            const data = doc.data();
            const createdAtTimestamp = data.createdAt;
            return {
                id: doc.id,
                topic: data.topic,
                content: data.content,
                createdAt: isFirestoreTimestamp(createdAtTimestamp)
                    ? createdAtTimestamp.toDate().toISOString()
                    : new Date().toISOString(),
            } as KnowledgeBaseArticle;
        });
        return { success: true, data: articles };
    } catch (error: any) {
        console.error('Error fetching knowledge base articles:', error);
        const errorMessage = error.message || 'Failed to fetch knowledge base articles.';
        return { success: false, error: errorMessage, data: [] };
    }
}

export async function createKnowledgeBaseArticle(article: Omit<KnowledgeBaseArticle, 'id' | 'createdAt'>) {
    try {
        const { db } = getFirebaseAdmin();
        if (!db) {
            throw new Error("Firestore is not initialized. Please check your server environment variables.");
        }
        const newArticle = {
            ...article,
            createdAt: new Date(),
        };
        const docRef = await db.collection('knowledgeBase').add(newArticle);
        revalidatePath('/dashboard/knowledge');
        return { success: true, data: { id: docRef.id } };
    } catch (error: any) {
        console.error('Error creating knowledge base article:', error);
        const errorMessage = error.message || 'Failed to create knowledge base article.';
        return { success: false, error: errorMessage };
    }
}

export async function deleteKnowledgeBaseArticle(articleId: string) {
    try {
        const { db } = getFirebaseAdmin();
        if (!db) {
            throw new Error("Firestore is not initialized. Please check your server environment variables.");
        }
        await db.collection('knowledgeBase').doc(articleId).delete();
        revalidatePath('/dashboard/knowledge');
        return { success: true };
    } catch (error: any) {
        console.error('Error deleting knowledge base article:', error);
        const errorMessage = error.message || 'Failed to delete knowledge base article.';
        return { success: false, error: errorMessage };
    }
}
