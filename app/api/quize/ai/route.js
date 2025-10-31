
const MAX_TOKENS_LIMT = 5;
export const MAX_DURATION = 60; //seconds
import connectDB from "@/config/db";
import Chat from "@/models/Chat";
import RequestLimit from "@/models/Guest";
import { getAuth } from "@clerk/nextjs/server";
import { GoogleGenAI } from "@google/genai";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

const BASE_PROMPT = `
You are an AI that generates quizzes in JSON format.

When the user provides a topic, immediately generate a quiz in valid JSON format.
Do not ask for confirmation or include any text outside the JSON.

Rules:
- Output ONLY valid JSON.
- The JSON must include:
  - "quiz_topic": string
  - "questions": an array of 5 questions (unless the user specifies otherwise)
- Each question object must contain:
  {
    "id": number,
    "question": string,
    "options": [string, string, string, string],
    "correct_answer": string,  
    "explanation": string
  }

Guidelines:
- Mix different difficulty levels across the quiz.
- Keep the language clear and age-appropriate unless specified otherwise.


Example:

User: Create a quiz about machine learning

Expected Output:
{
  "quiz_topic": "Machine Learning",
  "questions": [
    {
      "id": 1,
      "question": "What does 'overfitting' mean in machine learning?",
      "options": [
        "When a model performs well on training data but poorly on new data",
        "When a model performs well on both training and new data",
        "When a model has too few parameters",
        "When a model cannot learn patterns at all"
      ],
      "correct_answer": "When a model performs well on training data but poorly on new data",
      "explanation": "Overfitting occurs when the model memorizes training data rather than generalizing."
    }
  ]
}

Now, whenever the user gives a topic, respond **only with JSON output** following this structure.
`

// const ai = new GoogleGenAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY);
const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

const parseJSONData = (text) => {
    try {
        const jsonStart = text.indexOf("{");
        const jsonEnd = text.lastIndexOf("}") + 1;
        const jsonString = text.slice(jsonStart, jsonEnd);
        const quizData = JSON.parse(jsonString);

        console.log("Quiz Generated Successfully:\n", quizData);
        return quizData;
    } catch (err) {
        console.error("Failed to parse JSON output:", err, "\nRaw output:\n", text);
        return err
    }
}

export async function POST(req) {
    try {
        const { userId } = getAuth(req)
        const { prompt } = await req.json();


        const customePrompt = ''
        //connect to db
        await connectDB();

        //call to gemini api
        const userPrompt = `Create a quiz about ${prompt}`;
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `${BASE_PROMPT}\n\n${userPrompt}`,
            config: {
                thinkingConfig: {
                    thinkingBudget: 0, // Disables thinking
                },
            }
        });
        console.log('ai response', response.text);
        // const text = response.text
        const message = await parseJSONData(response.text)

       


        return NextResponse.json({ success: true, data: message }, { status: 200 })
    } catch (err) {
        console.error(err);
        return NextResponse.json({ success: false, error: err.message }, { status: 500 })
    }
}