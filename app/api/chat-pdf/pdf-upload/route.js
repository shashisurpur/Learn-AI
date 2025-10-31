import { NextResponse } from "next/server";
// import { Document } from 'langchain/document';
// import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import {RecursiveCharacterTextSplitter} from '@langchain/textsplitters'
// import { MemoryVectorStore } from 'langchain/vectorstores/memory'
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf'
import { MongoDBAtlasVectorSearch } from '@langchain/mongodb'
import connectDB from "@/config/db";

import MongoosEmbedding from "@/models/Embeddings";
import { MongoClient } from "mongodb";
// import PDF from "pdf-parse";
let vectorstores = null

// export const geminiEmbedding = new GoogleGenerativeAIEmbeddings({
//     apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
//     model: "text-embedding-004", // Gemini's embedding model
// });

export async function getVectorStore() {
  const client = await connectDB();
  const collection = client.db("ragdb").collection("pdf_chunks");

  return new MongoDBAtlasVectorSearch(geminiEmbedding, {
    collection,
    indexName: "vector_index", // name of your MongoDB Atlas vector index
    textKey: "chunk",
    embeddingKey: "embedding",
  });
}

export async function POST(req) {
  const formdata = await req.formData();

  const file = formdata.get('file');

  if (!file) return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });

  const fileName = file.name;

  const buffer = Buffer.from(await file.arrayBuffer());

  const blob = new Blob([buffer], { type: file.type || 'application/pdf' })
  const loader = new PDFLoader(blob);
  const docs = await loader.load()
  console.log("Pages loaded:", docs.length);
  //split into chunks
  const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000, chunkOverlap: 200 });

  const splitDocs = await splitter.splitDocuments(docs)

  //  Create embedding model (Gemini)
  const embeddings = new GoogleGenerativeAIEmbeddings({
    apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
    model: "text-embedding-004",
  });

  // MongoDB connection
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const db = client.db();

  const uploads = db.collection('ChatPdfs');
  const collection = db.collection("pdf_chunks");



  const indexes = await collection.indexes();
  console.log("indexes", indexes)
  // const knnIndexExists = indexes.some(idx => idx.key.embedding === "knnVector");

  // if (!knnIndexExists) {
  //   console.log("Creating KNN vector index...");
  //   await collection.createIndex(
  //     { embedding: "knnVector" },
  //     {
  //       name: "embedding_knn_index",
  //       vectorIndexOptions: {
  //         dimensions: 768,
  //         similarity: "cosine",
  //         model: "hnsw",
  //       },
  //     }
  //   );
  //   console.log("Vector index created!");
  // }

  //  Create Vector Store
  const vectorStore = new MongoDBAtlasVectorSearch(embeddings, {
    collection,
    indexName: "embedding_knn_index", // your MongoDB Atlas vector index name
    textKey: "text",
    embeddingKey: "embedding",
  });

  //  Add documents to store
  await vectorStore.addDocuments(splitDocs);

  await uploads.insertOne({
    fileName,
    uploadedAt: new Date(),
  });

  await client.close();

  return NextResponse.json({ success: true, message: "PDF processed and stored in memory" }, { status: 200 })
}

export { vectorstores }