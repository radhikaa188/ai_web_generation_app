import { db } from "@/config/db";
import { chatTable, frameTable, projectTable, usersTable } from "@/config/schema";
import { auth, currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm" 

export async function POST(req: NextRequest) {
    const {projectId, frameId, messages, credits} = await req.json()
    const user= await currentUser();
    const {has} = await auth()
    const hasUnlimited = has && has({plan: 'unlimited'})
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    //Create project
    const projectResult = await db.insert(projectTable).values({
        projectId: projectId,
        createdBy:user?.primaryEmailAddress?.emailAddress
    })
    //create frame
    const frameResult = await db.insert(frameTable).values({
        frameId:frameId,
        projectId: projectId
    })
    //save user message
    const chatResult = await db.insert(chatTable).values({
        chatMessage:[messages],
        createdBy: user?.primaryEmailAddress?.emailAddress,
        frameId: frameId
    })
    //upgrade credits
    if(!hasUnlimited){
        const userResult=await db.update(usersTable).set({
            credits: credits-1
            //@ts-ignore
        }).where(eq(usersTable.email, user?.primaryEmailAddress?.emailAddress))
    }
    const userResult = await db.update(usersTable).set({
         credits: credits-1
         // @ts-ignore
    }).where(eq(usersTable.email, user?.primaryEmailAddress?.emailAddress))
    return NextResponse.json({
        projectId, frameId, messages
    })
}