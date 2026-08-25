import { DynamicTool } from "@langchain/core/tools";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { SystemMessage, HumanMessage, AIMessage, ToolMessage } from "@langchain/core/messages";

// Initialize the Gemini LLM
const getModel = () => {
  return new ChatGoogleGenerativeAI({
    // modelName: "gemini-3.6-flash",
    // model: "gemini-3.6-flash",
    model:'gemini-2.5-flash',
    temperature: 0.1,
    apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
  });
};

// Tool 1: RxNorm Search for active ingredients and brands
const rxNormTool = new DynamicTool({
  name: "rxnorm_search",
  description: "Query RxNorm to find active ingredients and branded/generic alternatives for a given drug name. Input should be a single drug name.",
  func: async (drugName) => {
    try {
      console.log(`[rxNormTool] Querying RxNorm for: ${drugName}`);
      const rxcuiRes = await fetch(`https://rxnav.nlm.nih.gov/REST/rxcui.json?name=${encodeURIComponent(drugName)}`);
      if (!rxcuiRes.ok) return `No RxNorm entry found for ${drugName}`;
      
      const rxcuiData = await rxcuiRes.json();
      const rxnormId = rxcuiData.idGroup?.rxnormId?.[0];
      if (!rxnormId) {
        return `No RxCUI found for drug: ${drugName}`;
      }

      const relatedRes = await fetch(`https://rxnav.nlm.nih.gov/REST/rxcui/${rxnormId}/allrelated.json`);
      if (!relatedRes.ok) return `RxCUI ${rxnormId} found, but failed to fetch related concepts.`;
      
      const relatedData = await relatedRes.json();
      const ingredients = [];
      const conceptGroups = relatedData.allRelatedGroup?.conceptGroup || [];
      for (const group of conceptGroups) {
        if (group.tty === "IN" || group.tty === "MIN") {
          const concepts = group.conceptProperties || [];
          for (const concept of concepts) {
            ingredients.push({
              rxcui: concept.rxcui,
              name: concept.name
            });
          }
        }
      }

      if (ingredients.length === 0) {
        return `RxCUI found: ${rxnormId}, but no active ingredients could be resolved.`;
      }

      // Find brands for the first active ingredient
      const mainIngredient = ingredients[0];
      const brandsRes = await fetch(`https://rxnav.nlm.nih.gov/REST/brands.json?ingredientids=${mainIngredient.rxcui}`);
      let brands = [];
      if (brandsRes.ok) {
        const brandsData = await brandsRes.json();
        const brandConcepts = brandsData.brandGroup?.conceptGroup?.[0]?.conceptProperties || [];
        brands = brandConcepts.map(b => b.name);
      }

      return JSON.stringify({
        inputDrug: drugName,
        rxnormId,
        ingredients: ingredients.map(i => i.name),
        brandedAlternatives: brands.slice(0, 10)
      });
    } catch (error) {
      console.error(`[rxNormTool] Error:`, error);
      return `Error querying RxNorm: ${error.message}`;
    }
  }
});

// Tool 2: openFDA Search for labelling details
const openFdaTool = new DynamicTool({
  name: "openfda_search",
  description: "Query openFDA for drug labeling details including description, indications (symptoms), and warnings/precautions. Input should be a drug name.",
  func: async (drugName) => {
    try {
      console.log(`[openFdaTool] Querying openFDA for: ${drugName}`);
      const cleanName = encodeURIComponent(drugName);
      const url = `https://api.fda.gov/drug/label.json?search=openfda.brand_name:"${cleanName}"+OR+openfda.generic_name:"${cleanName}"&limit=1`;
      
      let res = await fetch(url);
      if (!res.ok) {
        // Fallback to simpler search
        const fallbackUrl = `https://api.fda.gov/drug/label.json?search=openfda.generic_name:${cleanName}&limit=1`;
        res = await fetch(fallbackUrl);
        if (!res.ok) {
          return `No FDA label found for ${drugName}`;
        }
      }
      
      const data = await res.json();
      const result = data.results?.[0] || {};
      
      return JSON.stringify({
        brand_name: result.openfda?.brand_name?.[0] || "",
        generic_name: result.openfda?.generic_name?.[0] || "",
        description: result.description?.[0] || result.active_ingredient?.[0] || "No description available",
        indications_and_usage: result.indications_and_usage?.[0] || "No specific indications listed",
        warnings: result.warnings?.[0] || result.precautions?.[0] || "No precautions listed"
      });
    } catch (error) {
      console.error(`[openFdaTool] Error:`, error);
      return `Error querying openFDA: ${error.message}`;
    }
  }
});

// Tool 3: Tablet Image Search for pictures of physical pills
const tabletImageTool = new DynamicTool({
  name: "tablet_image_search",
  description: "Query a search engine to get a picture of the physical tablet, pill, or packaging. Input should be the drug name.",
  func: async (drugName) => {
    try {
      console.log(`[tabletImageTool] Querying images for: ${drugName}`);
      const query = `${drugName} tablet pill`;
      const url = `https://duckduckgo.com/?q=${encodeURIComponent(query)}`;
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      });
      if (!response.ok) return `Failed to load search page for ${drugName}`;
      
      const html = await response.text();
      const vqdRegex = /vqd=['"]?([^&'"]+)['"]?/;
      const match = html.match(vqdRegex);
      if (!match) {
        return `Could not extract search token for ${drugName}`;
      }
      const vqd = match[1];
      
      const iUrl = `https://duckduckgo.com/i.js?l=us-en&o=json&q=${encodeURIComponent(query)}&vqd=${vqd}`;
      const iResponse = await fetch(iUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'application/json'
        }
      });
      if (!iResponse.ok) return `Failed to load image results for ${drugName}`;
      
      const data = await iResponse.json();
      const imageUrl = data.results?.[0]?.image || "";
      return JSON.stringify({
        title: drugName,
        thumbnail: imageUrl,
        description: `Physical image of ${drugName} tablet`
      });
    } catch (error) {
      console.error(`[tabletImageTool] Error:`, error);
      return `Error querying tablet image: ${error.message}`;
    }
  }
});

// Tool 4: Price Search using CMS NADAC API
const priceTool = new DynamicTool({
  name: "price_search",
  description: "Query the CMS NADAC API to get national average acquisition cost/prices for a drug. Input should be the generic or brand drug name.",
  func: async (drugName) => {
    try {
      console.log(`[priceTool] Querying CMS NADAC for: ${drugName}`);
      // Find dynamic dataset identifier first
      const searchRes = await fetch("https://data.medicaid.gov/api/1/metastore/schemas/dataset/items?q=NADAC&limit=5");
      let datasetId = "as44-7fjh"; // fallback default
      if (searchRes.ok) {
        const searchData = await searchRes.json();
        const items = searchData.results || searchData || [];
        for (const item of items) {
          if (item.identifier) {
            datasetId = item.identifier;
            break;
          }
        }
      }

      // Query NADAC
      const queryUrl = `https://data.medicaid.gov/resource/${datasetId}.json?$where=lower(ndc_description)+like+'%25${encodeURIComponent(drugName.toLowerCase())}%25'&$limit=5`;
      const priceRes = await fetch(queryUrl);
      if (!priceRes.ok) {
        return `Price database query failed.`;
      }

      const priceData = await priceRes.json();
      if (priceData && priceData.length > 0) {
        const matches = priceData.map(p => {
          const perUnit = parseFloat(p.nadac_per_unit);
          const unit = p.pricing_unit || "EA";
          const desc = p.ndc_description;
          const est30 = (perUnit * 30).toFixed(2);
          return { desc, perUnit, unit, est30 };
        });
        return JSON.stringify(matches);
      }
      return `No exact price records found for ${drugName}`;
    } catch (error) {
      console.error(`[priceTool] Error:`, error);
      return `Error querying price API: ${error.message}`;
    }
  }
});

// List of tools
const tools = [rxNormTool, openFdaTool, tabletImageTool, priceTool];
const toolsMap = {
  rxnorm_search: rxNormTool,
  openfda_search: openFdaTool,
  tablet_image_search: tabletImageTool,
  price_search: priceTool,
};

// Custom ReAct agent implementation for maximum stability in Next.js runtime
export async function medicineAgent(medicineName) {
  const model = getModel();
  
  const systemPrompt = `You are a medical agent designed to suggest alternative medicines (tablets) for a given input medicine.
The user wants to find alternative tablets (at least 2, max 10).
For each alternative, you need to collect and verify details:
1. Brand or generic name
2. Pictures (image URL)
3. Price (price range or estimate in Indian Rupees - INR / ₹)
4. Content (active ingredients / strength details)
5. Symptoms (what indications or symptoms it is used for)
6. Precaution (warnings, contraindications, or precautions)

Your workflow is:
1. Search the input medicine "${medicineName}" in rxnorm_search to discover its active ingredients and generic/branded alternatives.
2. If it is a generic name, suggest other medicines in the same drug class or therapeutic class that treat similar symptoms.
3. Select at least 2 and up to 10 alternative medicines.
4. For each alternative, query openfda_search, tablet_image_search, and price_search to get their details. Trigger all tool calls for all alternatives in parallel in a single turn. Do not call them sequentially.
5. If any tool fails or returns no results, DO NOT retry it. Immediately use your internal clinical knowledge or fallbacks:
   - For pictures: use tablet_image_search. If it fails, use the fallback placeholder image URL "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500".
   - For prices: estimate a realistic Indian market Maximum Retail Price (MRP) in Indian Rupees (₹) (e.g. "₹50 - ₹120 for 10 tablets") based on your training data. Do not use US Dollars ($).
   - For content, symptoms, and precaution: if openfda_search fails, use your internal medical knowledge to describe them accurately.
6. Compile all the alternatives into a clean JSON array of objects. Only return the JSON list. Do not write any conversational text before or after the JSON.

Format of each object in the array:
{
  "name": "Alternative Name",
  "pictures": "Image URL",
  "price": "₹X - ₹Y for 10 tablets",
  "content": "Active ingredient details",
  "symptoms": "Indications / what symptoms it treats",
  "precaution": "Warnings / precautions"
}

Available tools:
- rxnorm_search: Use this to check active ingredients of the drug.
- openfda_search: Use this to get content, symptoms, and precaution.
- tablet_image_search: Use this to get pill, tablet or drug package pictures.
- price_search: Use this to check CMS average acquisition prices (note: NADAC prices are in USD; convert to INR or estimate Indian price).

Execute the tools step-by-step. Ensure you list at least 2 alternative tablets.`;

  // Bind tools to LLM
  const modelWithTools = model.bindTools(tools);

  let messages = [
    new SystemMessage(systemPrompt),
    new HumanMessage(`Please find alternative medicines (tablets) for "${medicineName}" and return them in the requested JSON format with prices in Indian Rupees (₹).`)
  ];

  // Run the ReAct agent loop
  let iterations = 0;
  const maxIterations = 15;
  
  while (iterations < maxIterations) {
    iterations++;
    console.log(`[Agent] Iteration ${iterations}`);
    
    // Call LLM
    const response = await modelWithTools.invoke(messages);
    
    // Check if the LLM requested tool calls
    const toolCalls = response.tool_calls || response.additional_kwargs?.tool_calls;
    if (toolCalls && toolCalls.length > 0) {
      // Append LLM's response to history
      messages.push(response);

      for (const call of toolCalls) {
        const toolName = call.name || call.function?.name;
        const callId = call.id;
        
        let args = call.args;
        if (call.function?.arguments) {
          try {
            args = typeof call.function.arguments === "string"
              ? JSON.parse(call.function.arguments)
              : call.function.arguments;
          } catch (e) {
            args = call.function.arguments;
          }
        }
        
        const tool = toolsMap[toolName];
        let toolResult = "";
        
        if (tool) {
          // Extract argument (usually a single string or query parameter)
          const query = typeof args === 'string' 
            ? args 
            : (args.query || args.input || Object.values(args)[0] || "");
          toolResult = await tool.func(query);
        } else {
          toolResult = `Tool ${toolName} not found.`;
        }

        console.log(`[Agent] Tool ${toolName} result length: ${toolResult.length}`);
        
        // Append tool response
        messages.push(new ToolMessage({
          content: toolResult,
          tool_call_id: callId,
          name: toolName
        }));
      }
    } else {
      // No more tool calls, return LLM response content
      console.log(`[Agent] Completed in ${iterations} iterations.`);
      return response.content;
    }
  }

  throw new Error("Agent reached max iterations without returning final JSON");
}
