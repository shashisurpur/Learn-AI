
// import { createAgent, tool } from "langchain";
import * as z from "zod";


import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { createAgent, tool } from "langchain";

const model = new ChatGoogleGenerativeAI({
    // model: "gemini-2.5-flash-lite",
    model:'gemini-2.5-flash',
    apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY
});

const generateQuiz = tool(
    ({ topic, numQuestions }) => {
        // Your quiz generation logic here
        return `Generated ${numQuestions} questions about ${topic}`;
    },
    {
        name: "generate_quiz",
        description: "Generate quiz questions on a topic",
        schema: z.object({
            topic: z.string(),
            numQuestions: z.number()
        })
    }
);

const agent = createAgent({
    model,
    tools: [generateQuiz],
    systemPrompt: `You are an AI that generates quizzes in JSON format.
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
});

export default async function quizAgent(prompt) {
    // Use the agent
    const result = await agent.invoke({
        messages: [{ role: "user", content: prompt }]
    });
    return result;
}

