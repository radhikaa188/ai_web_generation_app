import { db } from "@/config/db";
import { chatTable } from "@/config/schema";
import { NextRequest, NextResponse } from "next/server";
import { eq } from 'drizzle-orm';

export async function PUT(req: NextRequest){
    const {messages, frameId} = await req.json()

    const result = await db.update(chatTable).set({
        chatMessage:messages
        //@ts-ignore
    }).where(eq(chatTable.frameId, Number(frameId)))

    return NextResponse.json({result:'updated'})
}