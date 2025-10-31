import connectDB from "@/config/db";
import Chat from "@/models/Chat";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


export async function POST(req) {
    try{
        const {userId} =  getAuth(req)
        const {chatId} = await req.json();
        if(!chatId){
            return NextResponse.json({success:false,message:"Chat ID is required"}, {status:400})
        }
        if(!userId){
            return NextResponse.json({success:false,message:"Unauthorized"}, {status:401})
        }

        

        //connect to db
        await connectDB();
        await Chat.deleteOne({_id:chatId,userId})

        return NextResponse.json({success:true,message:"Chat deleted successfully"}, {status:200})
    }catch(err){
        console.error(err);
        return NextResponse.json({success:false,message:"Failed to delete chat"}, {status:500})
    }
}