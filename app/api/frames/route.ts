import { db } from "@/config/db";
import { chatTable, frameTable } from "@/config/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest){
    const {searchParams} = new URL(req.url)
    const frameId=searchParams.get('frameId')
    // const projectId = searchParams.get('projectId')
    const frameResult=await db.select().from(frameTable)
    //@ts-ignore
    .where(eq(frameTable.frameId, frameId))
    const chatResult = await db.select().from(chatTable)
    //@ts-ignore
    .where(eq(chatTable.frameId, frameId))

    const final = {
        ...frameResult[0],
        chatMessage: chatResult?.[0]?.chatMessage || []
    }
    return NextResponse.json(final)
}