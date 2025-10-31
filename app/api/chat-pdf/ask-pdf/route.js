import { NextResponse } from "next/server";
// import { vectorstores } from "../pdf-upload/route";
import { ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
// import connectDB from "@/config/db";
// import MongoosEmbedding from "@/models/Embeddings";
import { MongoClient } from "mongodb";
import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import { GoogleGenerativeAI } from '@google/generative-ai'

function cosineSimilarity(a, b) {
    const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
    const magA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
    const magB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
    return dot / (magA * magB);
}

const generateWithRetry = async(model, prompt,retries = 3) => {
    for (let i = 0; i < retries; i++) {
        try {
            const result = await model.generateContent(prompt);
            const answer = result.response.text();
            return answer
        } catch (err) {
            if (err.message.includes("503") && i < retries - 1) {
                const wait = Math.pow(2, i) * 1000; // 1s, 2s, 4s...
                console.warn(`Gemini overloaded, retrying in ${wait / 1000}s...`);
                await new Promise((r) => setTimeout(r, wait));
            } else {
                throw err;
            }
        }
    }
}

export async function POST(req) {
    const { question } = await req.json();

    // if (!vectorstores) return NextResponse.json({ success: false, error: 'No Pdf data found.Upload first' }, { status: 400 });

    // const retreiver = vectorstores.asRetriever();

    // const relavantDocs = await retreiver.getRelevantDocuments(question);
    // const context = relavantDocs.map((doc) => doc.pageContent).join('\n\n');

    // const embiddings = new GoogleGenerativeAIEmbeddings({
    //     apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
    //     model: "text-embedding-004",
    // })

    const embeddings = new GoogleGenerativeAIEmbeddings({
        apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
        model: "text-embedding-004",
    });
    // const questionEmbedding = await embiddings.embedQuery(question);

    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    const db = client.db();
    const collection = db.collection("pdf_chunks");
    // await collection.createIndex(
    //     { embedding: "knnVector" },
    //     {
    //         name: "embedding_knn_index",
    //         vectorIndexOptions: {
    //             dimensions: 768,
    //             similarity: "cosine",
    //             model: "hnsw"
    //         }
    //     }
    // );
    const indexes = await collection.indexes();
    console.log('Indexes', indexes);
    // console.log(collection,'collecton')
    const vectorStore = new MongoDBAtlasVectorSearch(embeddings, {
        collection,
        indexName: "embedding_knn_index", // your MongoDB Atlas vector index name
        textKey: "text",
        embeddingKey: "embedding",
    });

    const retriever = vectorStore.asRetriever({ k: 5 });
  
    console.log(retriever,'retriever')
    // const relevantDocs = await retriever.getRelevantDocuments(question);
    // const relevantDocs = await retriever.getRelevantDocuments
    // ? await retriever.getRelevantDocuments(question) // fallback if method exists
    // : await retriever.retrieve(question)
    const relevantDocs =await vectorStore.similaritySearch(question, 5);
    // const relevantDocs = await retriever.retrieve(question);
    // const allDocs = await retriever
    // const relevantDocs = await retriever.getRe (question);
    console.log("Retrieved docs:", relevantDocs.length);
    if (relevantDocs.length === 0) {
        return NextResponse.json({ success: false, message: 'No Data found' }, { status: 404 })
    }
    const oneDoc = await collection.findOne({});
    console.log("Embedding length:", oneDoc.embedding.length);
    const context = relevantDocs.map(d => d.pageContent).join("\n---\n");

    const model = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY).getGenerativeModel({
        model: "gemini-2.5-flash",
    });

    const prompt = `
You are a helpful assistant answering based on a document.

Context:
${context}

Question: ${question}
`;

    // const result = await model.generateContent(prompt);
    // const answer = result.response.text();
    const answer = await generateWithRetry(model,prompt)
    await client.close();


    // await connectDB();
    // const allDocs = await MongoosEmbedding.find({});

    // Rank by similarity
    // const docsWithScores = allDocs.map(doc => {
    //     return {
    //         ...doc._doc,
    //         score: cosineSimilarity(questionEmbedding, doc.embedding),
    //     };
    // });

    // Top 3 similar chunks
    // const topChunks = docsWithScores
    //     .sort((a, b) => b.score - a.score)
    //     .slice(0, 3);

    // const context = topChunks.map(doc => doc.text).join('\n\n');

    // const model = new ChatGoogleGenerativeAI({
    //     model: "gemini-2.5-flash",
    //     apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
    //     temperature: 0.4
    // })

    // const result = await model.invoke([
    //     { role: 'system', content: 'Use the provided context to answer the question' },
    //     { role: 'user', content: `Context: ${context}\n\nQuestion: ${question}` }
    // ])

    return NextResponse.json({ success: true, data: answer }, { status: 200 })
}