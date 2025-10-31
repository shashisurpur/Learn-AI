import connectDB from "@/config/db";
import Chat from "@/models/Chat";


import { getAuth } from "@clerk/nextjs/server";
import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";


export async function GET(req) {
    try {
       
        const client = new MongoClient(process.env.MONGODB_URI);
        await client.connect();
        const db = client.db();

        const uploads = db.collection('ChatPdfs');

        const files = await uploads.find({}).toArray();

        return NextResponse.json({ success: true, data: files }, { status: 200 })
    } catch (err) {
        console.error(err);
        return NextResponse.json({ success: false, message: "Failed to retrieve files" }, { status: 500 })
    }
}