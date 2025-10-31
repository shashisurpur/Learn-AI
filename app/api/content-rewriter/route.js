
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


const transformText = (mode, context) => {
    let systemPromt = ''
    let userPrompt = ''
    switch (mode) {
        case 'summarize':
            systemPromt = 'You summarize text into clear key points.'
            userPrompt = `Summarize this:\n\n${context}`
            break;
        case 'rephrase':
            systemPromt = 'You rephrase text in different words while keeping meaning.'
            userPrompt = `Rephrase this:\n\n${context}`
            break;
        case 'explain_simply':
            systemPromt = 'You explain text in simple language.'
            userPrompt = `Explain this:\n\n${context}`
            break;
        default:
            throw new Error("Invalid mode")
    }

    // const result = await ai.chats.create()
}

export async function POST(req) {
    try {

        const { mode, context } = await req.json();



        return NextResponse.json({ success: true, data: '' }, { status: 200 })
    } catch (err) {
        console.error(err);
        return NextResponse.json({ success: false, error: err.message }, { status: 500 })
    }
}