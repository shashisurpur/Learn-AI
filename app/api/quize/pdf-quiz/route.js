import { NextResponse } from "next/server";

import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";

import { MongoClient } from "mongodb";
import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import { GoogleGenerativeAI } from '@google/generative-ai'

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
    const { topic } = await req.json();

    console.log(topic, 'topic')

    const embeddings = new GoogleGenerativeAIEmbeddings({
        apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
        model: "text-embedding-004",
    });


    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    const db = client.db();
    const collection = db.collection("quiz_chunks");

    const indexes = await collection.indexes();
    console.log('Indexes', indexes);
    // console.log(collection,'collecton')
    const vectorStore = new MongoDBAtlasVectorSearch(embeddings, {
        collection,
        indexName: "quiz_embedding_knn_index", // your MongoDB Atlas vector index name
        textKey: "text",
        embeddingKey: "embedding",
    });

    const docs = await vectorStore.similaritySearch(topic || "", 10);

    console.log(docs.length, 'length')
    if (docs.length === 0) {
        return NextResponse.json({ success: false, message: 'No Data found' }, { status: 404 })
    }

    const textData = docs.map(d => d.pageContent).join("\n\n");

    const model = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY).getGenerativeModel({
        model: "gemini-2.5-flash",
    });

    // 2️⃣ Ask Gemini to make quiz

    const promp1 = `
You are a quiz generator.
Create 5 multiple-choice questions based on the following content:
---
${textData}
---
Output JSON in this format:
[
  {
    "question": "...",
    "options": ["A", "B", "C", "D"],
    "answer": "A"
  }
]
`;

    const prompt = `
You are a quiz generator.

Create 5 multiple-choice questions based on the following content:
---
${textData}
---

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
`;

    const result = await model.generateContent(prompt);
    const answer = result.response.text();
    // const quiz = JSON.parse(answer);
    const message = await parseJSONData(result.response.text())
    console.log(message)

    await client.close();


    return NextResponse.json({ success: true, data: message }, { status: 200 })
}