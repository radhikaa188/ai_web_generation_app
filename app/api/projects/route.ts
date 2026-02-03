import { db } from "@/config/db";
import { chatTable, frameTable, projectTable, usersTable } from "@/config/schema";
import { auth, currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
    try {
        const { projectId, frameId, messages } = await req.json();
        const user = await currentUser();
        const { has } = await auth();
        const hasUnlimited = has && has({ plan: 'unlimited' });

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userEmail = user.primaryEmailAddress?.emailAddress;
        if (!userEmail) {
            return NextResponse.json({ error: "User email not found" }, { status: 400 });
        }

        // 1. Check if user exists OR create new user
        let existingUser = await db
            .select()
            .from(usersTable)
            .where(eq(usersTable.email, userEmail))
            .limit(1);

        let currentCredits;
        
        if (existingUser.length === 0) {
            // Create new user with default credits (2)
            await db.insert(usersTable).values({
                name: user.firstName || "User",
                email: userEmail,
                credits: 2 // Default from schema
            });
            currentCredits = 2;
        } else {
            currentCredits = existingUser[0]?.credits || 2;
        }

        // 2. Check if user has enough credits (if not unlimited)
        if (!hasUnlimited && currentCredits <= 0) {
            return NextResponse.json({ 
                error: "Insufficient credits. Please upgrade your plan." 
            }, { status: 400 });
        }

        // 3. Create project
        await db.insert(projectTable).values({
            projectId: projectId,
            createdBy: userEmail
        });

        // 4. Create frame
        await db.insert(frameTable).values({
            frameId: frameId,
            projectId: projectId
        });

        // 5. Save chat message
        await db.insert(chatTable).values({
            chatMessage: [messages],
            createdBy: userEmail,
            frameId: frameId
        });

        // 6. Update credits ONLY if not unlimited
        if (!hasUnlimited) {
            await db.update(usersTable).set({
                credits: currentCredits - 1
            }).where(eq(usersTable.email, userEmail));
        }

        return NextResponse.json({
            success: true,
            projectId,
            frameId,
            messages,
            creditsRemaining: hasUnlimited ? 'unlimited' : currentCredits - 1
        });

    } catch (error:any) {
        console.error("Error in projects API:", error);
        return NextResponse.json(
            { error: "Internal Server Error", details: error.message },
            { status: 500 }
        );
    }
}