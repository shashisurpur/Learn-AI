import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";
import * as cheerio from "cheerio";

// const ai = new GoogleGenAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY);
const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});


const transformText = async (mode, context) => {

    let prompt = ''
    switch (mode) {
        case 'summarise':
            prompt = `Summarize the following text into clear, concise key points.
- Focus only on the most important facts or ideas.
- Use bullet points.
- Avoid repetition or unnecessary details.

Text:
${context}`
            break;
        case 'rephrase':
            prompt = `Rephrase the following text in a clear, natural tone.
Keep the original meaning, but make it sound more fluent and natural.
-Avoid adding new ideas.

Text:
${context}`
            break;
        case 'explain_simply':
            prompt = `Explain the following text in simple, easy-to-understand language:
-Avoid adding new ideas.        

Text:
${context}`
            break;
        default:
            throw new Error("Invalid mode")
    }

    // const result = await ai
    const result = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        // contents:`${systemPromt}\n\n${userPrompt}`,
        contents: prompt,
        config: {
            thinkingConfig: {
                thinkingBudget: 0, // Disables thinking
            },
        }

    })

    return result.text
}

export async function POST(req) {
    try {

        const { mode, context, url } = await req.json();
        // console.log(mode,context,'mode, context');
        if (!url) {
            const result = await transformText(mode, context);
            return NextResponse.json({ success: true, data: result }, { status: 200 })
        }

        const response = await fetch(url);
        const html = await response.text();

        // Extract visible text using cheerio
        const $ = cheerio.load(html);
        const text = $("body").text().replace(/\s+/g, " ").trim().slice(0, 8000);

        const prompt = `Explain the following webpage content in simple, clear language:\n\n${text}`;

        const result = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            // contents:`${systemPromt}\n\n${userPrompt}`,
            contents: prompt,
            config: {
                thinkingConfig: {
                    thinkingBudget: 0, // Disables thinking
                },
            }

        })
        const finalResult = result.text;

        return NextResponse.json({ success: true, data: finalResult }, { status: 200 })

    } catch (err) {
        console.error(err);
        return NextResponse.json({ success: false, error: err.message }, { status: 500 })
    }
}