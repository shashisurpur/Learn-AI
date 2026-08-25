import { NextResponse } from "next/server";
// import { runAgent } from "@/lib/agent";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { medicineAgent } from "@/config/medicineAgent";

export async function POST(request) {
  try {
    const body = await request.json();
    let { medicineName, image } = body;

    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      return NextResponse.json(
        { error: "GOOGLE_GENERATIVE_AI_API_KEY is not configured in the server environment. Please set it in your environment variables." },
        { status: 500 }
      );
    }

    // If image is uploaded, use Gemini Vision to identify the medicine first
    if (image) {
      console.log("[API Route] Image detected, identifying medicine...");
      const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });

      // Clean the base64 prefix
      const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
      
      const imagePart = {
        inlineData: {
          data: base64Data,
          mimeType: "image/jpeg"
        },
      };

      const result = await model.generateContent([
        imagePart,
        "Identify the medicine, tablet, or pill bottle in this image. Give only the brand name or generic name of this medication. Do not write any other explanation or punctuation. Just return the name (e.g., 'Tylenol' or 'Aspirin'). If you cannot identify the drug, return 'unknown'."
      ]);

      const textResponse = result.response.text().trim();
      console.log(`[API Route] Identified name from image: "${textResponse}"`);
      
      if (textResponse.toLowerCase().includes("unknown") || textResponse.length > 60) {
        return NextResponse.json(
          { error: "Could not clearly identify the medicine from the uploaded image. Please try entering the name manually or uploading a clearer picture." },
          { status: 400 }
        );
      }
      
      medicineName = textResponse;
    }

    if (!medicineName || medicineName.trim() === "") {
      return NextResponse.json(
        { error: "Please provide a medicine name or upload an image." },
        { status: 400 }
      );
    }

    console.log(`[API Route] Querying alternatives for: "${medicineName}"`);
    const rawAgentOutput = await medicineAgent(medicineName);
    
    // Clean code block wrappers from LLM if present
    let jsonString = rawAgentOutput.trim();
    if (jsonString.startsWith("```")) {
      jsonString = jsonString.replace(/^```json\s*/i, "").replace(/```$/, "").trim();
    }

    let alternatives;
    try {
      alternatives = JSON.parse(jsonString);
    } catch (err) {
      console.error("[API Route] Failed to parse agent JSON:", jsonString);
      return NextResponse.json(
        { error: "The agent returned an invalid response format. Please try again.", raw: rawAgentOutput },
        { status: 500 }
      );
    }

    return NextResponse.json({
      identifiedName: medicineName,
      alternatives: Array.isArray(alternatives) ? alternatives : [alternatives]
    });
  } catch (error) {
    console.error("[API Route] Handler error:", error);
    return NextResponse.json(
      { error: error.message || "An unexpected error occurred while processing your request." },
      { status: 500 }
    );
  }
}
