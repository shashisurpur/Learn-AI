
const MAX_TOKENS_LIMT = 5;
export const MAX_DURATION = 60; //seconds
import connectDB from "@/config/db";
import Chat from "@/models/Chat";
import RequestLimit from "@/models/Guest";
import { getAuth } from "@clerk/nextjs/server";
import { GoogleGenAI } from "@google/genai";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

// const ai = new GoogleGenAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY);
const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});


let rateLimitStore = {};
export async function POST(req) {
    try {
        const { userId } = getAuth(req)
        const { chatId, prompt } = await req.json();

        const userPrompt = {
            role: "user",
            content: prompt,
            timestamp: Date.now(),
        }

        if (!userId) {
            const requestHeaders = await headers();
            const forwardedFor = requestHeaders.get('x-forwarded-for');
            const ip = forwardedFor?.split(',')[0] ?? 'unknown';

            console.log("Request IP:", ip);
            await connectDB();
            const now = new Date();
            let guest = await RequestLimit.findOne({ userId: ip })

            if (!guest) {
                guest = new RequestLimit({
                    userId: ip,
                    count: 1,
                    lastRequest: now,
                })
                // await guest.save();
                // return NextResponse({ success: true, data: message, requests: rateLimitStore[ip].count }, { status: 200 })
            }else{
                const diffHours = (now - guest.lastRequest) / (1000 * 60 * 60);
                 if (diffHours >= 24) {
                    guest.count =1;
                    guest.lastRequest = now;
                    // await guest.save();
                 }
                 guest.count += 1 ;
                 guest.lastRequest = now;                 
            }
            
            if(guest.count > MAX_TOKENS_LIMT){
                return NextResponse.json({ success: false, message: 'Daily limit exceeds. Please login to continue...',requests:MAX_TOKENS_LIMT }, { status: 429 })
            }
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: prompt,
                config: {
                    thinkingConfig: {
                        thinkingBudget: 0, // Disables thinking
                    },
                }
            });
            console.log(response.text);
            const message = response.text;
            await guest.save();
            return NextResponse.json({ success: true, data: message, requests: guest.count }, { status: 200 })
            // return NextResponse.json({ success: false, data: 'check', }, { status: 500 })

        }
        if (userId && !chatId) {
            rateLimitStore = {};
        }

        //connect to db

        await connectDB();
        const chats = await Chat.findOne({ _id: chatId, userId });

        chats.messages.push(userPrompt);

        //call to gemini api
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                thinkingConfig: {
                    thinkingBudget: 0, // Disables thinking
                },
            }
        });
        console.log(response.text);
        const message = response.text;
        //push response to messages
        const aiResponse = {
            role: "assistant",
            content: message,
            timestamp: Date.now(),
        };
        chats.messages.push(aiResponse);

        //save response to db
        chats.save();

        return NextResponse.json({ success: true, data: message }, { status: 200 })
    } catch (err) {
        console.error(err);
        return NextResponse.json({ success: false, error: err.message }, { status: 500 })
    }
}