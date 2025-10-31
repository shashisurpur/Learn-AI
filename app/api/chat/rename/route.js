import connectDB from "@/config/db";
import Chat from "@/models/Chat";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


export async function POST(req) {
    try{
        const {userId} =  getAuth(req)
        if(!userId){
            return NextResponse.json({success:false,message:"Unauthorized"}, {status:401})
        }
        const {chatId, newName} = await req.json();
        //connect to db
        await connectDB();
        await Chat.findByIdAndUpdate({_id:chatId,userId}, {name: newName})

        return NextResponse.json({success:true,message:"Chat renamed successfully"}, {status:200})
    }catch(err){
        console.error(err);
        return NextResponse.json({success:false,message:"Failed to rename chat"}, {status:500})
    }
}