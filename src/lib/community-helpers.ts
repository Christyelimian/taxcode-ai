import { cookies } from "next/headers";
import { verifySessionCookie } from "@/lib/session";
import { getFirebaseAdmin } from "@/lib/firebase-server";
import { PrismaClient } from "@prisma/client";

// Lazy-initialize Prisma client
let prismaInstance: PrismaClient | null = null;
let prismaError: Error | null = null;

function getPrismaClient(): PrismaClient {
  if (prismaInstance) return prismaInstance;
  
  if (prismaError) {
    throw prismaError;
  }
  
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl || typeof dbUrl !== 'string' || dbUrl.trim().length === 0) {
    prismaError = new Error(
      'DATABASE_URL environment variable is not set or is empty. Cannot initialize Prisma client for community operations.'
    );
    throw prismaError;
  }
  
  try {
    prismaInstance = new PrismaClient();
    return prismaInstance;
  } catch (error: any) {
    prismaError = error instanceof Error ? error : new Error(String(error));
    throw prismaError;
  }
}

/**
 * Get or create a PostgreSQL User from Firebase auth session
 * Returns the PostgreSQL User ID
 */
export async function getCommunityUser() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session")?.value;
    const decoded = await verifySessionCookie(sessionCookie);
    
    if (!decoded?.uid || !decoded?.email) {
      return null;
    }

    const { auth } = getFirebaseAdmin();
    if (!auth) return null;

    // Get Firebase user details
    const firebaseUser = await auth.getUser(decoded.uid);
    const email = firebaseUser.email;
    const name = firebaseUser.displayName || firebaseUser.email?.split("@")[0];

    if (!email) return null;

    const prisma = getPrismaClient();
    
    // Find or create PostgreSQL user
    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Create new user in PostgreSQL
      user = await prisma.user.create({
        data: {
          email,
          name: name || undefined,
          username: name?.toLowerCase().replace(/\s+/g, "_") || undefined,
          lastActive: new Date(),
        },
      });
    } else {
      // Update last active
      await prisma.user.update({
        where: { id: user.id },
        data: { lastActive: new Date() },
      });
    }

    return user;
  } catch (error) {
    console.error("Error getting community user:", error);
    return null;
  }
}

/**
 * Award XP to a user and check for level ups
 */
export async function awardXP(userId: string, amount: number, reason?: string) {
  try {
    const prisma = getPrismaClient();
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) return;

    const newXP = user.xp + amount;
    const newLevel = calculateLevel(newXP);

    await prisma.user.update({
      where: { id: userId },
      data: {
        xp: newXP,
        level: newLevel,
      },
    });

    // Check if level increased
    if (newLevel > user.level) {
      // Create level up notification
      await prisma.notification.create({
        data: {
          userId,
          type: "level_up",
          content: `You leveled up to Level ${newLevel}!`,
          actionUrl: `/community/users/${userId}`,
        },
      });
    }

    return { newXP, newLevel, leveledUp: newLevel > user.level };
  } catch (error) {
    console.error("Error awarding XP:", error);
  }
}

/**
 * Calculate level from XP
 * Level formula: level = floor(sqrt(xp / 100))
 */
function calculateLevel(xp: number): number {
  return Math.max(1, Math.floor(Math.sqrt(xp / 100)) + 1);
}

/**
 * Check and award badges based on user activity
 */
export async function checkBadges(userId: string) {
  try {
    const prisma = getPrismaClient();
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        questions: true,
        answers: true,
        userBadges: {
          include: { badge: true },
        },
      },
    });

    if (!user) return;

    const earnedBadgeIds = new Set(user.userBadges.map((ub) => ub.badgeId));
    const newBadges: string[] = [];

    // First Question badge
    if (user.questions.length >= 1 && !earnedBadgeIds.has("first_question")) {
      const badge = await prisma.badge.upsert({
        where: { name: "First Question" },
        update: {},
        create: {
          name: "First Question",
          description: "Asked your first question",
          icon: "question-circle",
          xpReward: 10,
          rarity: "common",
        },
      });

      await prisma.userBadge.create({
        data: {
          userId,
          badgeId: badge.id,
        },
      });

      await awardXP(userId, badge.xpReward);
      newBadges.push(badge.id);
    }

    // First Answer badge
    if (user.answers.length >= 1 && !earnedBadgeIds.has("first_answer")) {
      const badge = await prisma.badge.upsert({
        where: { name: "First Answer" },
        update: {},
        create: {
          name: "First Answer",
          description: "Answered your first question",
          icon: "check-circle",
          xpReward: 20,
          rarity: "common",
        },
      });

      await prisma.userBadge.create({
        data: {
          userId,
          badgeId: badge.id,
        },
      });

      await awardXP(userId, badge.xpReward);
      newBadges.push(badge.id);
    }

    // Helper badge (10 answers)
    if (user.answers.length >= 10 && !earnedBadgeIds.has("helper")) {
      const badge = await prisma.badge.upsert({
        where: { name: "Helper" },
        update: {},
        create: {
          name: "Helper",
          description: "Answered 10 questions",
          icon: "helping-hand",
          xpReward: 50,
          rarity: "rare",
        },
      });

      await prisma.userBadge.create({
        data: {
          userId,
          badgeId: badge.id,
        },
      });

      await awardXP(userId, badge.xpReward);
      newBadges.push(badge.id);
    }

    return newBadges;
  } catch (error) {
    console.error("Error checking badges:", error);
    return [];
  }
}
