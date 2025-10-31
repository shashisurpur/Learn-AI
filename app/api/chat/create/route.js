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

        const ChatData = {
            userId,
            messages:[],
            name:"New Chat",
        }

        //connect to db
        await connectDB();
        await Chat.create(ChatData) 

        return NextResponse.json({success:true,message:"Chat created successfully"}, {status:200})
    }catch(err){
        console.error(err);
        return NextResponse.json({success:false,message:"Failed to create chat"}, {status:500})
    }
}