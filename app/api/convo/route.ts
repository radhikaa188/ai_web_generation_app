import { db } from "@/config/db";
import { chatTable } from "@/config/schema";
import { NextRequest, NextResponse } from "next/server";
import { eq } from 'drizzle-orm';

export async function PUT(req: NextRequest){
   try{ const {messages, frameId} = await req.json()

    const frameIdStr = String(frameId);

    const existingChat = await db.select()
            .from(chatTable)
            .where(eq(chatTable.frameId, frameIdStr))
            .limit(1);
       
    if (existingChat.length > 0) {
    const result = await db.update(chatTable).set({
        chatMessage:messages
        //@ts-ignore
    }).where(eq(chatTable.frameId, frameIdStr))

    return NextResponse.json({result:'updated', action: 'update'})
    }else{
        const result = await db.insert(chatTable).values({
                frameId: frameIdStr,
                chatMessage: messages,
                createdBy: 'user@example.com' // You need to get this from auth/session
                // Add your user email here or get from session
            });
            
            return NextResponse.json({result: 'created', action: 'insert'});
    }
}catch(error:any){
        console.error('Error saving chat:', error);
        return NextResponse.json(
            {error: 'Failed to save chat'}, 
            {status: 500}
        );
}
}
