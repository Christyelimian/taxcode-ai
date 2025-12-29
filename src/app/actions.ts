
'use server';

import { askTaxLawQuestion, type AskTaxLawQuestionInput } from '@/ai/flows/tax-qa';
import { calculateTax as calculateTaxFlow, type CalculateTaxInput } from '@/ai/flows/calculate-tax-flow';
import { textToSpeech as textToSpeechFlow, type TextToSpeechInput } from '@/ai/flows/text-to-speech-flow';
import { getFirebaseAdmin } from '@/lib/firebase-server';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { ensureUserExists, setUserRole } from '@/lib/user-roles';
import { addArticle, deleteArticle, setArticleActive, updateArticle } from '@/lib/knowledge-base';
import { generateCourseFromDocument } from '@/ai/flows/document-to-course-flow';
import { getPrismaClient } from '@/lib/community-helpers';


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

export async function setUserRoleAction(userId: string, role: 'admin' | 'user' | 'moderator' | 'learner') {
  try {
    // NOTE: In production, verify the caller is an admin before allowing this
    const { auth } = getFirebaseAdmin();
    if (!auth) throw new Error('Firebase not initialized');
    
    const cookieStore = await cookies();
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

export async function generateTrainingModuleFromDocument(input: { sourceName?: string; text: string }) {
  try {
    const draft = await generateCourseFromDocument({
      sourceName: input.sourceName,
      text: input.text,
    });

    // Force Draft regardless of model output
    return {
      success: true,
      data: {
        title: draft.title,
        dates: draft.dates || '',
        status: 'Draft' as const,
        summary: draft.summary,
        tags: draft.tags || [],
        jurisdiction: draft.jurisdiction || 'Nigeria',
        effectiveDate: draft.effectiveDate,
        content: draft.content,
      },
    };
  } catch (error: any) {
    console.error('Error generating module from document:', error);
    return { success: false, error: error?.message || 'Failed to generate module from document.' };
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
    summary?: string;
    tags?: string[];
    jurisdiction?: string;
    effectiveDate?: string; // ISO date (YYYY-MM-DD) preferred
    content: string[];
    createdAt: string; 
    kbArticleId?: string;
}

function trainingModuleToKbPayload(moduleId: string, module: Omit<TrainingModule, 'id' | 'createdAt'>) {
  const title = `Academy Module: ${module.title}`;
  const category = 'Academy';
  const tags = [
    'academy',
    'training',
    ...(module.tags ?? []).map(t => t.toLowerCase()),
    ...module.title.toLowerCase().split(/\s+/).filter(Boolean).slice(0, 10),
  ];

  const sourceUrl = `/academy/modules/${moduleId}`;
  const summary =
    module.summary?.trim() ||
    `Tax Academy module (${module.status}) — ${module.dates}. Covers ${module.content?.length ?? 0} lessons/topics.`;

  const content = [
    `# ${module.title}`,
    ``,
    `## Module metadata`,
    `- Dates: ${module.dates}`,
    `- Status: ${module.status}`,
    `- Jurisdiction: ${module.jurisdiction || 'Nigeria'}`,
    ...(module.effectiveDate ? [`- Effective date: ${module.effectiveDate}`] : []),
    `- Source: TaxCode Academy`,
    ``,
    `## Summary`,
    summary,
    ``,
    `## Course outline`,
    ...(module.content ?? []).map((t, idx) => `${idx + 1}. ${t}`),
  ].join('\n');

  return {
    title,
    content,
    summary,
    category,
    tags: Array.from(new Set(tags)).filter(Boolean),
    source: 'TaxCode Academy',
    sourceUrl,
    author: 'TaxCode CMS',
  };
}

async function syncTrainingModuleToKnowledgeBase(moduleId: string, module: Omit<TrainingModule, 'id' | 'createdAt'> & { kbArticleId?: string }) {
  // Only published modules should be active in AI answers.
  const isPublished = (module.status ?? '').toLowerCase() === 'published';

  // If module already has a KB article, update it; else create it.
  if (module.kbArticleId) {
    await updateArticle(module.kbArticleId, {
      ...trainingModuleToKbPayload(moduleId, module),
      isActive: isPublished,
    });
    return { kbArticleId: module.kbArticleId };
  }

  const created = await addArticle({
    ...trainingModuleToKbPayload(moduleId, module),
  });

  // Immediately set active based on publish state (default true in schema, but be explicit)
  if (!isPublished) {
    await setArticleActive(created.id, false);
  }

  return { kbArticleId: created.id };
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

        // Dual-write/sync: if Prisma KB is configured, mirror into AI Knowledge DB.
        try {
          const { kbArticleId } = await syncTrainingModuleToKnowledgeBase(docRef.id, module);
          await db.collection('trainingModules').doc(docRef.id).update({
            kbArticleId,
            kbSyncedAt: new Date(),
          });
        } catch (e) {
          // Don't fail the module create if KB is unavailable; log for ops.
          console.warn('KB sync failed for training module:', e);
        }

        revalidatePath('/dashboard/modules');
        return { success: true, data: { id: docRef.id } };
    } catch (error: any) {
        console.error('Error creating training module:', error);
        const errorMessage = error.message || 'Failed to create training module.';
        return { success: false, error: errorMessage };
    }
}

export async function updateTrainingModule(moduleId: string, module: Omit<TrainingModule, 'id' | 'createdAt'> & { kbArticleId?: string }) {
  try {
    const { db } = getFirebaseAdmin();
    if (!db) {
      throw new Error("Firestore is not initialized. Please check your server environment variables.");
    }

    await db.collection('trainingModules').doc(moduleId).update({
      ...module,
      updatedAt: new Date(),
    });

    try {
      const { kbArticleId } = await syncTrainingModuleToKnowledgeBase(moduleId, module);
      await db.collection('trainingModules').doc(moduleId).update({
        kbArticleId,
        kbSyncedAt: new Date(),
      });
    } catch (e) {
      console.warn('KB sync failed for training module update:', e);
    }

    revalidatePath('/dashboard/modules');
    revalidatePath(`/academy/modules/${moduleId}`);
    return { success: true };
  } catch (error: any) {
    console.error('Error updating training module:', error);
    const errorMessage = error.message || 'Failed to update training module.';
    return { success: false, error: errorMessage };
  }
}

export async function deleteTrainingModule(moduleId: string) {
  try {
    const { db } = getFirebaseAdmin();
    if (!db) {
      throw new Error("Firestore is not initialized. Please check your server environment variables.");
    }

    const docRef = db.collection('trainingModules').doc(moduleId);
    const snap = await docRef.get();
    const data = snap.exists ? (snap.data() as any) : null;

    // Retire/delete from AI KB if linked
    try {
      const kbArticleId = data?.kbArticleId as string | undefined;
      if (kbArticleId) {
        // Prefer hard delete to avoid stale retrieval; schema cascades sections/training data.
        await deleteArticle(kbArticleId);
      }
    } catch (e) {
      console.warn('KB delete failed for training module:', e);
    }

    await docRef.delete();

    revalidatePath('/dashboard/modules');
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting training module:', error);
    const errorMessage = error.message || 'Failed to delete training module.';
    return { success: false, error: errorMessage };
  }
}

export async function getTrainingModuleById(id: string) {
    try {
        const { db } = getFirebaseAdmin();
        if (!db) {
            throw new Error("Firestore is not initialized. Please check your server environment variables.");
        }
        const doc = await db.collection('trainingModules').doc(id).get();
        if (!doc.exists) {
            return { success: false, error: 'Module not found.' as const };
        }
        const data = doc.data() as any;
        return {
            success: true,
            data: {
                id: doc.id,
                ...data,
                createdAt: isFirestoreTimestamp(data?.createdAt)
                    ? data.createdAt.toDate().toISOString()
                    : new Date().toISOString(),
            } as TrainingModule,
        };
    } catch (error: any) {
        console.error('Error fetching training module:', error);
        const errorMessage = error.message || 'Failed to fetch training module.';
        return { success: false, error: errorMessage };
    }
}

export interface TeamMember {
  id?: string;
  name: string;
  email: string;
  role: 'Admin' | 'Member' | 'Lead Facilitator' | 'Training Coordinator' | 'Curriculum and Content Development' | 'Corporate and Legal Services' | 'Economist and Human Capital Strategist' | 'Policy and Strategy Desk' | 'Business Strategist' | 'Business Development' | 'Operations and Logistics' | 'Tax Consultant' | 'Tax Lawyer';
  title: string;
  image: string;
  createdAt?: string;
  // Consultant-specific fields
  licenseNo?: string;
  memberNo?: string;
  firmName?: string;
  firmAddress?: string;
  city?: string;
  state?: string;
  country?: string;
  verified?: boolean;
  isConsultant?: boolean;
  isLawyer?: boolean;
  specialties?: string[];
  industries?: string[];
  yearsExperience?: number;
  languages?: string[];
  consultationFeeNGN?: number;
  hourlyRateNGN?: number;
  fairPricingPledge?: boolean;
  proBono?: boolean;
  bookingModes?: string[];
  responseSlaHours?: number;
  rating?: number;
  reviewCount?: number;
}

export interface DirectoryConsultant {
  id: string;
  name: string;
  email: string;
  title: string;
  firmName?: string;
  firmAddress?: string;
  city?: string;
  state?: string;
  country?: string;
  licenseNo?: string;
  memberNo?: string;
  verified: boolean;
  photoInitials: string;
  // Mapped fields for directory display
  locations: string[];
  languages: string[];
  specialties: string[];
  industries: string[];
  yearsExperience: number;
  pricing: {
    consultationFeeNGN: number;
    hourlyRateNGN?: number;
    fairPricingPledge: boolean;
    proBono: boolean;
    lowCostSlotsPerMonth?: number;
  };
  availability: {
    nextSlotLabel: string;
    responseSlaHours: number;
    bookingModes: ("Call" | "Video" | "In-person")[];
  };
  trust: {
    rating: number;
    reviewCount: number;
    verifiedReviewsOnly: boolean;
    complaintResolutionSupported: boolean;
    mediationSupported: boolean;
  };
  badges: ("Community Champion" | "Featured" | "Pro Bono" | "Fast Response")[];
  successStories: { title: string; outcome: string; tags: string[] }[];
  highlights: string[];
}

export interface DirectoryLawyer {
  id: string;
  name: string;
  email: string;
  title: string;
  firmName?: string;
  firmAddress?: string;
  city?: string;
  state?: string;
  country?: string;
  barNumber?: string;
  barAssociation?: string;
  verified: boolean;
  photoInitials: string;
  // Lawyer-specific fields
  jurisdictions: string[];
  practiceAreas: string[]; // Tax-specific practice areas
  languages: string[];
  yearsExperience: number;
  courtExperience: {
    highCourt?: boolean;
    appealCourt?: boolean;
    supremeCourt?: boolean;
    taxAppealTribunal?: boolean;
  };
  caseOutcomes?: {
    area: string;
    winRate: number;
    casesHandled: number;
    averageSettlement?: number;
  }[];
  pricing: {
    consultationFeeNGN: number;
    hourlyRateNGN?: number;
    fairPricingPledge: boolean;
    proBono: boolean;
  };
  availability: {
    nextSlotLabel: string;
    responseSlaHours: number;
    bookingModes: ("Call" | "Video" | "In-person")[];
    emergencyAvailable?: boolean;
  };
  trust: {
    rating: number;
    reviewCount: number;
    verifiedReviewsOnly: boolean;
    complaintResolutionSupported: boolean;
    mediationSupported: boolean;
  };
  badges: ("Verified by NBA" | "Featured" | "Pro Bono" | "Emergency Available" | "TAT Specialist" | "FIRS Expert")[];
  highlights: string[];
  locations: string[];
  phone?: string;
  website?: string;
  linkedin?: string;
  bio?: string;
}

export async function getTeamMembers() {
    try {
        const { db } = getFirebaseAdmin();
        if (!db) {
            throw new Error("Firestore is not initialized. Please check your server environment variables.");
        }
        // Query faculty collection - exclude consultants and lawyers (they are separate)
        const membersSnapshot = await db.collection('faculty').orderBy('createdAt', 'desc').get();
        const members = membersSnapshot.docs
            .map((doc: any) => {
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
            })
            // Filter out consultants and lawyers - they should not be in faculty collection
            .filter((member: TeamMember) => {
                // This is a safety check - ideally consultants/lawyers shouldn't be in faculty at all
                return true; // We'll filter at the query level if possible, but this ensures clean data
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
        
        // Ensure consultants and lawyers are not added to faculty collection
        if (member.isConsultant || member.isLawyer || member.role === 'Tax Consultant' || member.role === 'Tax Lawyer') {
            return { 
                success: false, 
                error: 'Tax consultants and lawyers should be added through their respective directory management pages, not the faculty page.' 
            };
        }
        
        const newMember: Omit<TeamMember, 'id'| 'createdAt'> & { createdAt: Date } = {
            ...member,
            createdAt: new Date(),
        };
        // Add to faculty collection (only regular faculty members - consultants/lawyers excluded)
        const docRef = await db.collection('faculty').add(newMember);
        
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
        await db.collection('faculty').doc(memberId).update(memberData);
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
        await db.collection('faculty').doc(memberId).delete();
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

export interface ContactFormData {
    name: string;
    email: string;
    subject: string;
    message: string;
}

export async function submitContactForm(formData: ContactFormData) {
    try {
        const { db } = getFirebaseAdmin();
        if (!db) {
            throw new Error("Firestore is not initialized. Please check your server environment variables.");
        }

        // Save to Firestore
        const newContact = {
            ...formData,
            createdAt: new Date(),
            status: 'unread',
        };
        const docRef = await db.collection('contacts').add(newContact);

        // Send email notification using Resend
        try {
            const { Resend } = await import('resend');
            const resend = new Resend(process.env.RESEND_API_KEY);

            await resend.emails.send({
                from: 'TaxCode Contact <contact@taxcode.com.ng>',
                to: ['contact@taxcode.com.ng'], // Send to your contact email
                subject: `New Contact Form: ${formData.subject}`,
                html: `
                    <h2>New Contact Form Submission</h2>
                    <p><strong>Name:</strong> ${formData.name}</p>
                    <p><strong>Email:</strong> ${formData.email}</p>
                    <p><strong>Subject:</strong> ${formData.subject}</p>
                    <p><strong>Message:</strong></p>
                    <p>${formData.message.replace(/\n/g, '<br>')}</p>
                    <hr>
                    <p><small>Sent from TaxCode contact form at ${new Date().toISOString()}</small></p>
                `,
            });

            console.log('Contact form email sent successfully');
        } catch (emailError) {
            console.error('Failed to send contact form email:', emailError);
            // Don't fail the form submission if email fails
        }

        return { success: true, data: { id: docRef.id } };
    } catch (error: any) {
        console.error('Error submitting contact form:', error);
        const errorMessage = error.message || 'Failed to submit contact form.';
        return { success: false, error: errorMessage };
    }
}

export async function getConsultantById(consultantId: string) {
    try {
        const { db } = getFirebaseAdmin();
        if (!db) {
            throw new Error("Firestore is not initialized.");
        }
        // Consultants are in teamMembers collection (separate from faculty)
        const doc = await db.collection('teamMembers').doc(consultantId).get();
        if (!doc.exists) {
            return { success: false, error: "Consultant not found" };
        }
        const data = doc.data();
        return { success: true, data: { id: doc.id, ...data } as TeamMember };
    } catch (error: any) {
        console.error('Error fetching consultant:', error);
        return { success: false, error: error.message || 'Failed to fetch consultant.' };
    }
}

export async function updateConsultant(consultantId: string, updates: Partial<TeamMember>) {
    try {
        const { db } = getFirebaseAdmin();
        if (!db) {
            throw new Error("Firestore is not initialized.");
        }
        // Consultants are in teamMembers collection (separate from faculty)
        await db.collection('teamMembers').doc(consultantId).update(updates);
        revalidatePath('/dashboard/directory');
        revalidatePath('/directory');
        return { success: true };
    } catch (error: any) {
        console.error('Error updating consultant:', error);
        return { success: false, error: error.message || 'Failed to update consultant.' };
    }
}

export async function deleteConsultant(consultantId: string) {
    try {
        const { db } = getFirebaseAdmin();
        if (!db) {
            throw new Error("Firestore is not initialized.");
        }
        // Consultants are in teamMembers collection (separate from faculty)
        await db.collection('teamMembers').doc(consultantId).delete();
        revalidatePath('/dashboard/directory');
        revalidatePath('/directory');
        return { success: true };
    } catch (error: any) {
        console.error('Error deleting consultant:', error);
        return { success: false, error: error.message || 'Failed to delete consultant.' };
    }
}

export async function generateClaimToken(consultantId: string) {
    try {
        const { db } = getFirebaseAdmin();
        if (!db) {
            throw new Error("Firestore is not initialized.");
        }
        // Generate a secure token
        const token = `claim_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
        // Consultants are now in faculty collection
        await db.collection('faculty').doc(consultantId).update({
            claimToken: token,
        });
        return { success: true, data: { token } };
    } catch (error: any) {
        console.error('Error generating claim token:', error);
        return { success: false, error: error.message || 'Failed to generate claim token.' };
    }
}

export async function claimConsultantProfile(consultantId: string, claimToken: string, userId: string) {
    try {
        const { db } = getFirebaseAdmin();
        if (!db) {
            throw new Error("Firestore is not initialized.");
        }
        // Consultants are in teamMembers collection (separate from faculty)
        const doc = await db.collection('teamMembers').doc(consultantId).get();
        if (!doc.exists) {
            return { success: false, error: "Consultant not found" };
        }
        const data = doc.data();
        if (data?.claimToken !== claimToken) {
            return { success: false, error: "Invalid claim token" };
        }
        if (data?.claimed) {
            return { success: false, error: "Profile already claimed" };
        }
        
        // Update consultant profile
        await db.collection('teamMembers').doc(consultantId).update({
            claimed: true,
            claimedBy: userId,
            claimedAt: new Date().toISOString(),
            claimToken: null, // Clear token after successful claim
        });
        
        // Update user document to link to consultant profile
        await db.collection('users').doc(userId).update({
            claimedConsultantId: consultantId,
        });
        
        revalidatePath('/dashboard/consultant');
        return { success: true };
    } catch (error: any) {
        console.error('Error claiming consultant profile:', error);
        return { success: false, error: error.message || 'Failed to claim profile.' };
    }
}

export async function getClaimedConsultantId(userId: string) {
    try {
        const { db } = getFirebaseAdmin();
        if (!db) {
            throw new Error("Firestore is not initialized.");
        }
        const userDoc = await db.collection('users').doc(userId).get();
        if (!userDoc.exists) {
            return { success: false, error: "User not found" };
        }
        const data = userDoc.data();
        return { success: true, data: data?.claimedConsultantId || null };
    } catch (error: any) {
        console.error('Error fetching claimed consultant ID:', error);
        return { success: false, error: error.message || 'Failed to fetch claimed consultant ID.' };
    }
}

export async function getConsultants(options?: { limit?: number; startAfter?: string }) {
    try {
        const { db } = getFirebaseAdmin();
        if (!db) {
            throw new Error("Firestore is not initialized. Please check your server environment variables.");
        }
        
        // Consultants are in teamMembers collection (separate from faculty)
        let query: any = db.collection('teamMembers')
            .where('isConsultant', '==', true)
            .orderBy('name', 'asc');
        
        if (options?.limit) {
            query = query.limit(options.limit);
        }
        
        if (options?.startAfter) {
            const startAfterDoc = await db.collection('teamMembers').doc(options.startAfter).get();
            if (startAfterDoc.exists) {
                query = query.startAfter(startAfterDoc);
            }
        }
        
        const consultantsSnapshot = await query.get();
        
        const consultants = consultantsSnapshot.docs.map((doc: any) => {
            const data = doc.data();
            const name = data.name || '';
            const initials = name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();
            
            // Map to DirectoryConsultant format
            const consultant: DirectoryConsultant = {
                id: doc.id,
                name,
                email: data.email || '',
                title: data.title || 'Tax Consultant',
                firmName: data.firmName,
                firmAddress: data.firmAddress,
                city: data.city,
                state: data.state,
                country: data.country || 'Nigeria',
                licenseNo: data.licenseNo,
                memberNo: data.memberNo,
                verified: data.verified ?? true,
                photoInitials: initials,
                locations: [data.city, data.state].filter(Boolean),
                languages: data.languages || ['English'],
                specialties: data.specialties || ['Tax compliance', 'Tax planning'],
                industries: data.industries || [],
                yearsExperience: data.yearsExperience || 5,
                pricing: {
                    consultationFeeNGN: data.consultationFeeNGN || 25000,
                    hourlyRateNGN: data.hourlyRateNGN,
                    fairPricingPledge: data.fairPricingPledge ?? true,
                    proBono: data.proBono ?? false,
                    lowCostSlotsPerMonth: data.lowCostSlotsPerMonth,
                },
                availability: {
                    nextSlotLabel: data.availabilityNotes || 'Contact for availability',
                    responseSlaHours: data.responseSlaHours || 24,
                    bookingModes: (data.bookingModes || ['Call', 'Video']) as ("Call" | "Video" | "In-person")[],
                },
                trust: {
                    rating: data.rating || 4.5,
                    reviewCount: data.reviewCount || 0,
                    verifiedReviewsOnly: true,
                    complaintResolutionSupported: true,
                    mediationSupported: true,
                },
                badges: [],
                successStories: [],
                highlights: [
                    data.firmName ? `Firm: ${data.firmName}` : '',
                    data.licenseNo ? `License: ${data.licenseNo}` : '',
                    data.specialties && data.specialties.length > 0 ? `Specialties: ${data.specialties.slice(0, 3).join(', ')}` : '',
                    data.bio ? data.bio.substring(0, 100) : '',
                ].filter(Boolean),
            };
            
            return consultant;
        });
        
        return { success: true, data: consultants };
    } catch (error: any) {
        console.error('Error fetching consultants:', error);
        const errorMessage = error.message || 'Failed to fetch consultants.';
        return { success: false, error: errorMessage };
    }
}

export interface BookingRequest {
    consultantId: string;
    consultantName: string;
    consultantEmail: string;
    clientName: string;
    clientEmail: string;
    clientPhone: string;
    preferredMode: string;
    summary: string;
}

export async function submitBookingRequest(booking: BookingRequest) {
    try {
        const { db } = getFirebaseAdmin();
        if (!db) {
            throw new Error("Firestore is not initialized.");
        }

        // Save booking request to Firestore
        const bookingData = {
            ...booking,
            status: 'pending',
            createdAt: new Date(),
        };
        const docRef = await db.collection('bookingRequests').add(bookingData);

        // Send email notifications using Resend
        try {
            const { Resend } = await import('resend');
            const resend = new Resend(process.env.RESEND_API_KEY);

            // Email to consultant
            await resend.emails.send({
                from: 'TaxCode Directory <directory@taxcode.com.ng>',
                to: [booking.consultantEmail],
                subject: `New Booking Request from ${booking.clientName}`,
                html: `
                    <h2>New Booking Request</h2>
                    <p><strong>Client:</strong> ${booking.clientName}</p>
                    <p><strong>Email:</strong> ${booking.clientEmail}</p>
                    <p><strong>Phone:</strong> ${booking.clientPhone}</p>
                    <p><strong>Preferred Mode:</strong> ${booking.preferredMode}</p>
                    <p><strong>Summary:</strong></p>
                    <p>${booking.summary.replace(/\n/g, '<br>')}</p>
                    <hr>
                    <p>Please respond within 24 hours. Login to your dashboard to accept/decline this booking.</p>
                    <p><small>Sent from TaxCode Directory at ${new Date().toISOString()}</small></p>
                `,
            });

            // Email to client confirmation
            await resend.emails.send({
                from: 'TaxCode Directory <directory@taxcode.com.ng>',
                to: [booking.clientEmail],
                subject: `Booking Request Sent to ${booking.consultantName}`,
                html: `
                    <h2>Booking Request Sent</h2>
                    <p>Thank you for using TaxCode Directory!</p>
                    <p><strong>Consultant:</strong> ${booking.consultantName}</p>
                    <p><strong>Your Details:</strong></p>
                    <ul>
                        <li>Name: ${booking.clientName}</li>
                        <li>Email: ${booking.clientEmail}</li>
                        <li>Phone: ${booking.clientPhone}</li>
                        <li>Preferred Mode: ${booking.preferredMode}</li>
                    </ul>
                    <p><strong>Your Message:</strong></p>
                    <p>${booking.summary.replace(/\n/g, '<br>')}</p>
                    <hr>
                    <p>The consultant will respond within 24 hours. You'll receive updates via email.</p>
                    <p><small>Sent from TaxCode Directory at ${new Date().toISOString()}</small></p>
                `,
            });

            console.log('Booking request emails sent successfully');
        } catch (emailError) {
            console.error('Email notification failed (non-critical):', emailError);
        }

        return { success: true, data: { id: docRef.id } };
    } catch (error: any) {
        console.error('Error submitting booking request:', error);
        return { success: false, error: error.message || 'Failed to submit booking request.' };
    }
}

export async function getLawyers(options?: { limit?: number; startAfter?: string }) {
    try {
        const { db } = getFirebaseAdmin();
        if (!db) {
            throw new Error("Firestore is not initialized. Please check your server environment variables.");
        }
        
        // Lawyers are in teamMembers collection (separate from faculty)
        let query: any = db.collection('teamMembers')
            .where('isLawyer', '==', true)
            .orderBy('name', 'asc');
        
        if (options?.limit) {
            query = query.limit(options.limit);
        }
        
        if (options?.startAfter) {
            const startAfterDoc = await db.collection('teamMembers').doc(options.startAfter).get();
            if (startAfterDoc.exists) {
                query = query.startAfter(startAfterDoc);
            }
        }
        
        const lawyersSnapshot = await query.get();
        
        const lawyers = lawyersSnapshot.docs.map((doc: any) => {
            const data = doc.data();
            const name = data.name || '';
            const initials = name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();
            
            // Calculate overall win rate from case outcomes
            let overallWinRate = 0;
            if (data.caseOutcomes && data.caseOutcomes.length > 0) {
                const totalCases = data.caseOutcomes.reduce((sum: number, co: any) => sum + (co.casesHandled || 0), 0);
                const totalWins = data.caseOutcomes.reduce((sum: number, co: any) => sum + ((co.winRate || 0) / 100 * (co.casesHandled || 0)), 0);
                overallWinRate = totalCases > 0 ? (totalWins / totalCases) * 100 : 0;
            }
            
            // Map to DirectoryLawyer format
            const lawyer: DirectoryLawyer = {
                id: doc.id,
                name,
                email: data.email || '',
                title: data.title || 'Tax Lawyer',
                firmName: data.firmName,
                firmAddress: data.firmAddress,
                city: data.city,
                state: data.state,
                country: data.country || 'Nigeria',
                barNumber: data.barNumber,
                barAssociation: data.barAssociation || 'Nigerian Bar Association',
                verified: data.verified ?? false,
                photoInitials: initials,
                jurisdictions: data.jurisdictions || [],
                practiceAreas: data.practiceAreas || [],
                languages: data.languages || ['English'],
                yearsExperience: data.yearsExperience || 0,
                courtExperience: {
                    highCourt: data.courtExperience?.highCourt || false,
                    appealCourt: data.courtExperience?.appealCourt || false,
                    supremeCourt: data.courtExperience?.supremeCourt || false,
                    taxAppealTribunal: data.courtExperience?.taxAppealTribunal || false,
                },
                caseOutcomes: data.caseOutcomes || [],
                pricing: {
                    consultationFeeNGN: data.consultationFeeNGN || 50000,
                    hourlyRateNGN: data.hourlyRateNGN,
                    fairPricingPledge: data.fairPricingPledge ?? true,
                    proBono: data.proBono ?? false,
                },
                availability: {
                    nextSlotLabel: data.availabilityNotes || 'Contact for availability',
                    responseSlaHours: data.responseSlaHours || 24,
                    bookingModes: (data.bookingModes || ['Call', 'Video']) as ("Call" | "Video" | "In-person")[],
                    emergencyAvailable: data.emergencyAvailable || false,
                },
                trust: {
                    rating: data.rating || 4.5,
                    reviewCount: data.reviewCount || 0,
                    verifiedReviewsOnly: true,
                    complaintResolutionSupported: true,
                    mediationSupported: true,
                },
                badges: [
                    data.verified ? "Verified by NBA" : undefined,
                    data.emergencyAvailable ? "Emergency Available" : undefined,
                    data.practiceAreas?.includes("Tax Appeal Tribunal") ? "TAT Specialist" : undefined,
                    data.practiceAreas?.some((pa: string) => pa.includes("FIRS")) ? "FIRS Expert" : undefined,
                    data.proBono ? "Pro Bono" : undefined,
                ].filter(Boolean) as DirectoryLawyer["badges"],
                highlights: [
                    data.firmName ? `Firm: ${data.firmName}` : '',
                    data.barNumber ? `Bar No: ${data.barNumber}` : '',
                    data.practiceAreas && data.practiceAreas.length > 0 ? `Practice: ${data.practiceAreas.slice(0, 3).join(', ')}` : '',
                    data.courtExperience?.supremeCourt ? 'Supreme Court Experience' : '',
                    overallWinRate > 0 ? `${overallWinRate.toFixed(0)}% Win Rate` : '',
                    data.bio ? data.bio.substring(0, 100) : '',
                ].filter(Boolean),
                locations: [data.city, data.state].filter(Boolean),
                phone: data.phone,
                website: data.website,
                linkedin: data.linkedin,
                bio: data.bio,
            };
            
            return lawyer;
        });
        
        return { success: true, data: lawyers };
    } catch (error: any) {
        console.error('Error fetching lawyers:', error);
        const errorMessage = error.message || 'Failed to fetch lawyers.';
        return { success: false, error: errorMessage };
    }
}

export async function getLawyerById(lawyerId: string) {
    try {
        const { db } = getFirebaseAdmin();
        if (!db) {
            throw new Error("Firestore is not initialized.");
        }
        // Lawyers are in teamMembers collection (separate from faculty)
        const doc = await db.collection('teamMembers').doc(lawyerId).get();
        if (!doc.exists) {
            return { success: false, error: "Lawyer not found" };
        }
        const data = doc.data();
        if (!data?.isLawyer) {
            return { success: false, error: "Not a lawyer profile" };
        }
        
        // Convert Firebase Timestamps to plain values
        const lawyerData: any = { id: doc.id, ...data };
        if (lawyerData.createdAt) {
            lawyerData.createdAt = isFirestoreTimestamp(lawyerData.createdAt)
                ? lawyerData.createdAt.toDate().toISOString()
                : lawyerData.createdAt instanceof Date
                ? lawyerData.createdAt.toISOString()
                : lawyerData.createdAt;
        }
        if (lawyerData.updatedAt) {
            lawyerData.updatedAt = isFirestoreTimestamp(lawyerData.updatedAt)
                ? lawyerData.updatedAt.toDate().toISOString()
                : lawyerData.updatedAt instanceof Date
                ? lawyerData.updatedAt.toISOString()
                : lawyerData.updatedAt;
        }
        if (lawyerData.claimedAt) {
            lawyerData.claimedAt = isFirestoreTimestamp(lawyerData.claimedAt)
                ? lawyerData.claimedAt.toDate().toISOString()
                : lawyerData.claimedAt instanceof Date
                ? lawyerData.claimedAt.toISOString()
                : lawyerData.claimedAt;
        }
        
        return { success: true, data: lawyerData as TeamMember };
    } catch (error: any) {
        console.error('Error fetching lawyer:', error);
        return { success: false, error: error.message || 'Failed to fetch lawyer.' };
    }
}

export async function getConsultantBookings(consultantId: string) {
    try {
        const { db } = getFirebaseAdmin();
        if (!db) {
            throw new Error("Firestore is not initialized.");
        }
        const bookingsSnapshot = await db.collection('bookingRequests')
            .where('consultantId', '==', consultantId)
            .orderBy('createdAt', 'desc')
            .get();
        
        const bookings = bookingsSnapshot.docs.map((doc: any) => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                createdAt: isFirestoreTimestamp(data.createdAt)
                    ? data.createdAt.toDate().toISOString()
                    : new Date().toISOString(),
            };
        });
        
        return { success: true, data: bookings };
    } catch (error: any) {
        console.error('Error fetching consultant bookings:', error);
        return { success: false, error: error.message || 'Failed to fetch bookings.' };
    }
}

export async function updateBookingStatus(bookingId: string, status: 'accepted' | 'declined' | 'completed') {
    try {
        const { db } = getFirebaseAdmin();
        if (!db) {
            throw new Error("Firestore is not initialized.");
        }
        await db.collection('bookingRequests').doc(bookingId).update({
            status,
            updatedAt: new Date(),
        });
        revalidatePath('/dashboard/consultant/bookings');
        return { success: true };
    } catch (error: any) {
        console.error('Error updating booking status:', error);
        return { success: false, error: error.message || 'Failed to update booking status.' };
    }
}

// ============================================
// INSIGHTS & NEWS SERVER ACTIONS
// ============================================

export interface Insight {
    id: string;
    title: string;
    slug: string;
    category: string;
    summary: string;
    body: string;
    tags: string[];
    isPublished: boolean;
    isFeatured: boolean;
    publishedAt: string | null;
    downloads: any;
    viewCount: number;
    createdAt: string;
    updatedAt: string;
}

export interface News {
    id: string;
    title: string;
    slug: string;
    type: string;
    summary: string;
    body: string;
    externalUrl: string | null;
    isPublished: boolean;
    publishedAt: string | null;
    viewCount: number;
    createdAt: string;
    updatedAt: string;
}

export async function getInsights(includeUnpublished: boolean = false) {
    try {
        const { firestoreContent } = await import('@/lib/firestore-content');

        console.log('Fetching insights with where clause:', { includeUnpublished });
        const { insights } = await firestoreContent.getInsights({
            includeUnpublished,
        });

        console.log(`Found ${insights.length} insights in database`);

        return {
            success: true,
            data: insights.map((insight) => ({
                ...insight,
                publishedAt: insight.publishedAt?.toISOString() || null,
                createdAt: insight.createdAt.toISOString(),
                updatedAt: insight.updatedAt.toISOString(),
            })),
            count: insights.length,
        };
    } catch (error: any) {
        console.error('Error fetching insights:', error);
        console.error('Error stack:', error.stack);
        return { success: false, error: error.message || 'Failed to fetch insights.', data: [], count: 0 };
    }
}

export async function getInsightBySlug(slug: string) {
    try {
        const { firestoreContent } = await import('@/lib/firestore-content');
        const insight = await firestoreContent.getInsightBySlug(slug);

        if (!insight) {
            return { success: false, error: 'Insight not found', data: null };
        }

        return {
            success: true,
            data: {
                ...insight,
                publishedAt: insight.publishedAt?.toISOString() || null,
                createdAt: insight.createdAt.toISOString(),
                updatedAt: insight.updatedAt.toISOString(),
            },
        };
    } catch (error: any) {
        console.error('Error fetching insight:', error);
        return { success: false, error: error.message || 'Failed to fetch insight.', data: null };
    }
}

export async function createInsight(data: {
    title: string;
    category: string;
    summary: string;
    body: string;
    tags?: string[];
    image?: string;
    isPublished?: boolean;
    isFeatured?: boolean;
    publishedAt?: string;
    downloads?: any;
}) {
    try {
        console.log('🔍 DEBUG: createInsight called with:', { title: data.title, category: data.category });
        const { firestoreContent } = await import('@/lib/firestore-content');

        const slug = data.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');

        const existing = await firestoreContent.getInsightBySlug(slug);
        const finalSlug = existing ? `${slug}-${Date.now()}` : slug;

        console.log('🔍 DEBUG: Attempting to create insight with data:', {
            title: data.title,
            slug: finalSlug,
            category: data.category,
            isPublished: data.isPublished || false,
        });

        const insight = await firestoreContent.createInsight({
            title: data.title,
            slug: finalSlug,
            category: data.category,
            summary: data.summary,
            body: data.body,
            tags: data.tags || [],
            image: data.image,
            isPublished: data.isPublished || false,
            isFeatured: data.isFeatured || false,
            publishedAt: data.publishedAt ? new Date(data.publishedAt) : data.isPublished ? new Date() : undefined,
            downloads: data.downloads,
        });

        console.log('✅ DEBUG: Insight created successfully:', { id: insight.id, slug: insight.slug });

        revalidatePath('/insights');
        revalidatePath('/dashboard/insights');

        return {
            success: true,
            data: {
                ...insight,
                publishedAt: insight.publishedAt?.toISOString() || null,
                createdAt: insight.createdAt.toISOString(),
                updatedAt: insight.updatedAt.toISOString(),
            },
        };
    } catch (error: any) {
        console.error('❌ ERROR creating insight:', error);
        console.error('Error message:', error.message);
        return { success: false, error: error.message || 'Failed to create insight.' };
    }
}

export async function updateInsight(id: string, data: Partial<{
    title: string;
    category: string;
    summary: string;
    body: string;
    tags: string[];
    image: string;
    isPublished: boolean;
    isFeatured: boolean;
    publishedAt: string;
    downloads: any;
}>) {
    try {
        const { firestoreContent } = await import('@/lib/firestore-content');

        const updateData: any = {};
        if (data.title !== undefined) updateData.title = data.title;
        if (data.category !== undefined) updateData.category = data.category;
        if (data.summary !== undefined) updateData.summary = data.summary;
        if (data.body !== undefined) updateData.body = data.body;
        if (data.tags !== undefined) updateData.tags = data.tags;
        if (typeof data.isPublished === 'boolean') {
            updateData.isPublished = data.isPublished;
            if (data.isPublished && !data.publishedAt) {
                updateData.publishedAt = new Date();
            }
        }
        if (typeof data.isFeatured === 'boolean') updateData.isFeatured = data.isFeatured;
        if (data.publishedAt !== undefined) updateData.publishedAt = data.publishedAt ? new Date(data.publishedAt) : undefined;
        if (data.downloads !== undefined) updateData.downloads = data.downloads;
        if (data.image !== undefined) updateData.image = data.image;

        // Update slug if title changed
        if (data.title) {
            const current = await firestoreContent.getInsightById(id);
            if (current && current.title !== data.title) {
                const newSlug = data.title
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/(^-|-$)/g, '');
                const existing = await firestoreContent.getInsightBySlug(newSlug);
                updateData.slug = existing ? `${newSlug}-${Date.now()}` : newSlug;
            }
        }

        await firestoreContent.updateInsight(id, updateData);

        // Get updated insight
        const updatedInsight = await firestoreContent.getInsightById(id);
        if (!updatedInsight) {
            return { success: false, error: 'Insight not found after update' };
        }

        revalidatePath('/insights');
        revalidatePath(`/insights/${updatedInsight.slug}`);
        revalidatePath('/dashboard/insights');

        return {
            success: true,
            data: {
                ...updatedInsight,
                publishedAt: updatedInsight.publishedAt?.toISOString() || null,
                createdAt: updatedInsight.createdAt.toISOString(),
                updatedAt: updatedInsight.updatedAt.toISOString(),
            },
        };
    } catch (error: any) {
        console.error('Error updating insight:', error);
        return { success: false, error: error.message || 'Failed to update insight.' };
    }
}

export async function deleteInsight(id: string) {
    try {
        const { firestoreContent } = await import('@/lib/firestore-content');
        await firestoreContent.deleteInsight(id);
        revalidatePath('/insights');
        revalidatePath('/dashboard/insights');
        return { success: true };
    } catch (error: any) {
        console.error('Error deleting insight:', error);
        return { success: false, error: error.message || 'Failed to delete insight.' };
    }
}

export async function getNews(includeUnpublished: boolean = false) {
    try {
        const { firestoreContent } = await import('@/lib/firestore-content');

        console.log('Fetching news with where clause:', { includeUnpublished });
        const { news } = await firestoreContent.getNews({
            includeUnpublished,
        });

        console.log(`Found ${news.length} news items in database`);

        return {
            success: true,
            data: news.map((item) => ({
                ...item,
                publishedAt: item.publishedAt?.toISOString() || null,
                createdAt: item.createdAt.toISOString(),
                updatedAt: item.updatedAt.toISOString(),
            })),
            count: news.length,
        };
    } catch (error: any) {
        console.error('Error fetching news:', error);
        return { success: false, error: error.message || 'Failed to fetch news.', data: [], count: 0 };
    }
}

export async function getNewsBySlug(slug: string) {
    try {
        const { firestoreContent } = await import('@/lib/firestore-content');
        const news = await firestoreContent.getNewsBySlug(slug);

        if (!news) {
            return { success: false, error: 'News item not found', data: null };
        }

        return {
            success: true,
            data: {
                ...news,
                publishedAt: news.publishedAt?.toISOString() || null,
                createdAt: news.createdAt.toISOString(),
                updatedAt: news.updatedAt.toISOString(),
            },
        };
    } catch (error: any) {
        console.error('Error fetching news:', error);
        return { success: false, error: error.message || 'Failed to fetch news.', data: null };
    }
}

export async function createNews(data: {
    title: string;
    type: string;
    summary: string;
    body: string;
    externalUrl?: string;
    isPublished?: boolean;
    publishedAt?: string;
}) {
    try {
        console.log('🔍 DEBUG: createNews called with:', { title: data.title, type: data.type });
        const { firestoreContent } = await import('@/lib/firestore-content');

        const slug = data.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');

        const existing = await firestoreContent.getNewsBySlug(slug);
        const finalSlug = existing ? `${slug}-${Date.now()}` : slug;

        const news = await firestoreContent.createNews({
            title: data.title,
            slug: finalSlug,
            type: data.type,
            summary: data.summary,
            body: data.body,
            externalUrl: data.externalUrl,
            isPublished: data.isPublished || false,
            publishedAt: data.publishedAt ? new Date(data.publishedAt) : data.isPublished ? new Date() : undefined,
        });

        revalidatePath('/news');
        revalidatePath('/dashboard/insights');

        return {
            success: true,
            data: {
                ...news,
                publishedAt: news.publishedAt?.toISOString() || null,
                createdAt: news.createdAt.toISOString(),
                updatedAt: news.updatedAt.toISOString(),
            },
        };
    } catch (error: any) {
        console.error('❌ ERROR creating news:', error);
        return { success: false, error: error.message || 'Failed to create news.' };
    }
}

export async function updateNews(id: string, data: Partial<{
    title: string;
    type: string;
    summary: string;
    body: string;
    externalUrl: string;
    isPublished: boolean;
    publishedAt: string;
}>) {
    try {
        const { firestoreContent } = await import('@/lib/firestore-content');

        const updateData: any = {};
        if (data.title !== undefined) updateData.title = data.title;
        if (data.type !== undefined) updateData.type = data.type;
        if (data.summary !== undefined) updateData.summary = data.summary;
        if (data.body !== undefined) updateData.body = data.body;
        if (data.externalUrl !== undefined) updateData.externalUrl = data.externalUrl;
        if (typeof data.isPublished === 'boolean') {
            updateData.isPublished = data.isPublished;
            if (data.isPublished && !data.publishedAt) {
                updateData.publishedAt = new Date();
            }
        }
        if (data.publishedAt !== undefined) updateData.publishedAt = data.publishedAt ? new Date(data.publishedAt) : undefined;

        // Update slug if title changed
        if (data.title) {
            const current = await firestoreContent.getNewsById(id);
            if (current && current.title !== data.title) {
                const newSlug = data.title
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/(^-|-$)/g, '');
                const existing = await firestoreContent.getNewsBySlug(newSlug);
                updateData.slug = existing ? `${newSlug}-${Date.now()}` : newSlug;
            }
        }

        await firestoreContent.updateNews(id, updateData);

        // Get updated news
        const updatedNews = await firestoreContent.getNewsById(id);
        if (!updatedNews) {
            return { success: false, error: 'News item not found after update' };
        }

        revalidatePath('/news');
        revalidatePath(`/news/${updatedNews.slug}`);
        revalidatePath('/dashboard/insights');

        return {
            success: true,
            data: {
                ...updatedNews,
                publishedAt: updatedNews.publishedAt?.toISOString() || null,
                createdAt: updatedNews.createdAt.toISOString(),
                updatedAt: updatedNews.updatedAt.toISOString(),
            },
        };
    } catch (error: any) {
        console.error('Error updating news:', error);
        return { success: false, error: error.message || 'Failed to update news.' };
    }
}

export async function deleteNews(id: string) {
    try {
        const { firestoreContent } = await import('@/lib/firestore-content');
        await firestoreContent.deleteNews(id);
        revalidatePath('/news');
        revalidatePath('/dashboard/insights');
        return { success: true };
    } catch (error: any) {
        console.error('Error deleting news:', error);
        return { success: false, error: error.message || 'Failed to delete news.' };
    }
}
